var express = require("express");
var router = express.Router();

const { loadModule, saveModule } = require("../lib/redis_wrapper");
const {
	getUsers,
	getMessages,
	getRooms,
	getMessagesByRoomId,
	getUsersByRoomId
} = loadModule;

/* GET home page. */
router.get("/", function(req, res, next) {
	// getUsers().then(console.log);

	// getMessages().then(console.log);
	// getRooms().then(console.log);

	// getMessagesByRoomId(0).then(console.log, err => {
	// 	console.log(err.stack);
	// });

	getUsersByRoomId(0);

	res.render("index", { title: "Express" });
});

module.exports = router;
