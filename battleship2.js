// let randomLoc = Math.floor(Math.random() * 5)
// let location1 = randomLoc
// let location2 = location1 + 1
// let location3 = location2 + 1
// let guess
// let hits = 0
// let guesses = 0
// let isSunk = false
// //Выше объявление переменных 

// while(!isSunk) {
//     guess = prompt("Ready, aim, fire! (enter a number 0-6): ")
//     if (guess < 0 || guess > 6) {
//         alert("Please enter a valid cell number!")
//     } else {
//         guesses += 1

//         if (guess == location1 || guess == location2 || guess == location3) {
//             alert('HIT!')
//             hits += 1
//             if (hits == 3) {
//                 isSunk = true
//                 alert("You sunk my battleship!")
//             }
//         } else {
//             alert('MISS!')
//         }
//     }
// }
// let stats = `You took ${guesses} guesses to sink the battleship, wich means your shooting accuracy was ${3/guesses * 100}%`
// alert(stats)




let view = {
    displayMessage: function(msg) {
        let messageArea = document.getElementById('messageArea')
        messageArea.innerHTML = msg
    },
    displayHit: function(location) {
        let cell = document.getElementById(location)
        cell.setAttribute('class', 'hit')
    },
    displayMiss: function(location) {
        let cell = document.getElementById(location)
        cell.setAttribute('class', 'miss')
    }
}

let model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    ships: [ { locations: ['0', '0', '0'], hits: ['', '', ''] },
             { locations: [0, 0, 0], hits: ['', '', ''] },
             { locations: [0, 0, 0], hits: ['', '', ''] }],
    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i]
            let index = ship.locations.indexOf(guess)
            if (index >= 0) {
                ship.hits[index] = 'hit'
                view.displayHit(guess)
                view.displayMessage('HIT!')
                if (this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship!')
                    this.shipsSunk++
                }
                return true
            }
        }
        view.displayMiss(guess)
        view.displayMessage('You missed')
        return false
    },
    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false
            }
        }
        return true
    },
    generateShipLocations: function() {
        let locations
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip()
            } while (this.collision(locations))
            this.ships[i].locations = locations
        }
    },
    generateShip: function() {
        let direction = Math.floor(Math.random() * 2)
        let row, col
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize)
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength))
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength))
            col = Math.floor(Math.random() * this.boardSize)
        }
        let newShipLocations = []
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (col + i))
            } else {
                newShipLocations.push((row + i) + '' + col)
            }
        }
        return newShipLocations
    },
    collision: function(location) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i]
            for (let j = 0; j < location.length; j++) {
                if (ship.locations.indexOf(location[j]) >= 0 || 
                    ship.locations.indexOf(String(Number(location[j]) + 1)) >= 0 || 
                    ship.locations.indexOf(String(Number(location[j]) - 1)) >= 0 || 
                    ship.locations.indexOf(String(Number(location[j]) + 10)) >= 0 || 
                    ship.locations.indexOf(String(Number(location[j]) - 10)) >= 0) {
                    return true
                }
            }
        }
        return false
    }
}

let controller = {
    guesses: 0,
    processGuess: function(guess) {
        let hit = model.fire(guess)
        this.guesses++
        if (hit && model.shipsSunk === model.numShips) {
            view.displayMessage('You sank all my battleships, in ' + this.guesses + ' guesses! Reload page to play one more time.')
            let tdElement = document.getElementsByTagName('td')
            for (let i = 0; i < tdElement.length; i++) {
                tdElement[i].onmouseover = function() {
                    tdElement[i].style.backgroundColor = 'rgba(83, 175, 19, 0)'
                    tdElement[i].style.cursor = 'default'
                }
            }
        }
    }
}