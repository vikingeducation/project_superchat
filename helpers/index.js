const HelperLoader = require('load-helpers');
const helperLoader = new HelperLoader();

const helpers = helperLoader.load('helpers/*_helper.js').cache;

module.exports = helpers;
