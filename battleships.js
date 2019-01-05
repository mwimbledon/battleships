var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] }
    ],

    fire: function (guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);

            if (ship.hits[index] === "hit") {
                view.displayMessage("Opponent already hit this location!");
                return "already";
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit("m" + guess);
                view.displayMessage("Opponent hit your battleship!");

                if (this.isSunk(ship)) {
                    view.displayMessage("Opponent sank your battleship!");
                    this.shipsSunk++;
                    return "sunk"
                }
                return "hit";
            }
        }
        view.displayMiss("m" + guess);
        view.displayMessage("Opponent Missed!");
        return "miss";
    },

    isSunk: function (ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function (shipNum, shipOr, location) {
        var locations;

        locations = this.generateShip(shipOr, location);
        if (!this.collision(locations)) {
            this.ships[shipNum - 1].locations = locations;

            for (var i = 0; i < locations.length; i++) {
                view.displayShip("m" + locations[i]);
            }

            console.log("Ship " + (shipNum));
            console.log(this.ships[shipNum - 1].locations);
            return true;
        } else {
            return false;
        } 
    },

    generateShip: function (shipOr, shipPlace) {
        var direction = parseInt(shipOr);
        var row = parseInt(shipPlace.charAt(0));
        var col = parseInt(shipPlace.charAt(1));

        var newShipLocation = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocation.push(row + "" + (col + i));
            } else {
                newShipLocation.push((row + i) + "" + col);
            }
        }
        return newShipLocation;
    },

    collision: function (locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    alert("Invalid location: ship already placed here");
                    return true;
                }
            }
        }
        return false
    }
};

var view = {

    displayMessage: function (msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg
    },

    displayShip: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "ship");
    },

    displayHit: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss")
    }
};

var controller = {
    shipsPlaced: 0,
    placedShips: [],
    guesses: 0,

    processGuess: function (location) {
        this.guesses++;
        var hit = model.fire(location);
        if (hit == "sunk" && model.shipsSunk === model.numShips) {
            view.displayMessage("You lose! Opponent sank all your battleships in " +
                this.guesses + " guesses!");
            return "win";
        }
        return hit;
    },

    processShipPlacement: function (shipNum, shipOr, shipPlace) {
        var location = parseLocation(shipPlace);
        if (location && validateLocation(location, shipOr) && isNotPlaced(shipNum) && model.generateShipLocations(shipNum, shipOr, location)) {
            this.shipsPlaced++;
            view.displayMessage("Ship placed");
            this.placedShips.push(shipNum);
            if (this.shipsPlaced === model.numShips) {
                view.displayMessage("All ships placed");
                document.getElementById("btnFire").disabled = false;
                document.getElementById("btnPlaceShip").disabled = true;
            }
        }
    }
}

function parseLocation(location) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (location === null || location.length !== 2) {
        alert("Invalid location: Must be a letter and a number.");
    } else {
        var firstChar = location.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = location.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("Invalid location: Must be a letter and a number.");
        } else if (row < 0 || row >= model.boardSize || column < 0 || 
            column >= model.boardSize) {
            alert("Invalid location: Must be located on the board")
        } else {
            return row + column;
        }
    }
    return null;
}

function validateLocation(location, shipOr) {
    var row = location.charAt(0);
    var col = location.charAt(1);

    if (isNaN(shipOr) || shipOr < 1 || shipOr > 2) {
        alert("Invalid orientation: must be a 1 (for horizontal) or a 2 (for vertical)");
        return false;
    } else if (shipOr == 1) {
        if (row > model.boardSize || col > model.boardSize - model.shipLength) {
            alert("Invalid location: The whole of the ship must reside on the board");
            return false;
        } else {
            return true;
        }
    } else {
        if (col > model.boardSize || row > model.boardSize - model.shipLength) {
            alert("Invalid location: The whole of the ship must reside on the board");
            return false;
        } else {
            return true;
        }
    }
}

function isNotPlaced(shipNum) {
    if (controller.placedShips.indexOf(shipNum) >= 0) {
        alert("Invalid ship number: ship already placed");
        return false;
    } else {
        return true;
    }
}

function handleFireButton(guessInput) {

    var hit = controller.processGuess(guessInput);
    return hit;

}

function handlePlaceButton() {
    var shipNum = document.getElementById("shipNumIn").value;
    var shipOr = document.getElementById("shipOrIn").value;
    var shipPlaceInput = document.getElementById("shipPlaceIn")
    var shipPlace = shipPlaceInput.value.toUpperCase();

    controller.processShipPlacement(shipNum, shipOr, shipPlace);

    document.getElementById("shipNumIn").value = "";
    document.getElementById("shipOrIn").value = "";
    shipPlaceInput.value = "";
}

function init() {
    var placeShipButton = document.getElementById("btnPlaceShip");
    placeShipButton.addEventListener("click", handlePlaceButton);

    var ship1 = document.getElementById("ship1");
    ship1.addEventListener("click", function () {
        document.getElementById("shipNumIn").value = 1;
        ship1.setAttribute("src", "ship.png")
    })

    var ship2 = document.getElementById("ship2");
    ship2.addEventListener("click", function () {
        document.getElementById("shipNumIn").value = 2;
        ship2.setAttribute("src", "ship.png")
    })

    var ship3 = document.getElementById("ship3");
    ship3.addEventListener("click", function () {
        document.getElementById("shipNumIn").value = 3;
        ship3.setAttribute("src", "ship.png")
    })

    var horizontal = document.getElementById("btnHorizontal");
    horizontal.addEventListener("click", function () {
        document.getElementById("shipOrIn").value = 1;
        document.getElementById("btnVertical").style.backgroundColor = "rgb(153,255,51)";
        horizontal.style.backgroundColor = "rgb(120,230,60)";
    })

    var vertical = document.getElementById("btnVertical");
    vertical.addEventListener("click", function () {
        document.getElementById("shipOrIn").value = 2;
        document.getElementById("btnHorizontal").style.backgroundColor = "rgb(153,255,51)";
        vertical.style.backgroundColor = "rgb(120,230,60)";
    })
}

window.onload = init();