// const redis = require('redis');
// const redisClient = redis.createClient();
//
const asyncRedis = require("async-redis");
const redisClient = asyncRedis.createClient();
redisClient.on('connect', ()=> {
  console.log('connected to Redis');
})

// redisClient.set('idy', 0);
// redisClient.set('idz', 0);
//
// if (redisClient.get('idx') ) {
//   redisClient.set('idx', 0);
// }
let idx = 0;

const createMessage = async (body, userId, roomId) => {
  roomMessageIds = await redisClient.hget('room-' + roomId, 'messages');
  if (roomMessageIds.length > 0) {
    roomMessageIds = roomMessageIds.split(',');
    idx = parseInt( roomMessageIds[0]) + 1;
    roomMessageIds.unshift(idx);
    roomMessageIds = roomMessageIds.join(',');
  } else {
    idx = 0;
    roomMessageIds = idx;
  }
  redisClient.hmset(`message-${idx}`, 'body', body, 'authorId', userId, 'room', roomId, 'createdAt', new Date());
  redisClient.hset('room-' + roomId, 'messages', roomMessageIds);
  idx += 1;


  // let idx = await redisClient.get('idx');
  console.log('idx just after setting in redis is - ' + idx)
  // await redisClient.incr('idx')
  console.log('created id is: ' + idx)
}
const createUser = (userName) => {
  let idy = redisClient.get('idy');
  redisClient.hmset(`user-${idy}`, 'userName', userName, 'createdAt', new Date());
  redisClient.incr('idy');
}

const createRoom = (roomName) => {
  let idz = redisClient.get('idz');
  redisClient.hmset(`room-${idz}`, 'roomName', roomName, 'messages', '', 'createdAt', new Date());
  redisClient.incr('idz');
}

const getUserName = async (userId) => {
  return await redisClient.hget(`user-${userId}`, 'userName')
}

const getMessageAuthor = async (messageId) => {
  let authorId = await redisClient.hget(`message-${messageId}`, 'authorId');
  return await getUserName(authorId);
}

const getUserMessages = async (userId) => {
  // let msgsKeys = await redisClient.keys('message-*');
  // console.log(msgsKeys)
  // await redisClient.del(msgsKeys);
  // return
  // console.log('messages deleted')

  let msgsKeys = await redisClient.keys('message-*');
  const msgs = [];

  for( let key of msgsKeys ) {
    msgs.push ( await redisClient.hget(key, 'body') );
  }

  console.log('messages after for loop are: ' +  msgs);
  return msgs;
}

const getMessageBody = async (id) => {
  return await redisClient.hget(`message-${id}`, 'body');
}

const getRoomMessages = async (roomId) => {
  return await redisClient.hget(`room-${roomId}`, 'messages');
}

const getRoomMessagesByAuthor = async (roomId) => {
  let messageIds = await getRoomMessages(roomId);
  let userMessagesInRoom = await [];
  let createdAt = 0;
  if (!messageIds) {
    return
  }
  messageIds = messageIds.split(',');
  console.log('ids are: ' + messageIds)
  for( let id of messageIds ) {
    let author = await getMessageAuthor(id);
    userMessagesInRoom[createdAt] = {'author': author,
                                        'body': await getMessageBody(id)
                                      }
    createdAt += 1;
    console.log(userMessagesInRoom)
  }
  return await userMessagesInRoom;
}

const getRooms = () => {

}

const getRoomName = async (roomId) => {
  return await redisClient.hget(`room-${roomId}`, 'roomName')
}


module.exports = {
  createMessage,
  createUser,
  createRoom,
  getUserName,
  getRoomName,
  getUserMessages,
  getRoomMessages,
  getRooms,
  getRoomMessagesByAuthor
}
