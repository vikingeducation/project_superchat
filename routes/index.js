var express = require('express');
var router = express.Router();

const {
	getUsers,
	getRooms,
	getUsersByRoomId,
	getMessagesByRoomId,
	getMessagesByUserId
} = require('../lib/redis_wrapper').loadModule;

/* GET home page. */
router.get('/', function(req, res, next) {
	if (!req.cookies.username) {
		res.redirect('/login');
	} else {
		_getHomePageData().then(homePageData => {
			homePageData.username = req.cookies.username;
			res.render('index', homePageData);
		});
	}
});

function _getHomePageData() {
	return Promise.all([getRooms(), getUsers()]).then(results => {
		// Sort each array by id.
		results = results.map(arr => {
			arr.sort((a, b) => a.id - b.id);
			return arr;
		});
		let [rooms, users] = results;
		return {
			page: 'index',
			title: 'Super Chat',
			rooms: rooms,
			users: users
		};
	});
}

module.exports = router;
