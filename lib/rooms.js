const redisClient = require('redis').createClient();

// Each room has an ID and name
// Save room ID in redis list called ROOM_IDS
let saveRoomID = (roomID) => {
   return new Promise((resolve, reject) => {
      redisClient.lpush('ROOM_IDS', roomID, (err, reply) => {
         if(err) {reject(err);}
         else {
          console.log(`Room ID ${roomID} saved to 'ROOM_IDS.'`)   
          resolve(roomID);
         }
      });
   });
};

// Save room name in redis string with roomID as the key
let saveRoomName = (roomID, roomName) => {
   return new Promise((resolve, reject) => {
      redisClient.set(roomID, roomName, (err, reply) => {
         if(err) {reject(err);}
         else { 
          console.log(`Room named ${roomName} with room ID ${roomID} saved.`); 
          resolve(reply);
         }
      });
   });
};

// saveRoomID('jImeJvKl');
// saveRoomName('jImeJvKl', 'Room One');
// redisClient.get('jImeJvKl', (err, reply) => {
//    console.log(reply);
// });

// Get all room IDs from the ROOM_IDS list
let getRoomIDs = () => {
   return new Promise((resolve, reject) => {
      redisClient.lrange('ROOM_IDS', 0, -1, (err, roomIDs) => {
         if(err) { reject(err); }
         else console.log(`Room IDS: ${roomIDs}.`);
         resolve(roomIDs);
      });
   });
};

// works if you console.log roomIDs
// getRoomIDs();

// Retrieve room name given a roomID key
let getRoomName = (roomID) => {
  return new Promise((resolve, reject) => {
    redisClient.get(roomID, (err, roomName) => {
      if(err) { reject(err); }
      else // console.log(`Retrieved room name '${roomName}' with roomID '${roomID}'.`);
      resolve(roomName);
    });
  });
};

// Retrieve all rooms by getting list of room IDs
// Then binding them to the room names using .map
// How do these returns work??
let getAllRoomNames = () => {
  return (getRoomIDs().then((roomIDs) => {
    return Promise.all(roomIDs.map((roomID) => {
      return getRoomName(roomID);
    }));
  }));
};

// getAllRoomNames();

module.exports = {
   saveRoomID,
   saveRoomName,
   getRoomIDs,
   getRoomName,
   getAllRoomNames
};