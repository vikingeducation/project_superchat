const Promise = require("bluebird");
const { userExists } = require("../../redis_wrapper/load_module");
module.exports = function(userObj) {
	return userExists(userObj.username).then(exists => {
		if (exists) {
			return Promise.reject(userObj);
		} else {
			userObj.password = encodePassword(userObj.password);
			return saveUser(userObj);
		}
	});
};
