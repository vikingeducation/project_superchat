var express = require('express');
var router = express.Router();
const debug = require('debug')('users');
const dataMgr = require('../bin/dataMgr');

/* user validation */
router.post('/', function(req, res, next) {
  // check that username in login form exists --> if it does set cookie and redirect to home
  // otherwise show profile page to create user
  debug(`looking for user`);
  dataMgr.isUser(req.body.username).then(function(data){
    if (data === 1) {
      debug(`${req.body.username} exists`);
      res.cookie("username", req.body.username);
      res.redirect("/");
    } else {
      debug(`${req.body.username} does not exist`);
      res.render('users', { title: 'Super Chat: Create Profile',
                            update: false,
                            greeting: 'New User',
                            username: req.body.username,
                            firstname: 'First Name',
                            lastname: 'Last Name',
                            createdDate: new Date(Date.now())
                            });
    };
  });
});

router.get('/profile/:username', function(req, res, next) {
  debug(`display profile info for "${req.params.username}"`);
  dataMgr.getUser(req.params.username).then(function(data) {
    res.render('users', { title: 'Super Chat: User Profile',
                          update: true,
                          greeting: data.firstname,
                          username: req.params.username,
                          firstname: data.firstname,
                          lastname: data.lastname,
                          createdDate: new Date(data.created) });
  });
});

router.post('/profile/:username', function(req, res, next) {
  debug(`saving user profile for ${req.params.username}`);
  let profile = {firstname: req.body.firstname,
                 lastname: req.body.lastname,
                 created: Date.now()};
  dataMgr.addUser(req.params.username, profile).then(function(data) {
    res.cookie("username", req.params.username);
    res.redirect("/");
  });
});

router.get('/logout', function(req, res, next){
  debug(`loging user "${req.cookies.username}" out`);
  res.clearCookie("username");
  res.redirect("/");
});

module.exports = router;
