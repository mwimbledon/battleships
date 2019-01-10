var client = new WebSocket("ws://51.140.114.158:9000");
console.log(client);

var fireButton = document.getElementById("btnFire");

client.onopen = function () {

    client.onmessage = function (message) {
        var messageArray = message.data.split(" ");
        if (messageArray[0] == "fire") {
            var hit = handleFireButton(messageArray[1]);
            client.send("response " + hit + " " + messageArray[1]);
            document.getElementById("btnFire").disabled = false;
        } else if (messageArray[0] == "response") {
            processResponse(messageArray[1], messageArray[2]);
            document.getElementById("btnFire").disabled = true;
        } else if (messageArray[0] == "Closed") {
            view.displayMessage("Opponent has quit!");
            document.getElementById("btnFire").disabled = true;
        }
    }

    client.send("Handshake from client");
}

function processResponse(response, location) {
    switch (response) {
        case "already":
            view.displayMessage("You already hit this location!");
            break;
        case "sunk":
            view.displayMessage("You sank the opponents battleship!");
            view.displayHit("e" + location);
            break;
        case "hit":
            view.displayMessage("You hit the opponents battleship!");
            view.displayHit("e" + location);
            break;
        case "miss":
            view.displayMessage("You missed!");
            view.displayMiss("e" + location);
            break;
        case "win":
            view.displayMessage("You Win!");
            view.displayHit("e" + location);
            break;
    }
}

window.onload = function () {
    fireButton.addEventListener("click", function () {
        var guessInput = document.getElementById("guessIn");
        var guess = guessInput.value.toUpperCase();
        var location = parseLocation(guess);
        if (location) {
            client.send("fire " + location);
        }
    });
}