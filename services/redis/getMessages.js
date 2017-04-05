function getKeysProm() {
  return new Promise(resolve => {
    redisClient.keys('messages:*', (err, keys) => {
      if (err) throw err;
      resolve(keys)
    })
  })
}

function messagesArrayProm(keys) { 
  let messagesArray = [];
  return new Promise(resolve => {

    keys.forEach(key => {
      redisClient.hgetall(key, (err, message) => {
        messagesArray.push(message);
        console.log('keys length', keys.length)
        console.log('messArray length', messagesArray.length)
        if (keys.length === messagesArray.length) {
          console.log(messagesArray)
          resolve(messagesArray)
        }
      })
    })
  })
}

function getMessages() {
  return new Promise(resolve => {
    getKeysProm()
    .then(messagesArrayProm)
    .then(messageArray => {
      resolve(messageArray)
    })
  }) 
}

module.exports = getMessages


