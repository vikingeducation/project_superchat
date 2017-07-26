var express = require('express');
var router = express.Router();

const { loadModule, saveModule } = require('../lib/redis_wrapper');
const { getUsers } = loadModule;

/* GET home page. */
router.get('/', function(req, res, next) {
	getUsers(0).then(console.log);
	res.render('index', { title: 'Express' });
});

module.exports = router;
