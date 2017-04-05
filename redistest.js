const redis = require('redis').createClient();

const {createRoom} = require('./lib/redis_client');


createRoom("dogs");


redis.hgetall('room-dogs', (err, data) => {
	console.log(data);
});

redis.hgetall('rooms', (err, data) => {
	console.log(data);
});