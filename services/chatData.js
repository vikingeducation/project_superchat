let redis = require('redis');
let client = redis.createClient(); //creates a new client

let storeMessages = (roomName,message) => {

    return new Promise( (resolve, reject) => {

        client.rpush(roomName, JSON.stringify(message), (err, reply) => {
            if (err) reject (err);
            resolve("Saved to Redis");        
        });

    });

}

let getMessages = (roomName) => {

    return new Promise((resolve, reject) => {

        client.lrange(roomName, 0, -1, function (err, reply) {

            if (err) reject(err);
            resolve(reply);
        });
    });
};

let deleteAll = () => {
    
    client.flushall((err, reply) => {
        if (err) throw err;

        if (reply) console.log("Cleared");
    });
};

module.exports = {storeMessages, getMessages, deleteAll}