const Promise = require("bluebird");
const { typeExists, getUsers } = require("../../redis_wrapper/load_module");
const { saveUser } = require("../../redis_wrapper/save_module");
const { hashSync: encodePassword } = require("bcryptjs");

module.exports = function(userObj) {
	return typeExists("users", userObj.username).then(exists => {
		if (exists) {
			return Promise.reject(userObj);
		} else {
			userObj.password = encodePassword(userObj.password);
			return saveUser(userObj).then(() => userObj);
		}
	});
};
