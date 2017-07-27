const { saveMessage } = require('../../redis_wrapper/save_module');

// _handleNewMessage
module.exports = function(msgObj) {
	// Set the gmt_created property.
	msgObj.gmt_created = new Date().getTime();

	return saveMessage(msgObj).then(() => msgObj);
};
