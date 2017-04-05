const redis = require('redis').createClient();

const createRoom = (name) => {
  // step 1 create a hash with the name.
  // step 2 create a list
  return new Promise((resolve, reject) => {
    redis.hsetnx(`room-${name}`, 'name', name, (err, success) => {
        if (success) {
        redis.hsetnx('rooms', name, 0, (err, success) => {
          resolve(success);
        });
        }
    });
  })
}

const createMessage = (room, author, body) => {
  const messageID = `message-${Date.now()}`;

  let createMessageObj = new Promise((resolve, reject) => {
    redis.hmset(messageID, 'body', body, 'author', author, (err, success) =>{
      resolve();
    })
  })

  let addToQueue = new Promise((resolve) => {
    redis.lpush(`room-${room}-messages`, messageID, (err, success) =>{
      resolve();
    })
  })

  return Promise.all([createMessageObj,addToQueue]);
}

module.exports = {createRoom, createMessage};




