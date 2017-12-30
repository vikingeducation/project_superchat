// const redis = require('redis');
// const redisClient = redis.createClient();
//
const asyncRedis = require("async-redis");
const redisClient = asyncRedis.createClient();
redisClient.on('connect', ()=> {
  console.log('connected to Redis');
})


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


  // let idx = await redisClient.get('idx');
  console.log('idx just after setting in redis is - ' + idx)
  // await redisClient.incr('idx')
  console.log('created id is: ' + idx)
}




const createUser = (userName) => {
  // let idy = redisClient.get('idy');
  if ( !findUser(userName) ) {
    redisClient.hmset(`u-${userName}`, 'createdAt', new Date());
  }
  // redisClient.incr('idy');
}

const createRoom = (roomName, userName) => {
  // let idz = redisClient.get('idz');
  redisClient.hmset(`room-${roomName}`, 'messages', '', 'members', userName, 'createdAt', new Date());
  // redisClient.incr('idz');
}

// const getUserName = async (userName) => {
//   return await redisClient.hget(`u-${userName}`, 'userName')
// }

const getMessageAuthor = async (messageId) => {
  return await redisClient.hget(`message-${messageId}`, 'authorId');
  // let login = await redisClient.hget(`message-${messageId}`, 'authorId');
  // return await getUserName(login);
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

const getUserMessages = async (userName) => {
//   // let msgsKeys = await redisClient.keys('message-*');
//   // console.log(msgsKeys)
//   // await redisClient.del(msgsKeys);
//   // return
//   // console.log('messages deleted')
//
//   let msgsKeys = await redisClient.keys('message-*');
//   const msgs = [];
//
//   for( let key of msgsKeys ) {
//     msgs.push ( await redisClient.hget(key, 'body') );
//   }
//
//   console.log('messages after for loop are: ' +  msgs);
//   return msgs;
}

const getMessageBody = async (id) => {
  return await redisClient.hget(`message-${id}`, 'body');
}

const getRoomMessages = async (roomName) => {
  return await redisClient.hget(`room-${roomName}`, 'messages');
}

// const getRoomMessagesByAuthor = async (roomName) => {
//   let messageIds = await getRoomMessages(roomName);
//   let userMessagesInRoom = await [];
//   let createdAt = 0;
//   if (!messageIds) {
//     return
//   }
//   messageIds = messageIds.split(',');
//   console.log('ids are: ' + messageIds)
//   for( let id of messageIds ) {
//     let author = await getMessageAuthor(id);
//     userMessagesInRoom[createdAt] = {'author': author,
//                                         'body': await getMessageBody(id)
//                                       }
//     createdAt += 1;
//     console.log(userMessagesInRoom)
//   }
//   return await userMessagesInRoom;
// } ---- by room?????

const getRoomMessagesWithAuthors = async (roomName) => {
  let messageIds = await getRoomMessages(roomName);
  console.log('room messages are : ' + messageIds)
  messageIds = messageIds.split(',');
  let messagesByAuthor = await [];
  let index = 0;
  if (!messageIds) {
    return
  }
  console.log('ids are: ' + messageIds)
  for( let id of messageIds ) {
    let author = await getMessageAuthor(id);
    messagesByAuthor[index] = {'author': author,
                                'body': await getMessageBody(id)
                              }
    index += 1;
  }
  console.log(messagesByAuthor)
  return await messagesByAuthor;
}

const getRooms = async () => {
  const regex = /[^room-](.*)/g;
  let rooms = await [];
  let roomArr = await redisClient.keys('room-*');
  for( let name of roomArr ) {
    rooms.push( regex.exec(name) );
  };
  return rooms;
}

// const getRoomStats = (roomName) = {
//
//   redisClient.hget(`message-${messageId}`, 'authorId');
// }

const getRoomsWithStats = async () => {
  let allRoomsWithStats = {};
  let allRooms = getRooms();
  for( let room of allRooms ) {
    let users = await redisClient.hget(`room-${room}`, 'members');
    allRoomsWithStats[room] = users.length;
  }
  return allRoomsWithStats;
}


// const getRoomName = async (roomName) => {
//   return await redisClient.hget(`room-${roomName}`, 'roomName')
// }

const findUser = async (userName) => {
  return await redisClient.keys(`u-${userName}`)
}


module.exports = {
  createMessage,
  createUser,
  createRoom,
  getUserMessages,
  getRoomMessages,
  getRooms,
  getRoomMessagesWithAuthors,
  clearDatabase
}
