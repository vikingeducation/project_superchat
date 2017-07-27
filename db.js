const { saveModule } = require('./lib/redis_wrapper');
const { saveUser, saveMessage, saveRoom } = saveModule;

const { hashSync: encodePassword } = require('bcryptjs');

for (let u = 0; u < 10; u++) {
	saveUser({
		username: `Some User ${u + 1}`,
		password: encodePassword(`Some Password ${u + 1}`),
		room_id: -1
	});
}

for (let r = 0; r < 10; r++) {
	saveRoom({
		name: `An Awesome Room ${r + 1}`
	});

	for (let m = 0; m < 10; m++) {
		saveMessage({
			body: `An awesome message ${m + 1}, hi VCS!`,
			gmt_created: new Date().getTime(),
			user_id: m,
			room_id: r
		});
	}
}
