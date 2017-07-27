const { saveModule } = require("./lib/redis_wrapper");
const { saveUser, saveMessage, saveRoom } = saveModule;

const { hashSync: encodePassword } = require("bcryptjs");

saveUser({
	username: "benny",
	password: "12345",
	room_id: -1
});

for (let r = 0; r < 5; r++) {
	saveRoom({
		roomname: `An Awesome Room ${r + 1}`
	});

	for (let m = 0; m < 5; m++) {
		saveMessage({
			body: `An awesome message ${m + 1}, hi VCS!`,
			gmt_created: new Date().getTime(),
			user_id: 1,
			room_id: r + 1
		});
	}
}
