const saveModelData = require('./save_model_data');
const updateTypeData = require('./update_type_data');

module.exports = {
	saveUser: data => saveModelData('users', data),
	saveMessage: data => saveModelData('messages', data),
	saveRoom: data => saveModelData('rooms', data),
	updateUserData: (id, field, value) =>
		updateTypeData('users', id, field, value)
};
