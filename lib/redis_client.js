const redis = require('redis').createClient();

function createRoom((name) => {
  // step 1 create a hash with the name.
  // step 2 create a list
  redis.hsetnx(`room-${name}`, 'name', name);

})

module.exports = redis;


