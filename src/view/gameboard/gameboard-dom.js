export { GameboardDom };
import { ShipDirection } from "../../model/ship/ship-direction";
import { Ship } from "../../model/ship/Ship";

class GameboardDom {

    squares;
    placeShipsCallback;
    currentDraggableElement;
    dropDataShip;
    xIndex;
    yIndex;
    playerTurnCallback;
    ships;

    constructor(params) {
        this.playerTurnCallback = params.playerTurnCallback;
        var gameboard = document.createElement('div')
        gameboard.classList = 'gameboard';

        this.ships = new Set();
        this.squares = Array.from({ length: 10 }, () => Array(10).fill(null));
        this.placeShipsCallback = params.placeShipsCallback;

        for (var i = 0; i < 100; i++) {
            var boardLocation = document.createElement('div');
            var xIndex = i % 10;
            var yIndex = Math.floor(i / 10);
            boardLocation.id = `${xIndex}-${yIndex}`
            boardLocation.classList = 'board-location & dropzone';
            
            this.addListeners(boardLocation, yIndex, xIndex);
            this.squares[yIndex][xIndex] = boardLocation;
            gameboard.appendChild(this.squares[yIndex][xIndex]);
        }

        return gameboard;
    }

    addListeners(boardLocation, yIndex, xIndex) {

        boardLocation.addEventListener('click', function (e) {
            var coordinates = {x: xIndex, y: yIndex};
            this.playerTurnCallback( coordinates, boardLocation);

        }.bind(this));

        boardLocation.addEventListener('mouseover', function() {
            //TODO fix hovering
            // boardLocation.style.backgroundColor = 'black';
            // boardLocation.style.opacity = '0.5';
        });

        boardLocation.addEventListener('mouseout', function() {
            //TODO fix hovering
            // boardLocation.style.backgroundColor = 'transparent';
            // boardLocation.style.opacity = '1';
        });

        boardLocation.addEventListener('dragover', function(event) {
            event.preventDefault();
            boardLocation.style.backgroundColor = 'blue'
            event.dataTransfer.clearData();
        }.bind(this))

        boardLocation.addEventListener('dragleave', function(event) {
            event.preventDefault();
            boardLocation.style.backgroundColor = 'transparent';
            boardLocation.style.opacity = '1';
            event.dataTransfer.clearData();
        }.bind(this));

        boardLocation.addEventListener('drop', function(event) {
            event.preventDefault();

            this.getDataFromEvent(event).then(function(dropData){
                //TODO It would be good to go back and learn more about 
                //'drop' event listeners. I get the feeling that there is 
                //a better way this should be handled. For now, this will do
                var dropDataShip = Ship.fromJson(dropData.ship);
                var isNewShip = true;
                this.xIndex = xIndex;
                this.yIndex = yIndex;
                this.currentDraggableElement = document.getElementById(dropData.shipNameId);
                var index = 0;

                this.ships.forEach(element => {
                    if (element == dropDataShip.getId())
                        isNewShip = false;
                });
                
                this.currentDraggableElement.childNodes.forEach(element => {
                    //Ensure our custom colors transfer onto the board
                    //Because we highlight the gameboard blue and we can
                    //drag from any part of the ship segment, there is a
                    //possibility of the middle of the ship becoming a 
                    //different color
                    element.style.backgroundColor = dropData.shipSectionColors[index];
                    index++;
                });
                
                if (isNewShip == true) {
                    //Only want to add one double click event listener per 
                    //ship DOM
                    this.dropDataShip = dropDataShip;
                    this.currentDraggableElement.addEventListener('dblclick', this.handleDoubleClick.bind(this));
                }

                try {
                    this.placeShipsCallback(this.dropDataShip, { y: this.yIndex, x: this.xIndex }, this.dropDataShip.getShipDirection())
                } catch (error) {
                    console.log(error);
                    alert(error);
                    boardLocation.style.backgroundColor = 'transparent';
                    return;
                }

                this.ships.add(dropDataShip.getId());
                this.squares[yIndex][xIndex].appendChild(this.currentDraggableElement);

                event.target.style.border = '';
                event.dataTransfer.clearData();
                
            }.bind(this)); 
        }.bind(this));
        
    }

    handleDoubleClick = (event) => {
        try {
            this.toggleShipDomDirection();
            this.placeShipsCallback(Ship.fromJson(this.dropDataShip), { y: this.yIndex, x: this.xIndex }, this.dropDataShip.shipDirection)
        } catch (error) {
            this.toggleShipDomDirection();
            console.log(error);
            alert(error);
            return;
        }
    }

    toggleShipDomDirection() {
        if (this.dropDataShip.shipDirection == ShipDirection.VERTICAL) {
            this.currentDraggableElement.style.gridTemplateRows = '1fr'
            this.currentDraggableElement.style.gridTemplateColumns = `repeat(${this.dropDataShip.length}, 1fr)`
            this.dropDataShip.shipDirection = ShipDirection.HORIZONTAL
        } else {
            this.currentDraggableElement.style.gridTemplateRows = `repeat(${this.dropDataShip.length}, 1fr)`
            this.currentDraggableElement.style.gridTemplateColumns = `1fr`
            this.dropDataShip.shipDirection = ShipDirection.VERTICAL
        }
    }

    async getDataFromEvent(event) {
        const data = await event.dataTransfer.getData('application/json');
        const parsedData = await JSON.parse(data);
        return parsedData
    }

}