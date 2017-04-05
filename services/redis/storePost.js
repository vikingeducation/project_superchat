

function storePost(postBody) {
  redisClient.keys("messages:*", (err, keys) => {
    let count = keys.length + 1;
    redisClient.hset(`messages:${count}`, 'body', postBody);
  })
}

module.exports = storePost;