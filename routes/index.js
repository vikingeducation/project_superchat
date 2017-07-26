var express = require('express');
var router = express.Router();

const { loadModule, saveModule } = require('../lib/redis_wrapper');
const {
	getUsers,
	getMessages,
	getRooms,
	getMessagesByRoomId,
	getUsersByRoomId,
	getMessagesByUserId
} = loadModule;
const { saveUser, saveMessage, saveRoom } = saveModule;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

module.exports = router;
