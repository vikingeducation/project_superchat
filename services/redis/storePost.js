function storePost(postBody) => {
  postObject = {
    body: postBody
  }
  redisClient.hset("messages", postObject)
}