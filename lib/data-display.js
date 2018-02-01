const {
	generateUserInfo
} = require('./generate');
const {
	getAllRoomNames
} = require('./rooms');
const {
	getAllMessages
} = require('./messages');

const getDisplayInfo = (username, callback) => {

	let displayInfo = {};
	displayInfo.rooms = [];
	displayInfo.messages = [];

	return Promise.all([getAllRoomNames(), getAllMessages()]).then((results) => {
			displayInfo.rooms = results[0];
			displayInfo.messages = results[1];
			callback(null, displayInfo);
		})
		.catch((err) => {
			reject(err);
		});

};

// test works
// getDisplayInfo('robin7', (err, results) => {
//    let displayInfo = results;
//    console.dir(results);
// });

// let exampleRooms = ['dogs', 'cats', 'other'];
// let exampleMessages = [{
// 		message: 'i love dogs',
// 		username: 'dogluver',
// 		roomName: 'dogs'
// 	},
// 	{
// 		message: 'i love cats',
// 		username: 'catluver',
// 		roomName: 'cats'
// 	},
// 	{
// 		message: 'i love other',
// 		username: 'otherluver',
// 		roomName: 'other'
// 	}
// ];

// messages is an array of message objects
const sortRooms = (messages) => {
	const uniqueArray = (arr) => [...new Set(arr)];
	let roomsArray = [];
	for(let i = 0; i < messages.length; i++) {
		roomsArray.push(messages[i].roomName);
	}
	roomsArray = uniqueArray(roomsArray);
	return roomsArray;
};

// sortRooms(exampleMessages);

// roomNames is an array of strings, messages is an array of message objects
const associateRoomsMessages = (roomNames, messages, callback) => {
	const uniqueArray = (arr) => [...new Set(arr)];
	let uniqueRooms = uniqueArray(roomNames);
	// array of objects 
	let hbsArray = [];

	for (i = 0; i <= (uniqueRooms.length - 1); i++) {
		let hbsRoom = {};
		hbsRoom.roomName = uniqueRooms[i];
		hbsRoom.messages = [];

		for (j = 0; j <= (messages.length - 1); j++) {
			if ((messages[j].roomName) && (messages[j].roomName === uniqueRooms[i])) {
				hbsRoom.messages.push(messages[j]);
			}
		}
		hbsArray.push(hbsRoom);
		// if final iteration call callback
		if (i === (uniqueRooms.length - 1)) {
			callback(null, hbsArray);
		}
	}

};

module.exports = {
	getDisplayInfo,
	associateRoomsMessages,
	sortRooms
};