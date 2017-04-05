const shortid = require('shortid')

function storePost(postBody, username, roomName) {
  let id = shortid.generate()  
  redisClient.hmset(`messages:${id}`, {
      body: postBody, 
      username: username, 
      time: Date.now()
    }
  );
}

function addMessageToRoom(messageID) {
  redisClient.hmsetnx()
} 

module.exports = storePost;