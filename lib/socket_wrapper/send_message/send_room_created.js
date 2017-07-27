const { getRooms } = require("../../redis_wrapper/load_module");

const _getRoomId = roomname => rooms => {
	return rooms.find(room => room.roomname === roomname).id;
};

module.exports = io => roomObj => {
	// Get the newly created user's id from redis.
	getRooms().then(rooms => {
		roomObj.id = _getRoomId(roomObj.roomname)(rooms);

		console.log(
			`New message: Room data was saved! [ UserID: ${roomObj.roomname} ]`
		);

		io.emit("room_created", roomObj);
	});
};
