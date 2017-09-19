const getModelData = require('./get_model_data');

module.exports = (dataType, name) => {
	return getModelData(dataType).then(types => {
		return types.some(
			type => type[dataType.slice(0, -1).concat('name')] === name
		);
	});
};
