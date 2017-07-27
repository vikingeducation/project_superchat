const redisClient = require("redis").createClient();
const { getUsername, getUserIds } = require("./getUserInfo");

module.exports = {
  storeUserId: (userId) => {
    return new Promise((resolve, reject) => {
      redisClient.lpush("USER_IDS", userId, (err, reply) => {
        (err) ? reject(err) : resolve(userId);
      })
    })
  },

  storeUsername: (userId, username) => {
    return new Promise((resolve, reject) => {
      redisClient.set(userId, username, (err, reply) => {
        (err) ? reject(err) : resolve();
      });
    })
  },

  getUsernames: () => {
    return(getUserIds().then((userIds) => {
      return Promise.all(userIds.map((userId) => {
        return getUsername(userId);
      }))
    }))
  }
}
