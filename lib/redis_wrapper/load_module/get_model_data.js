const redisClient = require('redis').createClient(
	'redis://h:pb4fcc90a203598d8db9834efcc0c67a02944a321958a99d9ec5b668458348f30@ec2-52-3-6-123.compute-1.amazonaws.com:31369'
);

// Generic function which handles getting model data from redis.
module.exports = function(type, typeId) {
	// Make sure we have a type at the very minimum.
	if (type === undefined || typeof type !== 'string') return [];

	// Did the user pass in an id or array of ids?
	if (typeId !== undefined) {
		if (!isNaN(+typeId)) {
			// If typeId is a number, we're fetching
			// a single entry of type.
			return _fetchSingleType(type, typeId);
		} else if (Array.isArray(typeId)) {
			// If typeId is an array, we're fetching
			// multiple entries of type, that correspond
			// to the ids in the array.
			return _fetchByTypeWithIds(type, typeId);
		} else {
			// Invalid parameter passed.
			return Promise.reject(Error('Invalid argument type for typeId'));
		}
	}
	// Grab all entries of a certain type.
	return _grabAllByType(type);
};

// Get a single type from redis.
function _fetchSingleType(type, id) {
	return redisClient.hgetallAsync(`${type}:${id}`).then(type => {
		return type ? [type] : [];
	});
}

// Get multiple of type from redis.
function _fetchByTypeWithIds(type, typeIds) {
	// Fetch all entries of type.
	return _grabAllByType(type).then(entries => {
		// Filter through results and only keep
		// entries that are in the typeIds array.
		return entries.filter(type => {
			return typeIds.includes(type.id);
		});
	});
}

// Grab all by a certain type (helper);
function _grabAllByType(type) {
	return redisClient.keysAsync(`${type}:*`).then(_getTypeData);
}

// Gets corresponding entries in redis from _grabAllByType.
function _getTypeData(typeKeys) {
	return Promise.all(
		typeKeys.map(typeKey => redisClient.hgetallAsync(typeKey))
	);
}
