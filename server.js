var webSocketServer = require("websocket").server;
var http = require("http");
var port = 9000;
const uuidv4 = require('uuid/v4');

var server = http.createServer(function (request, response) {
    console.log(new Date() + " Received request");
});

server.listen(port, function () {
    console.log(new Date() + " listening on port 9000");
});

var socket = new webSocketServer({
    httpServer: server
});

var connections = {};

socket.on("request", function (request) {
    var connection = request.accept(null, request.origin);
    var id = uuidv4();

    connection.on("close", function (reasonCode, description) {
        console.log("Connection " + id + " closed");
        delete connections[id]
    });

    connections[id] = connection;

    connection.on("message", function (message) {
        console.log(message.utf8Data + " " + id);
        for (var con in connections) {
            if (con != id) {
                connections[con].sendUTF(message.utf8Data);
            }
        }
    });
});
