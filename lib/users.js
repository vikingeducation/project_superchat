const redisClient = require('redis').createClient();

// SAVE FUNCTIONS
// Save user ID in list called USER_IDS
let saveUserID = (userID) => {
   return new Promise((resolve, reject) => {
      redisClient.lpush('USER_IDS', userID, (err, reply) => {
        if(err) { console.log(err); }
        else {
          //  console.log(`User ID ${userID} saved to USER_IDS.`)
           resolve(userID);
        }
      });
   });
};

// Save username in string using user ID as key
let saveUsername = (userID, username) => {
   return new Promise((resolve, reject) => {
      redisClient.set(userID, username, (err, reply) => {
         if(err) { console.log(err); }
         else {
            // console.log(`Username ${username} created with userID ${userID}.`);
            resolve();
         }
      });
   });
};

// GET FUNCTIONS
// Get username by passing in user ID as key
// Resolve with username string
let getUsername = (userID) => {
   return new Promise((resolve, reject) => {
      redisClient.get(userID, (err, username) => {
         if(err) { console.log(err); }
         else {
            resolve(username);
         }
      });
   });
};

// Get all user IDs from list USER_IDS
// Resolve user IDs in array
let getUserIDs = () => {
   return new Promise((resolve, reject) => {
      redisClient.lrange('USER_IDS', 0, -1, (err, userIDs) => {
         if(err) { console.log(err); }
         else {
            resolve(userIDs);
         }
      });
   });
};

// Get all usernames
let getAllUsernames = () => {
   return getUserIDs().then((userIDs) => {
      return Promise.all(userIDs.map((userID) => {
         return getUsername(userID);
      }));
   });
};

module.exports = {
   saveUserID,
   saveUsername,
   getUsername,
   getUserIDs,
   getAllUsernames
};