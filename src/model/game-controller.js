import { Player } from "./player/Player";
import { Ship } from "./ship/Ship";
import { GameboardValues } from "./gameboard/gameboard-values";

export { GameController };

class GameController {

    player1;
    player2;

    player1Ships;
    player2Ships;

    player1Id;
    player2Id;

    currentPlayerTurn;

    constructor(params) {
        this.player1Id = 0;
        this.player2Id = 1;

        this.player1 = new Player( {
            id: this.player1Id
        } );
        this.player2 = new Player( {
            id: this.player2Id
        } );  

        this.currentPlayerTurn = this.player1;
    }

    getPlayer1Ships() {
        return this.player1.getShips();
    }

    getPlayer2Ships() {
        return this.player2.getShips();
    }

    getPlayer1PlaceShipCallback() {
        return this.player1.getPlaceShipCallback();
    }

    getPlayer1ReceiveAttackCallback() {
        return this.player1.getReceiveAttackCallback();
    }

    getPlayer2ReceiveAttackCallback() {
        return this.player2.getReceiveAttackCallback();
    }

    placePlayer2Ships() {
        this.player2.placeShipsRandom();
    }

    isPlayer1Winner() {
        return this.player2.isAllShipsSunk();
    }

    isPlayer2Winner() {
        return this.player1.isAllShipsSunk();
    }

}