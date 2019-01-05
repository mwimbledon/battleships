var webSocketClient = require("websocket").client;

var client = new webSocketClient();

client.on("connect", function (connection) {

    connection.on("message", function (message) {
        console.log("Received: " + message.utf8Data);
    });

    connection.sendUTF("Handshake from client");
});

client.connect("ws://localhost:9000");
