const Promise = require("bluebird");
const { typeExists } = require("../../redis_wrapper/load_module");
const { saveRoom } = require("../../redis_wrapper/save_module");

const _getRoomId = roomname => rooms => {
	return rooms.find(room => room.roomname === roomname).id;
};

module.exports = function(roomObj) {
	return typeExists("rooms", roomObj.roomname).then(exists => {
		if (exists) {
			return Promise.reject(roomObj);
		} else {
			return saveRoom(roomObj).then(() => roomObj);
		}
	});
};
