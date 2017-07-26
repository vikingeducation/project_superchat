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
	if (!req.cookies.username) {
		res.redirect('/login');
	} else {
		_getHomePageData().then(homePageData => {
			res.render('index', homePageData);
		});
	}
});

function _getHomePageData() {
	return getRooms().then(rooms => {
		return new Promise(resolve => {
			getUsers().then(users => {
				// Sort each list of data by id.
				[rooms, users].forEach(arr => {
					arr.sort((a, b) => {
						return a.id - b.id;
					});
				});

				// Pass back to handler.
				resolve({
					page: 'index',
					title: 'Super Chat',
					rooms: rooms,
					users: users
				});
			});
		});
	});
}

module.exports = router;
