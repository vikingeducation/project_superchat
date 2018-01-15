const { generateUserInfo } = require('./generate');
const { getAllRoomNames } = require('./rooms');
const { getAllMessages } = require('./messages');

const getDisplayInfo = (username) => {
   let rooms;
   let messages;
   generateUserInfo(username);
   getAllRoomNames().then((roomNames) => {
      return roomNames;
   })
   .then(getAllMessages().then((messages) => {
      return messages;
   })).then((roomNames, messages) => {
      console.log(`Room names are: ${roomNames}`)
      console.log(`Messages are ${messages}.`);
   });
   
};

getDisplayInfo('robin5') ;

