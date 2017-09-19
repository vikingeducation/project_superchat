module.exports = io => roomData => {
	io.emit('room_left', roomData);
};
