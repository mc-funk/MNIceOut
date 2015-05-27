var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  var file = request.params[0] || 'views/index.html';
  response.sendFile(path.join(__dirname, './public', file));
});

module.exports = router;
