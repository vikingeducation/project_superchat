const redisClient = require("redis");

var wrapperStuff = {
	saveMessage: (body, author, room) => {
		// messageID = generate a unique id
		redisClient.hmset(messageID, "body", body)
	},

	loadMessage: () => {

	},

	addRoom: () => {

	},

	addUser: () => {

	}
}

module.exports = wrapperStuff