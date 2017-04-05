function getKeysProm(pattern) {
  return new Promise(resolve => {
    redisClient.keys(pattern, (err, keys) => {
      if (err) throw err;
      resolve(keys)
    })
  })
}

function hashToArrayProm(keys) { 
  let hashesArray = [];
  return new Promise(resolve => {
    if (keys.length === 0) {
      resolve(hashesArray);
    }
    keys.forEach(key => {
      redisClient.hgetall(key, (err, value) => {
        hashesArray.push(value);
        if (keys.length === hashesArray.length) {
          resolve(hashesArray)
        }
      })
    })
  })
}

function getValues(pattern) {
  return new Promise(resolve => {
    getKeysProm(pattern)
    .then(hashToArrayProm)
    .then(hashesArray => {
      resolve(hashesArray)
    })
  }) 
}

module.exports = getValues;