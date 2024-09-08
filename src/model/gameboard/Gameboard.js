export { Gameboard };
import { ShipDirection } from "../ship/ship-direction";
import { GameboardValues } from "./gameboard-values";


class Gameboard {

    missedAttacks;
    allShipsSunk;
    id;
    board;
    maxRows;
    maxColumns;
    ships;
    shipSunkCount;
    lastReceivedAttack;

    constructor(params) {
        this.shipSunkCount = 0;
        this.missedAttacks = 0;
        this.allShipsSunk = false;
        this.id = params.id;
        this.maxRows = 10;
        this.maxColumns = 10;
        this.board = Array.from({ length: this.maxRows }, () => Array(this.maxColumns).fill(GameboardValues.EMPTY));
        this.ships = [];
        this.lastReceivedAttack = GameboardValues.EMPTY
    }

    getBoard() {
        return this.board;
    }

    getMissedAttacks() {
        return this.missedAttacks;
    }

    increaseMissedAttacks() {
        this.missedAttacks++; 
    }

    isAllShipsSunk() {
        return this.ships.length == this.shipSunkCount;
    }

    setAllShipsSunk() {
        this.allShipsSunk = true;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    placeShip(ship, coordinates, direction) {

        if (!this.placeShipValidation(ship.getLength(), coordinates, direction))
            throw new Error(`Coordinates are out of gameboard bounds. x: ${coordinates.x}, y: ${coordinates.y}`);

        var xPos = coordinates.x;
        var yPos = coordinates.y;
        var newBoard = this.board;

        this.ships.forEach(element => {
            if (element.getId() == ship.getId())
                newBoard = this.clearExistingShipFromBoard(newBoard, ship.getId());
        });

        for (var index = 0; index < ship.getLength(); index++) {

            if (!this.isPositionEmpty({ board: newBoard, x: xPos, y: yPos }))
                throw new Error("This position on the board is already occupied.")

            newBoard[yPos][xPos] = ship.getId();
            direction == ShipDirection.HORIZONTAL ? xPos++ : yPos++;
        }

        this.board = newBoard;
        this.ships.push(ship);
    }

    clearExistingShipFromBoard(newBoard, shipId) {
        for (var y = 0; y < this.maxRows; y++) {
            for (var x = 0; x < this.maxColumns; x++) {
                if (newBoard.at(y).at(x) == shipId)
                    newBoard[y][x] = GameboardValues.EMPTY;
            }
        }
            
        return newBoard;
    }

    isPositionEmpty(placementInfo) {
        return placementInfo.board.at(placementInfo.y).at(placementInfo.x) == GameboardValues.EMPTY;
    }

    isPositionSunk(placementInfo) {
        return placementInfo.board.at(placementInfo.y).at(placementInfo.x) == GameboardValues.SUNK;
    }

    isMissedAttack(placementInfo) {
        return placementInfo.board.at(placementInfo.y).at(placementInfo.x) == GameboardValues.MISSED;
    }

    placeShipValidation(shipLength, coordinates, direction) {

        var xPos = coordinates.x;
        var yPos = coordinates.y;

        if (direction == ShipDirection.HORIZONTAL && xPos + shipLength > this.maxColumns)
            return false; //failed validation

        if (direction == ShipDirection.VERTICAL && yPos + shipLength > this.maxRows)
            return false; //failed validation

        return true; //passed validation
    }

    receiveAttack = (coordinates) => {

        console.log(this.board)

        if (this.isPositionSunk({ board: this.board, x: coordinates.x, y: coordinates.y }))
            return { results: GameboardValues.ALREADY_SUNK };

        if (this.isMissedAttack({ board: this.board, x: coordinates.x, y: coordinates.y }))
            return { results: GameboardValues.ALREADY_MISSED };

        if (this.isPositionEmpty({ board: this.board, x: coordinates.x, y: coordinates.y }))
        {
            this.board[coordinates.y][coordinates.x] = GameboardValues.MISSED;
            this.lastReceivedAttack = GameboardValues.MISSED;

            this.missedAttacks++;
            return { results: GameboardValues.MISSED };
        }

        var shipId = this.board.at(coordinates.y).at(coordinates.x);
        var ship = this.getShipById(shipId);
        ship.increaseHitCount();

        this.board[coordinates.y][coordinates.x] = GameboardValues.SUNK;

        if (ship.isSunk()) 
            this.shipSunkCount++

        return { results: GameboardValues.SUNK };
    }

    getShipById(shipId) {
        var shipFound = false;
        var foundShip;
        this.ships.forEach(ship => {
            if (ship.getId() == shipId)
            {
                shipFound = true;
                foundShip = ship;
            }
            
        });

        if (!shipFound)
            throw new Error(`Ship id not found. Ship id: ${shipId}`);

        return foundShip
    }

    getShips() {
        return this.ships;
    }

    getLastReceivedAttack() {
        return this.lastReceivedAttack;
    }

}