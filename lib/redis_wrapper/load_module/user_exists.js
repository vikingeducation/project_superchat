const getModelData = require("./get_model_data");

module.exports = function(username) {
	return getModelData("users").then(users => {
		return users.some(user => user.username === username);
	});
};
