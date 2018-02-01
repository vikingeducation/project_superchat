const express = require('express');
const router = express.Router();
const ChatRooms = require('../lib/chat_rooms');
const login = require('../services/login_service');

/* GET home page. */
router.get('/', (req, res) => {
  const username = req.cookies.currentUser;
  const activeRoom = (req.cookies.chatRoom || 'General').replace(' ', '-');

  if (!username) {
    res.redirect('/login');
    return;
  }

  ChatRooms.getAll(username, activeRoom).then(allRooms => {
    res.render('index', allRooms);
  });
});

router.get('/login', (req, res) => {
  if (req.cookies.currentUser) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

router.post('/login', (req, res) => {
  var username = req.body.username.trim();

  login.addUser(username).then(() => {
    res.cookie('currentUser', username);
    res.redirect('/');
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie("currentUser");
  res.redirect('/login');
});

module.exports = router;
