const express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
  // 1 render a basic chatroom view
  // 2 do something with it.
  res.render('chatroom', {title: 'Superchat'})

})


module.exports = router;