var express = require('express');
var router = express.Router();
const Promise = require('bluebird');

const {
	getUsers,
	getRooms,
	getUsersByRoomId,
	getMessagesByRoomId
} = require('../lib/redis_wrapper').loadModule;

/* GET home page. */
router.get('/:roomId', function(req, res, next) {
	if (!req.cookies.username) {
		res.redirect('/login');
	} else {
		let roomId = req.params.roomId;
		let userId = req.cookies.user_id;
		Promise.all([
			getUsers(userId),
			getRooms(roomId),
			getUsersByRoomId(roomId),
			getMessagesByRoomId(roomId)
		]).then(dataArray => {
			let [user, room, users, messages] = dataArray;
			res.render('room', {
				layout: false,
				room: room[0],
				user: user[0],
				users: users,
				messages: messages
			});
		});
	}
});

module.exports = router;
