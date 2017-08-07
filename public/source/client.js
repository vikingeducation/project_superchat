
$(document).ready(()=> {

    
const socket = io.connect('http://localhost:4000');
    let profile = {};

    $("#submit-post").on("click", () => {

        profile.body = $("#messageInput").val();
        profile.author = getCookie('user');
        profile.roomName = $(".selected").attr('data-value');
        $("#messageInput").val('');

        socket.emit('addMsg', profile);

    });

    $("#submit-room").on("click", () => {

        let roomName = $("#newRoom").val();
        $("#newRoom").val('');

        socket.emit('addRoom', roomName);

    });


    socket.on('updateClient', (profile) => {

        $("#room ul").append(`<li>${profile.body} - By ${profile.author}</li>`); //do this on socket listen so updates real time across all clients

    });

    socket.on('updateRoomList', (roomName) => {

        $(".radio-group").append(`<div class="radio" data-value="${roomName}">${roomName}</div>`); //do this on socket listen so updates real time across all clients

    });

    socket.on('roomChanged', messageArr => {
        let arr = ["a", "a" , "a", "a", "a"];

        if (messageArr.length > 0) {

            let source = $("#chat-template").html();
            let templateScript = Handlebars.compile(source);
            let context = { "messageArr": messageArr, "room": messageArr[0].roomName};
            

            let html = templateScript(context);

            $("#chat-body").html(html);
        }
        else {
            $("#chat-body").html('<p>Chat Room is empty</p>');
        }
    });

    $('.radio-group').on('click', '.radio', function () {
        $(this).parent().find('.radio').removeClass('selected');
        $(this).addClass('selected');

        let val = $(this).attr('data-value');

        socket.emit('changeRoom', val);
    });

});
function getCookie(user) {
    let match = document.cookie.match(new RegExp(user + '=([^;]+)'));
    if (match) return match[1];
}