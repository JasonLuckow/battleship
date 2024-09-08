export { Player };
import { Gameboard } from "../gameboard/gameboard";
import { Ship } from "../ship/Ship";
import { ShipDirection } from "../ship/ship-direction";
import { GameboardValues } from "../gameboard/gameboard-values";

class Player {

    playerGameboard;
    playerShips;
    id;
    turnFinished;

    constructor(params) {
        this.id = params.id;
        this.playerGameboard = new Gameboard({ id: this.id });
        this.playerShips = this.createShipsForPlayer();
    }

    createShipsForPlayer() {
        var playerShips = [];
        playerShips.push(Ship.fromDefaultParameters( { id: 0, shipName: "Carrier", length: 5} ));
        playerShips.push(Ship.fromDefaultParameters( { id: 1, shipName: "Battleship", length: 4} ));
        playerShips.push(Ship.fromDefaultParameters( { id: 2, shipName: "Cruiser", length: 3} ));
        playerShips.push(Ship.fromDefaultParameters( { id: 3, shipName: "Submarine", length: 3} ));
        playerShips.push(Ship.fromDefaultParameters( { id: 4, shipName: "Destroyer", length: 2} ));

        return playerShips;
    }

    getGameboard() {
        return this.playerGameboard;
    }

    getPlaceShipCallback() {
        return this.playerGameboard.placeShip.bind(this.playerGameboard);
    }

    getReceiveAttackCallback() {
        return this.playerGameboard.receiveAttack.bind(this.playerGameboard);
    }

    isAllShipsSunk() {
        return this.playerGameboard.isAllShipsSunk();
    }

    getLastReceivedAttack() {
        return this.playerGameboard.getLastReceivedAttack();
    }

    placeShipsRandom() {
        //Maybe this belongs in the gameboard class, but I was thinking that 
        //players are the actors that are responsible for placing ships in 
        var randomX = Math.floor(Math.random() * 10);
        var randomY = Math.floor(Math.random() * 10);

        var randomDirection = Math.floor(Math.random() * 2);
        var possibleDirections = [ShipDirection.HORIZONTAL, ShipDirection.VERTICAL];//TODO

        var placed = false;
        
        this.playerShips.forEach(ship => {
            //TODO optimize
            while(!placed) {
                try {
                    randomX = Math.floor(Math.random() * 10);
                    randomY = Math.floor(Math.random() * 10);
                    this.playerGameboard.placeShip(ship, { x: randomX, y: randomY }, possibleDirections[randomDirection])
                    placed = true;
                } catch (error) {
                    console.log(error)
                    placed = false;
                } 
            }

            placed = false;
        });
    }

    setGameboard(playerGameboard) {
        this.playerGameboard = playerGameboard;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getShips() {
        return this.playerShips;
    }
}