const socket = io.connect("http://localhost:4000");

// $("#submitPost").submit((e) => {
// 	e.preventDefault();
// 	socket.emit("newChat", $("#message").val());
// 	console.log("also working");
// });

$("#submitPost").on("click", (e) => {
	e.preventDefault();
	socket.emit("message", $(".message").val());
});


socket.on("newMessage", (newChatMessage) => {
	console.log("working");
	$("#PostedMessages").val() += newChatMessage;
})

// 	
