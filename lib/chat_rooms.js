const redis = require('redis');
const redisClient = redis.createClient();

var ChatRooms = {};

ChatRooms.getAll = (username, activeRoom) => {
  return new Promise(async (resolve, reject) => {

    const chatRoomName = activeRoom.split('-').join(' ');

    var allRooms = { username, chatRoomName, activeRoom };

    allRooms.rooms = await getRooms(activeRoom);
    var keys = await redisClient.keysAsync(`messages:${activeRoom}:*`);
    allRooms.isMember = await checkUserMember(activeRoom, username);

    if (keys.length === 0) {
      resolve(allRooms);
    }

    var messages = [];

    for (let key of keys) {
      redisClient.hgetallAsync(key).then(message => {

        messages.push(message);

        if (messages.length === keys.length) {
          allRooms.messages = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          resolve(allRooms);
        }
      });
    }
  });
};

const getRooms = (activeRoom) => {
  return new Promise((resolve, reject) => {
    redisClient.smembers('users', (err, list) => {

      var totalUsers = list.length;

      redisClient.keys('room:*', (err, roomKeys) => {
        var rooms = [];

        if (!roomKeys.length) {
          resolve(rooms);
        }

        roomKeys.forEach(roomKey => {
          redisClient.smembers(roomKey, (err, members) => {

            var slug = roomKey.slice(5);
            var name = slug.split('-').join(' ');

            rooms.push({ name: name, memberAmount: members.length, active: slug == activeRoom, slug: slug });

            if (rooms.length === roomKeys.length) {
              resolve(rooms);
            }
          });
        });
      });
    });
  });
};

const checkUserMember = (room, user) => {
  return new Promise((resolve, reject) => {
    redisClient.sismember(`room:${ room }`, user, (err, isMember) => {
      resolve(isMember);
    });
  });
};

module.exports = ChatRooms;
