const redis = require('redis').createClient();

const {createRoom, createMessage} = require('./lib/redis_client');


//createRoom("dogs");


// redis.hgetall('room-dogs', (err, data) => {
// 	console.log(data);
// });

// redis.hgetall('rooms', (err, data) => {
// 	console.log(data);
// });

createMessage('dogs', 'nicolas', 'i like dogs').then(function(){
  redis.lrange('room-dogs-messages', 0, -1, (err, data) =>{
    if(err) throw err
    console.log(data)
  })
})





// const createMessage = (room, author, body) => {
//   const messageID = `message-${Date.now()}`;

//   let createMessage = new Promise((resolve, reject) => {
//     redis.hmsetnx(messageID, 'body', body, 'author', author, (err, success) =>{
//       resolve();
//     })
//   })

//   let addToQueue = new Promise((resolve) => {
//     redis.lpush(`room-${room}-messages`, messageID, (err, success) =>{
//       resolve();
//     })
//   })

//   return Promise.all([createMessage,addToQueue]);
// }