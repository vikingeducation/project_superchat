const redisClient = require("redis").createClient();

const { storeUsername } = {
  storeUsername: (username) => {
    return new Promise((resolve, reject) => {
      redisClient.lpush("usernames", username, (err, reply) => {
        if(err) reject(err);
        // User data storage worked correctly
        // redisClient.end() => do this if not working correctly
        resolve();
      })
    })
  },

  
  // TODO add a way to get the data
}
