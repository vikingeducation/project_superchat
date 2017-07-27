var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
	if (req.cookies.username) {
		res.redirect('/');
	} else {
		res.render('login', {
			layout: 'login',
			page: 'login',
			title: 'Please enter a username for Super Chat'
		});
	}
});

module.exports = router;
