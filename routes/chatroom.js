const express = require('express');
let router = express.Router();
const {getRooms} = require('../lib/redis_client');

router.get('/', (req, res) => {
  getRooms().then((roomsObj) => {
    let roomsList = (roomsObj) ? objectToArray(roomsObj) : []
  	res.render('chatroom', {title: 'Superchat', roomsList});
  })
})


module.exports = router;



function objectToArray(obj) {
  var keysArray = Object.keys(obj);
  return keysArray.map((key) => {
    return {name: key, numUsers: obj[key]}
  })
}