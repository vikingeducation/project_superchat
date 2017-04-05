

function storePost(postBody) {
  redisClient.keys("messages:*", (err, keys) => {
    let count = keys.length + 1;
    redisClient.hmset(`messages:${count}`, 'body', postBody, 'time', Date.now());
  })
}

module.exports = storePost;