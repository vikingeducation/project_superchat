const redisClient = require('redis').createClient();

const REDIS_USER_KEY = 'users';
module.exports = function(userId) {
	// Optional user id if we want a single user.
	let users = [];
	if (userId !== undefined && !isNaN(+userId)) {
		// Get a single user.
		return redisClient
			.hgetallAsync(`${REDIS_USER_KEY}:${userId}`)
			.then(user => {
				return [user];
			});
	} else {
		// Get all users.
		return redisClient.keysAsync(`${REDIS_USER_KEY}:*`).then(userKeys => {});
	}
	return users;
};
