Redis Tables
============

**SET** - roomName: [username1, username2 ...] - for listing rooms with amount of members

**SET** - 'users': [username1, username2 ...] - for adding new users and validating

**HASH** 'messages:roomName:uniqueId': { body: string, author: username, room: roomName, createdAt: time }
