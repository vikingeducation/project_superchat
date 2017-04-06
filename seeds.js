const redis = require('redis').createClient();

const {createMessage, createRoom} = require('./lib/redis_client');

function seedRedisStore() {
  redis.flushall();

  createRoom("2017-mar");
  createRoom("JavaScript");
  createRoom("random-awesomeness");


  createMessage("2017-mar", "Mimir", "How's it going?");
  createMessage("2017-mar", "Odin", "Really Well!");
  createMessage("2017-mar", "Mimir", "Cool!");

  createMessage("JavaScript", "Mimir", "Promises are hard!");
  createMessage("JavaScript", "Odin", "Try using async/await");
}

seedRedisStore();