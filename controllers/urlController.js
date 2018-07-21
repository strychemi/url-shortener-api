const mongoose = require('mongoose');
const Url = mongoose.model('Url');
const axios = require('axios');

/*
  URL module (a built-in, core NodeJS Module)
  
  Provides utilities for URL resolution and parsing.
  This is preferrable to unintelligible Regex expressions that 
  I won't remember 2 weeks from now to parse URL strings.
  
  https://nodejs.org/api/url.html#url_url
*/
const { URL } = require('url');

/*
  1. Check if the parameter is a valid URL.
  2. If it is, then query our DB if it's already saved.
  4. If it is saved in our DB, before returning the JSON with the shortened URL,
    check our cached threats, if the cache duration has expired, then make another call to
    Google Safe Browsing Lookup API.
      i. If it's still a threat, update our cache, then return the null JSON response.
      ii. If it's not, persist it to our DB.
*/
exports.checkURL = async (req, res, next) => {
  // grab the url suffix
  let urlSuffix = req.params.url;
  let url = await Url.findOne({ short: 'https://ls.glitch.me/' + urlSuffix});
  if (!url) {
    // our catchErrors wrapper will catch this as next will pass this error obj to it
    return next({ message: 'That filetype isn\'t allowed!' });
  } else {
    return res.redirect(url.original);
  }
};

/*
  1. parse the url
  2. If it's not valid, it'll immediately throw an error, which will be handled by catchErrors
  3. If it is valid, make a HEAD request to check if the URL "lives" in the internet
  4. If it does, query our DB if it exists
  5. If it's in our DB, return the json response.
  6. If it's not in our DB:
    1. save to our DB, then return response.
*/
exports.parseNewURL = async (req, res, next) => {
  // throws a 'TypeError' if the input URL is not valid, our catchError will handle the thrown error
  let parsedUrl = new URL(req.params[0]);
  // the reason we use a library to make a req is because:
  // 1. we don't need a fully fledged GET reqest to make sure the URL is 'live'
  // 2. there is a potential the server we are hitting will redirect our request, 
  // leading to possible infinite request cycle, axios limits maxDirects to 5 by default
  let response = await axios({
    url: parsedUrl.href,
    method: 'head', // we don't need a fully fledged GET request to make sure the URL is 'live'
    // maxRedirects: 5 // this is the default, but change as needed
  });
  
  if (response.status === 200) {
    // check our DB to check if we already have this link
    let url = await Url.findOne({ original: parsedUrl.href });
    
    if (!url) {
      url = await (new Url({ original: parsedUrl.href })).save();
    }
    res.json(generateJSON(url));
  }
};

function generateJSON(url) {
  return {
    original: url.original,
    short: url.short
  };
}