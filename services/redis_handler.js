const redis = require('redis');
const redisClient = redis.createClient();



//room: membercount
function joinRoom(room) => {
  return new Promise((resolve, reject) => {
    resolve(redisClient.hincrby('chatRooms', room, 1))
  }
}

function exitRoom(room) => {
  return new Promise((resolve, reject) => {
    resolve(redisClient.hdecrby('chatRooms', room, 1))
  }
}

function createRoom(room) => {
  return new Promise((resolve, reject) => {
    let Obj = {postCount: 0}
    resolve(redisClient.hmset(name, Obj))
  }
}

function newMessage(room, user, message) => {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(data ()=>{
      return 

    })
    resolve(redisClient.hset(room, ))
  }
}

function getAllData() => {


}

module.exports = {
  
}
