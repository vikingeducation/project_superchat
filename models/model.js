// const redis = require('redis');
// const redisClient = redis.createClient();
//
const asyncRedis = require("async-redis");
const redisClient = asyncRedis.createClient();
redisClient.on('connect', ()=> {
  console.log('connected to Redis');
})

redisClient.set('idx', 0)
redisClient.set('idy', 0)
redisClient.set('idz', 0)
let idx = redisClient.get('idx');
let idy = redisClient.get('idy');
let idz = redisClient.get('idz');

const createMessage = async (body, userId, roomId) => {
  redisClient.hmset(`message-${idx}`, 'body', body, 'authorId', userId, 'room', roomId, 'createdAt', new Date());
  await redisClient.incr('idx')
  console.log('created id is: ' + idx)
  roomMessageIds = await redisClient.hget('room-' + roomId, 'messages');
  if (roomMessageIds.length > 0) {
    roomMessageIds = roomMessageIds.split(',');
    roomMessageIds.push(idx);
    roomMessageIds = roomMessageIds.join(',');
  } else {
    roomMessageIds = idx;
  }
  redisClient.hset('room-' + roomId, 'messages', roomMessageIds);
}
const createUser = (userName) => {
  redisClient.hmset(`user-${idy}`, 'userName', userName, 'createdAt', new Date());
  redisClient.incr('idy')
}

const createRoom = (roomName) => {
  redisClient.hmset(`room-${idz}`, 'roomName', roomName, 'messages', '', 'createdAt', new Date());
  redisClient.incr('idz')
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
