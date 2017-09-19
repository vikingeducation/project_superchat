// Require modules.
const redis = require('redis');

// Promisify everything.
const Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);

module.exports = {
	loadModule: require('./load_module'),
	saveModule: require('./save_module')
};
