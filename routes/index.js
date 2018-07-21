const express = require('express');
const router = express.Router();
const path = require('path');
const urlController = require('../controllers/urlController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/:url', urlController.checkURL);

// can't set ':url' parameter, since urls strings will contain slashes, so it'll mess up the routing
// using /new/* is called wildcard routing and it's used to tackle the issue of dynamic routes
// req.hostname will give the base URL, req.params[0] will give you the URL string as parameter
router.get('/new/*', catchErrors(urlController.parseNewURL));

module.exports = router;