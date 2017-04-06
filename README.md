# project_superchat
Build a realtime multi-room chat application. Make it super.

Renzo Tomlinson and Will Whitworth



Notes:

If user has username cookie,
Send them to the chat page
If not, then require them to submit a username which sets the cookie
and redirects them to the chatpage



They get a default chatroom
--Get a list of chatrooms that they can click on
Only one chatroom displayed at a time


They can submit posts to the chatroom
Posts submitted through chatroom are handled with websockets
New room submissions are handled with websocks

Handle chatroom changes with a post request (partials? Possible to just use websockets)







It should update in realtime on every browser that is connected to the server



