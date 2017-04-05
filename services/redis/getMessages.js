function getMessages() {
  messagesArray = [];

  redisClient.keys('messages:*', (err, keys) => {
    if (err) throw err;
    console.log(keys);
    keys.forEach(key => {
      redisClient.hgetall(key, (err, message) => {
        messagesArray.push(message);
      })
      if (keys.length === messagesArray.length) {
        console.log(messagesArray);
        return messagesArray;
      }
    })

  })


}

module.exports = getMessages;