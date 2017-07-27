module.exports = io => rooms => {
	io.emit('room_left', rooms);
};
