export { ShipDom };
import { ShipDirection } from "../../model/ship/ship-direction";

class ShipDom {
    
    ships;
    dropDatas;
    gameStarted;

    constructor(params) {
        this.gameStarted = params.gameStarted;
        this.dropDatas = []
        console.log(params);
        var ship;
        var shipSectionColors;
        [ship, shipSectionColors] = this.createShip(params.playerShip, params.playerName)
        var dropData = {
            shipNameId: `${params.playerName}-${params.playerShip.getShipName()}`,
            shipSectionColors: shipSectionColors,
            ship: params.playerShip,
            onBoard: false
        };    
        this.dropDatas.push(dropData);
        this.addShipListeners(ship, this.dropDatas.at(-1));  

        return ship;
    }

    createShip(playerShip, playerName) {
        var shipDom = document.createElement('div');
        shipDom.id = `${playerName}-${playerShip.getShipName()}`
        shipDom.style.display = 'grid';

        shipDom.setAttribute('draggable', 'true');
        var shipSectionColors = [];
        var color;
        
        for (var i = 0; i < playerShip.getLength(); i++) {
            var shipSection = document.createElement('div');

            this.syncShipSectionSize('board-location', shipSection);

            this.addShipSectionListeners(shipSection);

            if (i == 0)
                color = 'blue';
            else 
                color = 'black';
   
            shipSection.style.backgroundColor = color;
            shipSectionColors.push(color);
            
            shipDom.appendChild(shipSection); 
        }
        return [shipDom, shipSectionColors];
    } 

    addShipListeners(shipDom, dropData) {

        shipDom.addEventListener('dblclick', function(event) {            
            this.toggleShipDomDirection(shipDom, dropData);
        }.bind(this));

        shipDom.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData('application/json', JSON.stringify(dropData));
        }.bind(this));
    }

    toggleShipDomDirection(shipDom, dropData) {
        if (dropData.ship.shipDirection == ShipDirection.VERTICAL) {
            shipDom.style.gridTemplateRows = '1fr'
            shipDom.style.gridTemplateColumns = `repeat(${dropData.ship.length}, 1fr)`
            dropData.ship.shipDirection = ShipDirection.HORIZONTAL
        } else {
            shipDom.style.gridTemplateRows = `repeat(${dropData.ship.length}, 1fr)`
            shipDom.style.gridTemplateColumns = `1fr`
            dropData.ship.shipDirection = ShipDirection.VERTICAL
        }
    }

    addShipSectionListeners(shipSection) {
        window.addEventListener('resize', function() {
            this.syncShipSectionSize('board-location', shipSection);
        }.bind(this)); 
    }

    syncShipSectionSize(sourceId, shipSection) {
        var width;
        var height;

        const sourceDivs = document.querySelectorAll(`.${sourceId}`);
        const firstSourceDiv = sourceDivs[0];
        var boardLocationBorder = 2
        width = firstSourceDiv.offsetWidth - boardLocationBorder;
        height = firstSourceDiv.offsetHeight - boardLocationBorder;

        shipSection.style.width = `${width}px`
        shipSection.style.height = `${height}px`
    }

}