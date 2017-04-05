const express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
	res.render("index", {title: 'Superchat'});
})

router.post('/login', (req, res) => {
	let username = req.body.username;
	res.cookie('username', username);
	res.redirect('/chatroom');
})


module.exports = router;