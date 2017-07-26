var express = require("express");
var router = express.Router();

const { loadModule, saveModule } = require("../lib/redis_wrapper");
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
router.get("/", function(req, res, next) {
	_getHomePageData().then(homePageData => {
		res.render("index", {
			title: "Super Chat",
			rooms: homePageData.rooms,
			users: homePageData.users
		});
	});
});

function _getHomePageData() {
	return getRooms().then(rooms => {
		return new Promise(resolve => {
			getUsers().then(users => {
				rooms.sort((a, b) => {
					return a.id - b.id;
				});

				users.sort((a, b) => {
					return a.id - b.id;
				});

				resolve({ rooms: rooms, users: users });
			});
		});
	});
}

module.exports = router;
