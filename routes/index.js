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
	// GET TESTING
	//
	// getUsers().then(console.log);
	// getMessages().then(console.log);
	// getRooms().then(console.log);
	// getMessagesByRoomId(0).then(console.log, err => {
	// 	console.log(err.stack);
	// });
	// getUsersByRoomId(0).then(console.log);
	// getMessagesByUserId(1).then(console.log);

	// SAVE TESTING
	let saved = saveUser({ username: "billy", password: "billy" });
	console.log(saved, "??");
	// .catch(err => {
	// 	console.error(err.stack);
	// });

	res.render("index", { title: "Express" });
});

module.exports = router;
