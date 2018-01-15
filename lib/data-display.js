const { generateUserInfo } = require('./generate');
const { getAllRoomNames } = require('./rooms');
const { getAllMessages } = require('./messages');

const getDisplayInfo = (username, callback) => {

      let displayInfo = {};
      displayInfo.rooms = [];
      displayInfo.messages = [];

      return Promise.all([getAllRoomNames(), getAllMessages()]).then((results) => {
         displayInfo.rooms = results[0];
         displayInfo.messages = results[1];
         callback(null, displayInfo);
      }) 
      .catch((err) => { reject(err); });
   
};

// test works
// getDisplayInfo('robin7', (err, results) => {
//    let displayInfo = results;
//    console.dir(results);
// });

let exampleRooms = ['dogs', 'cats', 'other'];
let exampleMessages = [
   {
      message: 'i love dogs',
      username: 'dogluver',
      roomName: 'dogs'
   },
   {
      message: 'i love cats',
      username: 'catluver',
      roomName: 'cats'
   },
   {
      message: 'i love other',
      username: 'otherluver',
      roomName: 'other'
   }
];

// roomNames is an array of strings, messages is an array of message objects
const associateRoomsMessages = (roomNames, messages, callback) => {
   const uniqueArray = (arr) => [...new Set(arr)];
   let uniqueRooms = uniqueArray(roomNames);
   // array of objects 
   let hbsArray = [];

   for(i = 0; i <= (uniqueRooms.length - 1); i++) {
      let hbsRoom = {};
      hbsRoom.roomName = uniqueRooms[i];
      hbsRoom.messages = [];

      for(j = 0; j <= (messages.length - 1); j++) {
         if((messages[j].roomName) && (messages[j].roomName === uniqueRooms[i])) {
            hbsRoom.messages.push(messages[j]);
         }
      }
      hbsArray.push(hbsRoom);
      if(i === (uniqueRooms.length - 1)) {
         callback(null, hbsArray);
      }
   }

};

associateRoomsMessages(exampleRooms, exampleMessages, (err, hbsArray) => {
   let messages = hbsArray[0].messages;
   console.log(messages);
});

module.exports = {
   getDisplayInfo,
   associateRoomsMessages
};

/*

   let parse = (uniqueRooms, callback) => {
      
      let requests = [1,2,3].map((item) => {
         return new Promise((resolve) => {
            asyncFunction(item, resolve);
         });
      })
      
      Promise.all(requests).then(() => console.log('done'));
      

      let roomForEach = (roomName, resolve) => {
         
      };
      
      let roomMessages = uniqueRooms.map((roomName) => {
         return new Promise((resolve) => {

         });
      });
      
      
      uniqueRooms.forEach((roomName) => {
         messages.forEach((message) => {
            if(message.roomName) {
               if(message.roomName === roomName) {
                  roomMessages.push(message);
               }
            }
         });
      });
      callback(null, uniqueRooms);
   };
*/