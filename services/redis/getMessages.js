function getMessages() {
  messagesArray = [];
  
  redisClient.keys('messages:*', (err, keys) => {
    if (err) throw err;
    console.log(keys)
    keys.forEach(key => {
      redisClient.hgetall(key, (err, message) => {
        messagesArray.push(message);
      })
    })
  })

}