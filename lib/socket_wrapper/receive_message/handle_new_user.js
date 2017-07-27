const Promise = require('bluebird');
const { userExists, getUsers } = require('../../redis_wrapper/load_module');
const { saveUser } = require('../../redis_wrapper/save_module');
const { hashSync: encodePassword } = require('bcryptjs');

const _getUserId = username => users => {
	return users.find(user => user.username === username).id;
};

module.exports = function(userObj) {
	return userExists(userObj.username).then(exists => {
		if (exists) {
			return Promise.reject(userObj);
		} else {
			userObj.password = encodePassword(userObj.password);
			return saveUser(userObj).then(() => userObj);
		}
	});
};
