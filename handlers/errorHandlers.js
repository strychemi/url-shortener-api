/*
  Catch Errors Handler

  Instead of applying try{} catch(e) {} in every controller function, 
  we wrap the any async/await function (or any that can throw errors) in catchErrors(), 
  which will handle any errors thrown, and pass it along to via express middleware with next()
*/
exports.catchErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/*
  Respond with JSON detailing the error, since this is an API.
*/
exports.errorResponse = (err, req, res, next) => {
  res.json({'error': err.message});
};