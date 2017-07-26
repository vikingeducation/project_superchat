# project_superchat
Build a realtime multi-room chat application. Make it super.

Eric and Will



'room' -> hash:
    room-name: number-of-users

'users' -> hash:
    user-name: room

Posts -> list:
    room-name: [author-name, body ,author-name, body, author-name, body,]
    room-name: [author-name, body ,author-name, body, author-name, body,]
    room-name: [author-name, body ,author-name, body, author-name, body,]



'rooms' -> hash
    roomId: name
    roomId: name
    roomId: name

'members' -> hash
    roomId: count
    roomId: count
    roomId: count

roomId -> list
    [postId, postId, postId, postId]
roomId -> list
    [postId, postId, postId, postId]
roomId -> list
    [postId, postId, postId, postId]

'authors' -> hash
    postId: author
    postId: author
    postId: author

'messages' -> hash
    postId: message
    postId: messsage
    postId: message

