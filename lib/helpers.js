const helper = (rooms, messages) => {

   let allObjects = [];
   for(let i = 0; i <= rooms.length; i++) {
      let roomObject = {};
      if(i === rooms.length) {
         return allObjects;
      }
      roomObject.room = '';
      roomObject.messages = [];
      // console.log('allMessages.room: ' + allMessages.room[i]);
      for(let j = 0; j < messages.length; j++) {
         let messageArray = [];
         let messageObject = {};
         messageObject.message = '';
         messageObject.user = '';
         if(rooms[i] === messages[j].roomName) {
            roomObject.room = messages[j].roomName; 
            messageObject.message = messages[j].message;
            messageObject.user = messages[j].username;
            // console.dir(messageObject);
            roomObject.messages.push(messageObject);
         }
         // push message object to roomObject.messages
      }
      allObjects.push(roomObject);
      
   }
};

/* 
   [{
      room: 'cats',
      messages: [{
         message: 'Cats are my favorite.'
         user: 'catluver'
      }]
   },
   {

   }]
*/

// let results = helper(['cats', 'dogs', 'horses'], 
// [{ message: 'Horses are my favorite', username: 'horseluver', roomName: 'horses'}, 
// {message: 'Dogs are my favorite.', username: 'dogluver', roomName: 'dogs'}, 
// { message: 'Cats are my favorite.', username: 'catluver', roomName: 'cats'}, 
// { message: 'Dogs are my second favorite.', username: 'horseluver', roomName: 'dogs'},
// { message: 'Cats are my second favorite.', username: 'dogluver', roomName: 'cats'}, 
// { message: 'Horses are my second favorite.', username: 'catluver', roomName: 'horses'}]);

// console.log(results);

module.exports = {
   helper
}