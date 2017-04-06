const express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
	res.render("index", {title: 'Superchat'});
})

router.post('/login', (req, res) => {
	let username = req.body.username;
  // create the user in redis
	res.cookie('username', username);
	res.redirect('/chatroom');
})

router.get('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/');
})


module.exports = router;