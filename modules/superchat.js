const redis = require("redis");
const redisClient = redis.createClient();

redisClient.on("connect", function() {
	console.log("connected to redis");
});

var superchat = {};

superchat.addNewRoom = function(room) {
	redisClient.rpush("rooms", room);
};

superchat.saveChatUsr = function(usr, room) {
	redisClient.rpush(`${room}Users`, usr);
};

superchat.saveChatMsg = function(msg, room) {
	redisClient.rpush(`${room}Messages`, msg);
};

superchat.readList = function(listname) {
	return new Promise((resolve, reject) => {
		redisClient.lrange(listname, 0, -1, (err, reply) => {
			if (err) {
				reject(err);
			}
			resolve(reply);
		});
	});
};

module.exports = superchat;
