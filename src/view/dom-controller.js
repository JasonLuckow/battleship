import { GameboardValues } from "../model/gameboard/gameboard-values";
import { GameboardDom } from "./gameboard/gameboard-dom";
import { PlayerDom } from "./player/player-dom";
import { ShipDom } from "./ship/ship-dom";
import { ShipYardDom } from "./ship/ship-yard-dom";

export { DomController };

class DomController {

    player1Side;
    player2Side;

    player1;
    player2;

    player1ShipYard;
    player2ShipYard;

    player1DomShips;
    player2DomShips;

    player1Gameboard;
    player2Gameboard;

    player1Id;
    player2Id;

    currentPlayerTurn;

    player1ReceiveAttackCallback;
    player2ReceiveAttackCallback;

    player1TurnProcessed;
    player2TurnProcessed;

    gameStarted;

    constructor(params) {
        this.player1DomShips = [];
        this.player2DomShips = [];
        this.gameStarted = false;
        this.player1TurnProcessed = false
        this.player2TurnProcessed = false

        this.player1ReceiveAttackCallback = params.player1ReceiveAttackCallback;
        this.player2ReceiveAttackCallback = params.player2ReceiveAttackCallback;

        this.player1Side = document.getElementById('player-one-side');
        this.player2Side = document.getElementById('player-two-side');

        this.player1Gameboard = new GameboardDom({ 
            placeShipsCallback: params.player1PlaceShipsCallback, 
            playerTurnCallback: this.player1TurnCallback().bind(this),
        });
        this.player1Gameboard.id = 'player-one-gameboard-dom';
        this.player2Gameboard = new GameboardDom({ 
            playerTurnCallback: this.player2TurnCallback().bind(this),
        });
        this.player2Gameboard.id = 'player-two-gameboard-dom';
        this.player1Side.appendChild(this.player1Gameboard);
        this.player2Side.appendChild(this.player2Gameboard);

        this.player1 = new PlayerDom( {defaultName: 'You'} );
        this.player1.id = 'player-one-dom';
        this.player2 = new PlayerDom( {defaultName: 'Computer'} );
        this.player2.id = 'player-two-dom';
        this.player1Side.appendChild(this.player1);
        this.player2Side.appendChild(this.player2);

        this.player1ShipYard = new ShipYardDom();
        this.player1ShipYard.id = 'player-one-ship-dom';
        this.player2ShipYard = new ShipYardDom({ playerShips: params.player2Ships, playerName: 'player2' });
        this.player2ShipYard.id = 'player-two-ship-dom';
        this.player1Side.appendChild(this.player1ShipYard);
        this.player2Side.appendChild(this.player2ShipYard);

        params.player1Ships.forEach(element => {
            this.player1DomShips.push(new ShipDom({ 
                playerShip: element, 
                playerName: 'player1', 
                gameStarted: this.gameStarted
            }))
            this.player1ShipYard.appendChild(this.player1DomShips.at(-1));

        });
    }

    getPlayer1Name() {
        return this.player1.getPlayerName;
    }

    getPlayer2Name() {
        return this.player2.getPlayerName;
    }

    isAllShipsPlaced() {
        return this.player1ShipYard.childNodes.length == 0;    
    }

    disablePlayer2Side() {
        this.player2Side.style.pointerEvents = 'none'
        this.player2Side.style.backgroundColor = 'rgba(0, 0, 0, 0.432)';
    }

    enablePlayer2Side() {
        this.player2Side.style.pointerEvents = 'auto'
        this.player2Side.style.backgroundColor = 'white';
    }

    disablePlayer1Side() {
        this.player1Side.style.pointerEvents = 'none'
        this.player1Side.style.backgroundColor = 'rgba(0, 0, 0, 0.432)';
    }

    enablePlayer1Side() {
        this.player1Side.style.pointerEvents = 'auto'
        this.player1Side.style.backgroundColor = 'white';
    }

    player1TurnCallback = () => {

        return function(coordinates, boardLocation) {

            if (!this.gameStarted || this.didPlayer2Go())// 
                return;
            
            var attackResults = this.player1ReceiveAttackCallback(coordinates)

            if ( attackResults.results == GameboardValues.ALREADY_SUNK
                || attackResults.results == GameboardValues.ALREADY_MISSED )
                return;

            this.updateBoardBasedOnAttackResults(attackResults, boardLocation);
            this.player2TurnFinished();
        }
        
    }

    didPlayer1Go() {
        return this.player1TurnProcessed;
    }

    resetPlayer1TurnProcessed() {
        this.player1TurnProcessed = false;
    }

    player1TurnFinished() {
        this.player1TurnProcessed = true;
    }

    player2TurnCallback = () => {
        return function(coordinates, boardLocation) {

            if (!this.gameStarted || this.didPlayer1Go())
                return;
            
            var attackResults = this.player2ReceiveAttackCallback(coordinates)
            if (attackResults.results == GameboardValues.ALREADY_SUNK
                || attackResults.results == GameboardValues.ALREADY_MISSED )
                return;

            this.updateBoardBasedOnAttackResults(attackResults, boardLocation);
            this.player1TurnFinished()
            
        }.bind(this)
        
    }

    updateBoardBasedOnAttackResults(attackResults, boardLocation) {
        
        //This condition is for coloring the head (blue part) of the ship
        //There is probably a fundamental step I am missing because this 
        //is awkward but oh well, I'd like to focus on learning other things
        if (boardLocation.childNodes[0] != null)
            boardLocation = boardLocation.childNodes[0].childNodes[0]

        if (attackResults.results == GameboardValues.SUNK)
            boardLocation.style.backgroundColor = 'red'
        else
            boardLocation.style.backgroundColor = 'green'
    }

    didPlayer2Go() {
        return this.player2TurnProcessed;
    }

    resetPlayer2TurnProcessed() {
        this.player2TurnProcessed = false;
    }

    player2TurnFinished() {
        this.player2TurnProcessed = true;
    }

    getBoardLocation(xIndex, yIndex) {
        return document.getElementById(`${xIndex}-${yIndex}`)
    }

    setPlayer1Turn() {
        this.enablePlayer2Side();
        this.disablePlayer1Side()
    }

    setPlayer2Turn() {
        this.enablePlayer1Side();
        this.disablePlayer2Side();
    }

    setGameStarted() {
        this.gameStarted = true;
    }
    
}