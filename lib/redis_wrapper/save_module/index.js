const saveModelData = require('./save_model_data');

module.exports = {
	saveUser: data => saveModelData('users', data),
	saveMessage: data => saveModelData('messages', data),
	saveRoom: data => saveModelData('rooms', data)
};
