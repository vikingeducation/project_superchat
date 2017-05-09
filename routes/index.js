var express = require('express');
var router = express.Router();
const debug = require('debug')('users');
const dataMgr = require('../bin/dataMgr');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.cookies.username);
  if (req.cookies.username !== undefined) {
    debug(`logged in with profile`);
    dataMgr.getUser(req.cookies.username).then(function(data) {
      res.render('index', {
        title: 'Super Chat',
        username: req.cookies.username,
        greeting: data.firstname + ' ' + data.lastname,
        firstname: data.firstname,
        lastname: data.lastname
      });
    });
  } else {
    debug(`not logged in`);
    res.render('index', {
      title: 'Super Chat',
      username: null,
      greeting: null,
      firstname: null,
      lastname: null
    });
  }

});

module.exports = router;
