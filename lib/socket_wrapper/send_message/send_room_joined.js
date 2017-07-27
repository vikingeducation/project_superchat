module.exports = io => rooms => {
	io.emit('room_joined', rooms);
};
