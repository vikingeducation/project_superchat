var express = require('express');
var router = express.Router();
const Promise = require('bluebird');

const {
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
		Promise.all([
			getUsersByRoomId(roomId),
			getMessagesByRoomId(roomId),
			getRooms(roomId)
		]).then(dataArray => {
			let [users, messages, room] = dataArray;
			res.render('room', {
				room,
				users,
				messages
			});
		});
	}
});

module.exports = router;
