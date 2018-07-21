const mongoose = require('mongoose');
// tell mongoose to use ES6 Promises
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  original: {
    type: String,
    trim: true,
    required: 'URL is required'
  },
  short: {
    type: String,
    trim: true
  }
});

// define our indices
urlSchema.index({
  original: 'text',
  short: 'text'
});

// before a url is saved, we should generate the short url
urlSchema.pre('save', async function(next) {
  this.short = 'https://ls.glitch.me/' + generateShortSuffix(this._id);
  next();
});

// converts a doc's hexadecimal object id property to base 62 suffix
function generateShortSuffix(id) {
  let base62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  // convert base 16 to base 62
  // break it up into steps:
  // base 16 to base 10 to base 62
  let decimalValue = parseInt(id, 16);
  let suffix = [];
  while (decimalValue > 0) {
    let d = decimalValue % 62;
    suffix.push(base62[d]);
    decimalValue -= d;
    decimalValue /= 62;
  }
  return suffix.reverse().join('');
}

module.exports = mongoose.model('Url', urlSchema);