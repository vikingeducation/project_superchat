const redisClient = require('redis').createClient();

module.exports = function(type, typeId) {
	// Optional type id if we want a single type.
	if (typeId !== undefined && !isNaN(+typeId)) {
		// Get a single type.
		return redisClient.hgetallAsync(`${type}:${typeId}`).then(type => {
			if (type) {
				return [type];
			}

			return [];
		});
	} else {
		// Get all types.
		return redisClient.keysAsync(`${type}:*`).then(_getTypeData);
	}
};

function _getTypeData(typeKeys) {
	return Promise.all(
		typeKeys.map(typeKey => redisClient.hgetallAsync(typeKey))
	);
}
