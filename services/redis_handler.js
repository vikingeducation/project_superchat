const redis = require('redis');
const redisClient = redis.createClient();



//room: membercount
function joinRoom(room) => {
  return new Promise((resolve, reject) => {
    if
    redisClient.hincrby('chatRooms', room, 1)

  }
}

function exitRoom(room) => {
  redisClient.hdecrby('chatRooms', room, 1)
}

function createRoom(room) => {
  let Obj = {postCount: 0}
  redisClient.hmset(name, Obj)

}

function newMessage() => {


}

function getAllData() => {


}

module.exports = {
  
}
