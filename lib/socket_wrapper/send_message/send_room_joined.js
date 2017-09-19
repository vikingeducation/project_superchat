module.exports = io => roomData => {
	io.emit('room_joined', roomData);
};
