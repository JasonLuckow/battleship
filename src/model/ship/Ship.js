import { ShipDirection } from "./ship-direction";

export { Ship };

class Ship {

    length;
    hitCount;
    sunk;
    id;
    shipName;
    shipDirection;

    constructor(params) {
        this.length = params.length;
        this.hitCount = params.hitCount;
        this.sunk = params.sunk;
        this.id = params.id;
        this.shipName = params.shipName;
        this.shipDirection = params.shipDirection;
    }

    static fromDefaultParameters(params) {
        return new Ship({
            length: params.length,
            id: params.id,
            shipName: params.shipName,
            hitCount: 0,
            sunk: false,
            shipDirection: ShipDirection.VERTICAL
        });
    }

    static fromJson(json) {
        return new Ship(json);
    }

    getLength() {
        return this.length;
    }

    setLength(length) {
        this.length = length;
    }

    getHitCount() {
        return this.hitCount;
    }

    increaseHitCount() {
        this.hitCount++;
    }

    isSunk() {
        this.sunk = this.hitCount == this.length;
        return this.sunk;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getShipName() {
        return this.shipName;
    }

    getShipDirection() {
        return this.shipDirection;
    }

    setShipDirection(shipDirection) {
        this.shipDirection = shipDirection;
    }

    toJSON() {
        return {

            length: this.length,
            hitCount: this.hitCount,
            sunk: this.sunk,
            id: this.id,
            shipName: this.shipName,
            shipDirection: this.shipDirection
        };
    }

}