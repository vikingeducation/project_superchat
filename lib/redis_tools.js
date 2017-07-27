const loginRedisHelpers = require("./login_redis");
const shortid = require("shortid");

module.exports = {
  generateUserInfo: (username) => {
    const userId = shortid.generate();
    return (loginRedisHelpers.storeUserId(userId)
    .then(userId => loginRedisHelpers.storeUsername(userId, username)))
  }

  // GET ROOMS
}
