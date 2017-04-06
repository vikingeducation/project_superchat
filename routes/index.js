const express = require('express');
let router = express.Router();
let {createUser} = require('../lib/redis_client');

router.get('/', (req, res) => {
	res.render("index", {title: 'Superchat'});
})

router.post('/login', (req, res) => {
	let username = req.body.username;
  // create the user in redis
  createUser(username)
  	.then(() => {
			res.cookie('username', username);
			res.redirect('/chatroom');
		})
  	.catch(() => {
  		console.log("In route, user not created")
  		res.redirect('/');
  	})

})

router.get('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/');
})


module.exports = router;