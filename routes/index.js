var express = require('express');
var router = express.Router();

const { loadModule, saveModule } = require('../lib/redis_wrapper');
const { getModelData, getMessagesByRoomId } = loadModule;

/* GET home page. */
router.get('/', function(req, res, next) {
	//getModelData('users').then(console.log);
	// getMessagesByRoomId(0).then(console.log, err => {
	// 	console.log(err.stack);
	// });
	res.render('index', { title: 'Express' });
});

module.exports = router;
