
$(document).ready(() => {


    const socket = io.connect('http://localhost:4000');

    let profile = {};

    socket.on('updateClient', (profile) => {

        $(".no-content").remove();
        $("#room ul").append(`<li>
                        <div class="author">
                            <h4>${profile.author}</h4>
                        </div>
                        <div class="body">${profile.body}</div>
                    </li>`); //do this on socket listen so updates real time across all clients

    });

    socket.on('updateRoomList', (roomName) => {

        $(".radio-group").append(`<div class="radio" data-value="${roomName}">${roomName}</div>`); //do this on socket listen so updates real time across all clients

    });

    socket.on('roomChanged', messageArr => {

        $(".chat-form").show("fast");
        let roomName = $(".selected").attr('data-value');

        let source = $("#chat-template").html();
        let templateScript = Handlebars.compile(source);
        let context = { "messageArr": messageArr, "room": roomName };
        let html = templateScript(context);
        $("#chat-body").html(html);

        if (messageArr.length == 0) {
            $(".message-room-header").after(`<h4 class = "no-content">Chat room is empty</h4>`);
        }
        $("#chat-body").show("fast");

    });


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


    $('.radio-group').on('click', '.radio', function () {
        $(this).parent().find('.radio').removeClass('selected');
        $(this).addClass('selected');

        let val = $(this).attr('data-value');

        socket.emit('changeRoom', val);
    });

    $('#chat-body').on('click', '#close', function () {
        $(".selected").removeClass('selected');
        $(".chat-form").hide("fast");
        $("#chat-body").hide("fast");
    });

});

function getCookie(user) {
    let match = document.cookie.match(new RegExp(user + '=([^;]+)'));
    if (match) return match[1];
};