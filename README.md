# project_superchat
Build a realtime multi-room chat application. Make it super.

Mark + Egle

messages: [ {body: content, author: name, room: room}, {}, {}]

messageid: {body:body, author:author}

key: messages -
value: (in array){
  body: content,
  author: name, <- from logged in user
  room: room posted <-(thinking ahead) module to iterate through rooms by room
}

users: [ ]

key: users - 
value: in array {
  user: name <-store as cookie
}
rooms : [ ]
key: rooms -
value: in array {
  room name: ??message storage??
}


