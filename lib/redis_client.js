const redis = require('redis').createClient();

const createRoom = (name) => {
  // step 1 create a hash with the name.
  // step 2 create a list
  return new Promise((resolve, reject) => {
	  redis.hsetnx(`room-${name}`, 'name', name, (err, success) => {
		  	if (success) {
			  redis.hsetnx('rooms', name, 0, (err, success) => {
			  	resolve(success);
			  });  		
		  	}
	  });  	
  })
}

const createMessage = (room, author, body) => {
	const messageID = `message-${Date.now()}`;
	let p1 = new Promise((resolve) => {

	})
	let p2 = new Promise((resolve) => {
		
	})
	// Promise.all ...
}

module.exports = {createRoom};




