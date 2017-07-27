const { saveModule } = require('./lib/redis_wrapper');
const { saveUser, saveMessage, saveRoom } = saveModule;

const { hashSync: encodePassword } = require('bcryptjs');

saveUser({
	username: 'Andrew',
	password: '12345',
	room_id: -1
});

for (let r = 0; r < 5; r++) {
	saveRoom({
		roomname: `An Awesome Room ${r + 1}`
	});
}
