const redisClient = require('redis').createClient();

// Store messages in redis list named "MESSAGE_IDS"
let saveMessageID = (messageID) => {
   return new Promise((resolve, reject) => {
     redisClient.lpush("MESSAGE_IDS", messageID, (err, reply) => {
       if(err) { reject(err); }
       else {
         reject(`Message ID ${messageID} saved to MESSAGE_IDS`);
         resolve(messageID);
       }
     });
   });
 };
 
 // Save message info in hash using message ID as key
 // Message content, who posted it, and which room
 let saveMessage = (messageID, message, username, roomName) => {
   return new Promise((resolve, reject) => {
     redisClient.hmset(messageID, {
       message: message, 
       username: username,
       roomName: roomName
     }, (err, reply) => {
       if(err) { reject(err); }
       else {
         console.log(`Message: ${message} created by ${username} in ${roomName}`);
         resolve();
       }
     });
   });
 };
 
// Get message hash using message ID as key
// Resolve promise with message object
let getMessage = (messageID) => {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(messageID, (err, message) => {
      if(err) { reject(err); }
      else {
        // console.dir(message);
        resolve(message);
      }
    });
  });
};

// getMessage('B1WfGHK');
 
// Get all message IDs from list
// Resolve promise with messageIDs array
let getMessageIDs = () => {
   return new Promise((resolve, reject) => {
      redisClient.lrange('MESSAGE_IDS', 0, -1, (err, messageIDs) => {
         if(err) { reject(err); }
         else {
         console.log(`MESSAGE_IDS: ${messageIDs}`)
         resolve(messageIDs);
         }
      });
   });
};

// getMessageIDs();

let getAllMessages = () => {
   return getMessageIDs().then((messageIDs) => {
      return Promise.all(messageIDs.map((messageID) => {
        return getMessage(messageID); 
      }));
   });
};

// getAllMessages();

module.exports = {
   saveMessageID,
   saveMessage,
   getMessage,
   getMessageIDs,
   getAllMessages
}