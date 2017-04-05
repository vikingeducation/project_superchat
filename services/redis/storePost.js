const shortid = require('shortid')

function storePost(postBody, username) {
  let id = shortid.generate()  
  redisClient.hmset(`messages:${id}`, {
      body: postBody, 
      username: username, 
      time: Date.now()
    }
  );
}

// function addMessageToRoom(messageID) {
//   let id = shortid.generate() 
// } 

module.exports = storePost;