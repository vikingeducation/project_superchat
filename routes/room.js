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
			getUsers(),
			getMessagesByRoomId(roomId)
		]).then(dataArray => {
			let [user, room, users, messages] = dataArray;
			messages = messages.map(message => {
				let userObj = users.find(user => {
					return user.id === message.user_id;
				});
				message.username = userObj.username;
				return message;
			});
			messages.sort((a, b) => a.id - b.id);

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
