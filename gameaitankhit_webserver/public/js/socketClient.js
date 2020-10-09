var moveScrollToEnd = true;

$("#message-area").mousedown(function() {
    moveScrollToEnd = false;
});

$("#message-area").mouseup(function() {
    moveScrollToEnd = true;
});

var socket = io.connect("http://"+document.domain+":4002");
socket.on("connect", function() {
    console.log("User is connecting to server");

    //Ask name
    var username = $('#userName').val();
    console.log("username: "+username);
    //Notify to server
    socket.emit("adduser", username);
});

socket.on("list_chat", function(messages){
    for(let i=0; i<messages.length;i++){
        $(".container").append("<div class='containerChat'> <p> <span>" + messages[i].sender + ": </span>" + messages[i].message + "</p>" + "<span class='time-left'>"+ messages[i].time + "</span> </div>");
    }
});

socket.on("update_message", function(data) {
    $(".container").append("<div class='containerChat'> <p> <span>" + data.sender + ": </span>" + data.message + "</p>" + "<span class='time-left'>"+ data.time + "</span> </div>");
    if(moveScrollToEnd) {
        $("#message-area").animate({
            scrollTop: $("#message-area").prop("scrollHeight")
        }, 1000);
    }
});

$("#btn_send").click(function(e) {
    //Get message
    var message = $("#message").val();
    $("#message").val("");
    if (message.trim().length != 0) {
        socket.emit("send_message", message);
    }
});


$("form").submit(function() {
    return false;
});
//click enter
$("#message").keypress(function(e) {
    //Enter event
    if (e.which == 13) {
        $("#btn_send").trigger("click");
    }
});