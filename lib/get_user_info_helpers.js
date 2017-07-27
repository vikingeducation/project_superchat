const redisClient = require("redis").createClient();

module.exports = {
  getUsername: (userId) => {
    return new Promise((resolve, reject) => {
      redisClient.get(userId, (err, username) => {
        // console.log(username);
        (err) ? reject(err) : resolve(username);
      })
    })
  },

  getUserIds: () => {
    return new Promise((resolve, reject) => {
      redisClient.lrange("USER_IDS", 0, -1, (err, userIds) => {
        (err) ? reject(err) : resolve(userIds);
      })
    })
  }
}
