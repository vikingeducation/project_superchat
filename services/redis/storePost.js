function storePost(postBody) {
  postObject = {
    body: postBody
  }
  redisClient.lpush("messages", postObject, (err, data) => {
    if (err) {
      throw err;
    }
    console.log(data);
  })
}

module.exports = storePost;