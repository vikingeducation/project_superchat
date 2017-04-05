

function storePost(postBody, username) {
  redisClient.keys("messages:*", (err, keys) => {
    let count = keys.length + 1;
    redisClient.hmset(`messages:${count}`, {
        body: postBody, 
        username: username, 
        time: Date.now()
      }
    );
  })
}

module.exports = storePost;