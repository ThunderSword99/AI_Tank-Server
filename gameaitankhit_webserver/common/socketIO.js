const moment = require("moment");
var sanitizeHtml = require('sanitize-html');

module.exports = (io) => {

    var messages = [];
    io.sockets.on('connection', (socket) => {
        socket.on("adduser", function(username) {
            //save
            socket.username = username;
        });
        socket.on("send_message", function(message) {
            let time = moment(new Date()).format('DD/MM/YYYY HH:mm:ss');

            message = sanitizeHtml(message, {
                allowedTags: [],
                allowedAttributes: {

                },
                allowedIframeHostnames: []
            });

            var data = {
                sender: socket.username,
                message: message,
                time: time
            };
            socket.emit("update_message", data);
            messages.push(data);
            socket.broadcast.emit("update_message", data);
        });

    });
}