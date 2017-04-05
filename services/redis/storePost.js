const shortid = require('shortid')

function storePost(postBody, username, roomName) {
  let id = shortid.generate()  
  redisClient.hmset(`room:${roomName}:messages:${id}`, {
      body: postBody, 
      username: username, 
      time: Date.now()
    }
  );
}


module.exports = storePost;