const { saveModule } = require('./lib/redis_wrapper');
const { saveUser, saveMessage, saveRoom } = saveModule;

const { hashSync: encodePassword } = require('bcryptjs');

// saveUser({ username: 'billy', password: 'billy' }).then(result => {
// 	console.log(!!result);
// });
// saveRoom({ name: 'An Awesome Room' }).then(result => {
// 	console.log(!!result);
// });
// saveMessage({
// 	body: 'An awesome message, hi VCS!',
// 	gmt_created: 0,
// 	user_id: 0,
// 	room_id: 0
// }).then(result => {
// 	console.log(!!result);
// });

for (let u = 0; u < 10; u++) {
	saveUser({
		username: `Some User ${u + 1}`,
		password: encodePassword(`Some Password ${u + 1}`)
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

process.exit(1);
