// const redis = require('redis');
// const redisClient = redis.createClient();
//
const asyncRedis = require("async-redis");
const redisClient = asyncRedis.createClient();
redisClient.on('connect', ()=> {
  console.log('connected to Redis');
})

let idx = 2;
let idy = 2;
let idz = 2;

const createMessage = async (body, userId, roomId) => {
  redisClient.hmset(`message-${idx}`, 'body', body, 'authorId', userId, 'room', roomId, 'createdAt', new Date());
  idx += 1;
  roomMessageIds = await redisClient.hget('room-' + roomId, 'messages');
  roomMessageIds = roomMessageIds.split(',');
  roomMessageIds.push(idx);
  redisClient.hset('room-' + roomId, 'messages', roomMessageIds);
}
const createUser = (userName) => {
  redisClient.hmset(`user-${idy}`, 'userName', userName, 'createdAt', new Date());
  idy += 1;
}

const createRoom = (roomName) => {
  redisClient.hmset(`room-${idz}`, 'roomName', roomName, 'messages', '', 'createdAt', new Date());
  idz += 1;
}

const getUserName = async (userId) => {
  return await redisClient.hget(`user-${userId}`, 'userName')
}

const getMessageAuthor = async (messageId) => {
  let authorId = await redisClient.hget(`message-${messageId}`, 'authorId');
  return await getUserName(authorId);
}

const getUserMessages = async (userId) => {
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
  let messages = await getRoomMessages(roomId);
  console.log('messages are: ' + messages)
  let userMessagesInRoom = await {};
  if (!messages) {
    return
  }
  messages = messages.slice(1,-1).split(',');
  for( let id of messages ) {
    let author = await getMessageAuthor(id);
    console.log('user messages in room: ' + await getMessageBody(id))
    userMessagesInRoom[author] = await getMessageBody(id);
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
