let redis = require('redis');
let client = redis.createClient(); //creates a new client

let storeMessages = (roomName,userName, message) => { //make userid paramater and message param, then store those in an object which is then stored in redis. 

    let profile = {"roomName": roomName, "author": userName, "body": message};

    return new Promise( (resolve, reject) => {

        client.rpush(roomName, JSON.stringify(profile), (err, reply) => {
            client.restore
            if (err) reject (err);
            resolve("Saved to Redis");        
        });

    });

};

let storeRooms = (roomName) => {
    return new Promise( (resolve, reject) => {
        client.rpush('rooms', roomName, (err, reply) => {
            if(err) reject (err);
            resolve("Room created and stored in redis under key rooms")
        });
    });
};


let getRooms = () => {
    return new Promise( (resolve, reject) => {
        client.lrange('rooms', 0, -1, (err, reply) => {
            if(err) reject(err);
            resolve(reply);
        });
    });
};

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

module.exports = {storeMessages, getMessages, storeRooms, getRooms ,deleteAll}