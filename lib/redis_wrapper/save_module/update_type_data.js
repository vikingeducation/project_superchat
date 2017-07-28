let redisClient = require('redis');

if (process.env.ENV_NODE && process.env.ENV_NODE === 'production') {
	redisClient = redisClient.createClient(
		'redis://h:pb4fcc90a203598d8db9834efcc0c67a02944a321958a99d9ec5b668458348f30@ec2-52-3-6-123.compute-1.amazonaws.com:31369'
	);
} else {
	redisClient = redisClient.createClient();
}

module.exports = function(type, id, field, value) {
	return redisClient.hsetAsync(`${type}:${id}`, field, value);
};
