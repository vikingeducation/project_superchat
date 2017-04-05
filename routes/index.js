const express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
	res.end("Hello World!");
})


module.exports = router;