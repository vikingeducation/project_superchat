const redisClient = require('redis').createClient();

module.exports = function(type, id, field, value) {
	return redisClient.hsetAsync(`${type}:${id}`, field, value);
};
