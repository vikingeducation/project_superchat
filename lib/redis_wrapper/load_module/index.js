const getModelData = require('./get_model_data');
const getMessagesByTypeId = require('./get_messages_by_type_id');

module.exports = {
	getUsers: id => getModelData('users', id),
	getMessages: id => getModelData('messages', id),
	getRooms: id => getModelData('rooms', id),
	getMessagesByRoomId: id => getMessagesByTypeId('rooms', id),
	getMessagesByUserId: id => getMessagesByTypeId('users', id),
	getUsersByRoomId: require('./get_users_by_room_id'),
	userExists: require('./user_exists')
};
