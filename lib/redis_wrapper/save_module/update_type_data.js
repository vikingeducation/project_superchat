let redisClient = require('redis');

if (process.env.ENV_NODE && process.env.ENV_NODE === 'production') {
	redisClient = redisClient.createClient(process.env.REDIS_URL);
} else {
	redisClient = redisClient.createClient(process.env.REDIS_URL);
}

module.exports = function(type, id, field, value) {
	return redisClient.hsetAsync(`${type}:${id}`, field, value);
};
