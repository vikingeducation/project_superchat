const asyncRedis = require("async-redis");
// let redisClient = null;

// if (process.env.REDISTOGO_URL) {
//     // redistogo connection
//     console.log('reis to go/??? is it there')
//     console.log(process.env.REDISTOGO_URL)
//     const rtg   = require("url").parse(process.env.REDISTOGO_URL);
//     // const redis = require("redis").createClient(rtg.port, rtg.hostname);
//     redisClient = asyncRedis.createClient(rtg.port, rtg.hostname);
//     redisClient.auth(rtg.auth.split(":")[1]);
// } else {
    // var redis = require("redis").createClient();
    const redisClient = asyncRedis.createClient(process.env.REDIS_URL);
// }



redisClient.on('connect', ()=> {
  console.log('connected to Redis');
})

redisClient.on("error", function (err) {
    console.log("Error " + err);
});


let idx = 0;

const createMessage = async (body, userName, roomName) => {
  roomMessageIds = await redisClient.hget('room-' + roomName, 'messages');
  let members = await redisClient.hget('room-' + roomName, 'members');
  if (roomMessageIds.length > 0) {
    roomMessageIds = roomMessageIds.split(',');
    idx = parseInt( roomMessageIds[0]) + 1;
    roomMessageIds.unshift(idx);
    roomMessageIds = roomMessageIds.join(',');
  } else {
    idx = 0;
    roomMessageIds = idx;
  }
  redisClient.hmset(`message-${idx}`, 'body', body, 'authorId', userName, 'room', roomName, 'createdAt', new Date());
  if (!members.includes(userName)) {
    members += `,${userName}`;
  }
  redisClient.hset('room-' + roomName, 'messages', roomMessageIds, 'members', members);
  idx += 1;
}


const createUser = (userName) => {
  if ( !findUser(userName) ) {
    redisClient.hmset(`u-${userName}`, 'createdAt', new Date());
  }
}

const createRoom = (roomName, userName) => {
  redisClient.hmset(`room-${roomName}`, 'messages', '', 'members', userName, 'createdAt', new Date());
}

const getMessageAuthor = async (messageId) => {
  return await redisClient.hget(`message-${messageId}`, 'authorId');
}


const clearDatabase = async () => {
  let msgsKeys = await redisClient.keys('message-*');
  let userKeys = await redisClient.keys('user-*');
  let uKeys = await redisClient.keys('u-*');
  await redisClient.del('room-1');
  let roomKeys = await redisClient.keys('room-*');
  await redisClient.del(msgsKeys);
  await redisClient.del(userKeys);
  await redisClient.del(uKeys);
  await redisClient.del(roomKeys);
  console.log('clearing completed')
}

const getMessageBody = async (id) => {
  return await redisClient.hget(`message-${id}`, 'body');
}

const getRoomMessages = async (roomName) => {
  return await redisClient.hget(`room-${roomName}`, 'messages');
}

const getRoomMessagesWithAuthors = async (roomName) => {
  let messageIds = await getRoomMessages(roomName);
  messageIds = messageIds.split(',');
  let messagesByAuthor = await [];
  let index = 0;
  if (!messageIds) {
    return
  }
  for( let id of messageIds ) {
    let author = await getMessageAuthor(id);
    messagesByAuthor[index] = {'author': author,
                                'body': await getMessageBody(id)
                              }
    index += 1;
  }
  return await messagesByAuthor;
}

const getRooms = async () => {
  const regex = /[^room-](w+)/g;
  let rooms = await [];
  let roomArr = await redisClient.keys('room-*');
  for( let name of roomArr ) {
    let reg = name.match(/[^room-](.*)/g)
    rooms.push( reg[0] );
    };
  return rooms;
}

const getRoomsWithStats = async () => {
  let allRoomsWithStats = await {};
  let allRooms = await getRooms();
  if (allRooms.length > 0) {
    for( let room of allRooms ) {
      let users = await redisClient.hget(`room-${room}`, 'members');
      if (users) {
        users = users.split(',');
        allRoomsWithStats[room] = users.length;
      }
    }
  }
  return allRoomsWithStats;
}

const findUser = async (userName) => {
  return await redisClient.keys(`u-${userName}`)
}


module.exports = {
  createMessage,
  createUser,
  createRoom,
  getRoomMessages,
  getRooms,
  getRoomMessagesWithAuthors,
  getRoomsWithStats,
  clearDatabase
}
