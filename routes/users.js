var express = require('express');
var router = express.Router();
let cookierParser = require('cookie-parser');
let bodyParser = require('body-parser');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login', {});
});


module.exports = router;
