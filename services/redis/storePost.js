var count = 1;

function storePost(postBody) {
  redisClient.hset(`messages:${count}`, 'body', postBody)
  count++
}

module.exports = storePost;