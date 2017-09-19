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
		_getHomePageData(req.cookies.user_id)
			.then(homePageData => {
				// homePageData.rooms = homePageData.rooms.map(room => {
				// 	if (room.id === homePageData.user.room_id) {
				// 		room.active = true;
				// 	}
				// 	return room;
				// });
				res.render('index', homePageData);
			})
			.catch(err => {
				console.log(err.stack, '??????');
			});
	}
});

function _getHomePageData(userId) {
	return Promise.all([getUsers(userId), getRooms()]).then(results => {
		// Sort each array by id.
		results = results.map(arr => {
			arr.sort((a, b) => a.id - b.id);
			return arr;
		});
		let [user, rooms] = results;
		return {
			page: 'index',
			title: 'Super Chat',
			user: user[0],
			rooms: rooms
		};
	});
}

module.exports = router;
