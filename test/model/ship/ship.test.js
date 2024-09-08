import { Ship } from "../../../src/model/ship/ship";

test('Ship length getter and setter', () => {
    var length = 2;
    var hitCount = 0;
    var sunk = 0;
    var ship = new Ship({ length, hitCount, sunk });

    expect(ship.getLength()).toBe(length);

    var newShipLength = 7;
    ship.setLength(newShipLength);
    expect(ship.getLength()).toBe(newShipLength);
});

test('Ship hit count getter and setter', () => {
    var length = 0;
    var hitCount = 0;
    var sunk = 0;
    var ship = new Ship({ length, hitCount, sunk });

    expect(ship.getHitCount()).toBe(hitCount);

    ship.increaseHitCount();
    expect(ship.getHitCount()).toBe(1);
});

test('Ship sunk getter and setter', () => {
    var length = 3;
    var hitCount = 0;
    var sunk = 0;
    var ship = new Ship({ length, hitCount, sunk });

    expect(ship.isSunk()).toBe(false);
    
    ship.increaseHitCount()
    ship.increaseHitCount()
    ship.increaseHitCount()
    expect(ship.isSunk()).toBe(true);
});