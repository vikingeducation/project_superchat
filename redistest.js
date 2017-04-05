const redis = require('redis').createClient();

const {createRoom, createMessage, getMessages} = require('./lib/redis_client');


//createRoom("dogs");


// redis.hgetall('room-dogs', (err, data) => {
// 	console.log(data);
// });

// redis.hgetall('rooms', (err, data) => {
// 	console.log(data);
// });

//createMessage('dogs', 'tom', 'i like cats').then( () => {
//redis.lrange('room-dogs-messages', 0, -1, (err, data) =>{
// data.forEach( (message) =>{
//   redis.hgetall(message, (err1, data1) => {
//     console.log(data1);
//   })
// })
//})
//})


getMessages('dogs').then((messages) => {
	console.log("\n\n\n\nMessages: ", messages);
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