var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/*', function(req, res, next) {
  var file = req.params[0] || 'views/index.html';
  console.log(file);
  res.sendFile(path.join(__dirname, '../public', file));
});

module.exports = router;
