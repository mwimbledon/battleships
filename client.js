var webSocketClient = require("websocket").client;

var client = new webSocketClient();

var fireButton = document.getElementById("btnFire");

client.on("connect", function (connection) {

    connection.on("message", function (message) {
        var messageArray = message.split(" ");
        if (messageArray[0] == "fire") {
            var hit = handleFireButton(messageArray[1]);
            connection.sendUTF("response " + hit + " " + messageArray[1]);
            document.getElementById("btnFire").disabled = false;
        } else if (messageArray[0] == "response") {
            processResponse(messageArray[1], messageArray[2]);
            document.getElementById("btnFire").disabled = true;
        }
    });

    connection.sendUTF("Handshake from client");

    fireButton.addEventListener("click", function () {
        var guessInput = document.getElementById("guessIn");
        var guess = guessInput.value.toUpperCase();
        var location = parseLocation(guess);
        if (location) {
            connection.sendUTF("fire " + location);
        }
    })
});

function processResponse(response, location) {
    switch (response) {
        case "already":
            view.displayMessage("You already hit this location!");
            break;
        case "sunk":
            view.displayMessage("You sank the opponents battleship!");
            view.displayHit(e + location);
            break;
        case "hit":
            view.displayMessage("You hit the opponents battleship!");
            view.displayHit(e + location);
            break;
        case "miss":
            view.displayMessage("You missed!");
            view.displayMiss(e + location);
            break;
        case "win":
            view.displayMessage("You Win!");
            view.displayHit(e + location);
            break;
    }
}

window.onload = function () {
    client.connect("ws://localhost:9000");
}