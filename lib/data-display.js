const { generateUserInfo } = require('./generate');
const { getAllRoomNames } = require('./rooms');
const { getAllMessages } = require('./messages');

const getDisplayInfo = (username, callback) => {

      let displayInfo = {};
      displayInfo.rooms = [];
      displayInfo.messages = [];

      // separate out from this function
      generateUserInfo(username);

      return Promise.all([getAllRoomNames(), getAllMessages()]).then((results) => {
         displayInfo.rooms = results[0];
         displayInfo.messages = results[1];
         callback(null, displayInfo);
      });
   
};

// test works
// getDisplayInfo('robin7', (err, results) => {
//    let displayInfo = results;
//    console.dir(results);
// });

module.exports = {
   getDisplayInfo
};