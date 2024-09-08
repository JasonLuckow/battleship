import { GameController } from "../model/game-controller";
import { DomController } from "../view/dom-controller";
import { GameboardValues } from "../model/gameboard/gameboard-values";

export { AppController }
const shipWaitTime = 2000;

class AppController {

    gameController;
    domController;

    player1Attack;
    player2Attack;

    constructor(params) {
        
    }

    async setupGame() {
        this.gameController = new GameController();
        this.player1ReceiveAttack = this.gameController.getPlayer1ReceiveAttackCallback();//The naming here can be confusing and should be cleaned up
        this.player2Attack = this.gameController.getPlayer2ReceiveAttackCallback();

        this.domController = new DomController({ 
            player1Ships: this.gameController.getPlayer1Ships(), 
            player2Ships: this.gameController.getPlayer2Ships(),
            player1PlaceShipsCallback: this.gameController.getPlayer1PlaceShipCallback(),
            player1ReceiveAttackCallback: this.player1ReceiveAttack,
            player2ReceiveAttackCallback: this.player2Attack
        });

        //if single player
        this.gameController.placePlayer2Ships();
        this.domController.disablePlayer2Side();
        
        //This is probably better as a button, I just wanted to try out blocking functions
        //It also only waits for all player 1 ships
        await this.waitForAllShipsPlaced()


    }

    waitForAllShipsPlaced() {
        return new Promise(resolve => {
            console.log('Checking again in 2 seconds')//TODO
            const interval = setInterval(() => {
                if (this.domController.isAllShipsPlaced()) {
                    clearInterval(interval);
                    resolve(true);
                }
                console.log('Checking again in 5 seconds')//TODO
            }, shipWaitTime)//TODO scale this as time goes on
        })
    }

    async startGame() {
        console.log('Game started!')
        var gameOver = false;
        this.domController.setGameStarted()
        while(!gameOver) {
            await this.waitForPlayer1TurnFinish();
            if (this.gameController.isPlayer1Winner()) {
                gameOver = true;
                alert("Player 1 is the winner! Refresh the page to play again")
                break
            }
            await this.waitForPlayer2TurnFinish();
            if (this.gameController.isPlayer2Winner()) {
                gameOver = true;
                alert("Player 2 is the winner! Refresh the page to play again")
                break
            }
        }
    }

    waitForPlayer1TurnFinish() {
        this.domController.setPlayer1Turn()

        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (this.domController.didPlayer1Go()) {
                    this.domController.resetPlayer1TurnProcessed()
                    clearInterval(interval);
                    resolve(true);
                }
            }, 500)//TODO scale this as time goes on
        })
    }

    waitForPlayer2TurnFinish() {
        this.domController.setPlayer2Turn()

        return new Promise(resolve => {
            const interval = setInterval(() => {

                //Should move computer responsibility into it's own class or function?
                var randomX = Math.floor(Math.random() * 10);
                var randomY = Math.floor(Math.random() * 10);
                var coordinates = {x: randomX, y: randomY};
                var boardLocation = this.domController.getBoardLocation(randomX, randomY);
                var attackResults = this.player1ReceiveAttack(coordinates)
                if ( attackResults.results == GameboardValues.ALREADY_SUNK
                    || attackResults.results == GameboardValues.ALREADY_MISSED ) {
                        console.log(`Computer is going again. Spot already hit`)
                        return;
                    }
                this.domController.updateBoardBasedOnAttackResults(attackResults, boardLocation)
                this.domController.player2TurnFinished();

                if (this.domController.didPlayer2Go()) {
                    this.domController.resetPlayer2TurnProcessed()
                    clearInterval(interval);
                    resolve(true);
                }
                
            }, 500)//TODO scale this as time goes on
        })
    }

}