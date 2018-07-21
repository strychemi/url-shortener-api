const mongoose = require('mongoose');

// connect to our DB
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // tell mongoose ot use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// import all our models
require('./models/Url');

// import all our other tools
const express = require('express');
const app = express();
const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// organize all our routes via routes/index.js
app.use('/', routes);

// error handler via JSON
app.use(errorHandlers.errorResponse);

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
