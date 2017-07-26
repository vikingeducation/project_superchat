const redisClient = require("redis").createClient();

const dataMap = {
	users: ["username", "password"],
	messages: ["body", "gmt_created", "user_id", "room_id"],
	rooms: ["name"]
};

module.exports = function(type, data) {
	console.log("???");
	if (type === undefined || !Object.keys(data).every(dataMap[type].includes)) {
		console.log("is undefined type");
		return;
	}

	console.log("???wtd");

	return new Promise((resolve, reject) => {
		redisClient.incr(`counts:${type}`, (err, data) => {
			if (err) {
				reject(err);
			}

			resolve(data);
		});
	});

	// return redisClient.incrAsync(`counts:${type}`).then(newId => {

	// 	data.id = newId;

	// 	return redisClient.hsetAsync(`${type}:${data.id}`, data);
	// });
};
