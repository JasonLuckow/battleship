// import { Player } from "../../../src/model/player/player";
import { Gameboard } from "../../../src/model/gameboard/gameboard";
import { GameboardValues } from "../../../src/model/gameboard/gameboard-values";
import { ShipDirection } from "../../../src/model/ship/ship-direction";
import { Ship } from "../../../src/model/ship/Ship";

test('Gameboard missed attacks getters and setters', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});
    gameboard.increaseMissedAttacks();
    expect(gameboard.getMissedAttacks()).toBe(1);
});

test('Gameboard all ships sunk getters and setters', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});
    gameboard.setAllShipsSunk();
    expect(gameboard.isAllShipsSunk()).toBe(true);
});

test('Gameboard id getters and setters', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});
    var newGbId = 7;
    gameboard.setId(newGbId);
    expect(gameboard.getId()).toBe(newGbId);
});

test('Gameboard placeShipValidation return false horizontal', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});

    var rows = 10;
    var cols = 10;
    var board = Array.from({ length: rows }, () => Array(cols).fill(GameboardValues.EMPTY));
    var y = 0;
    var x = 9;
    var shipLength = 3;
    var direction = ShipDirection.HORIZONTAL;

    expect(gameboard.placeShipValidation(shipLength, { x, y }, direction)).toBe(false);
});

test('Gameboard placeShipValidation return false vertical', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});

    var rows = 10;
    var cols = 10;
    var board = Array.from({ length: rows }, () => Array(cols).fill(GameboardValues.EMPTY));
    var y = 8;
    var x = 0;
    var shipLength = 3;
    var direction = ShipDirection.VERTICAL;

    expect(gameboard.placeShipValidation(shipLength, { x, y }, direction)).toBe(false);
});

test('Gameboard placeShipValidation return true horizontal', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});

    var rows = 10;
    var cols = 10;
    var board = Array.from({ length: rows }, () => Array(cols).fill(GameboardValues.EMPTY));
    var y = 0;
    var x = 6;
    var shipLength = 3;
    var direction = ShipDirection.HORIZONTAL;

    expect(gameboard.placeShipValidation(shipLength, { x, y }, direction)).toBe(true);
});

test('Gameboard placeShipValidation return true vertical', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});

    var rows = 10;
    var cols = 10;
    var board = Array.from({ length: rows }, () => Array(cols).fill(GameboardValues.EMPTY));
    var y = 7;
    var x = 0;
    var shipLength = 3;
    var direction = ShipDirection.VERTICAL;

    expect(gameboard.placeShipValidation(shipLength, { x, y }, direction)).toBe(true);
});

test('Gameboard isPositionEmpty return true', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});

    var rows = 10;
    var cols = 10;
    var board = Array.from({ length: rows }, () => Array(cols).fill(GameboardValues.EMPTY));
    var y = 0;
    var x = 0;

    expect(gameboard.isPositionEmpty({ board, y, x })).toBe(true);
});

test('Gameboard isPositionEmpty return false', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});

    var rows = 10;
    var cols = 10;
    var board = Array.from({ length: rows }, () => Array(cols).fill(GameboardValues.EMPTY));
    var y = 7;
    var x = 5;
    var shipId = 2;
    board[y][x] = shipId;

    expect(gameboard.isPositionEmpty({ board, y, x })).toBe(false);
});

test('Gameboard isPositionSunk return false', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});

    var rows = 10;
    var cols = 10;
    var board = Array.from({ length: rows }, () => Array(cols).fill(GameboardValues.EMPTY));
    var y = 0;
    var x = 0;

    expect(gameboard.isPositionSunk({ board, y, x })).toBe(false);
});

test('Gameboard isPositionSunk return true', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});

    var rows = 10;
    var cols = 10;
    var board = Array.from({ length: rows }, () => Array(cols).fill(GameboardValues.EMPTY));
    var y = 7;
    var x = 5;
    var shipId = 2;
    board[y][x] = GameboardValues.SUNK;

    expect(gameboard.isPositionSunk({ board, y, x })).toBe(true);
});

test('Gameboard isMissedAttack return false', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});

    var rows = 10;
    var cols = 10;
    var board = Array.from({ length: rows }, () => Array(cols).fill(GameboardValues.EMPTY));
    var y = 0;
    var x = 0;
    var shipId = 2;
    board[y][x] = shipId;

    expect(gameboard.isMissedAttack({ board, y, x })).toBe(false);
});

test('Gameboard isMissedAttack return true', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});

    var rows = 10;
    var cols = 10;
    var board = Array.from({ length: rows }, () => Array(cols).fill(GameboardValues.EMPTY));
    var y = 7;
    var x = 5;

    expect(gameboard.isMissedAttack({ board, y, x })).toBe(false);

    board[y][x] = GameboardValues.MISSED;
    expect(gameboard.isMissedAttack({ board, y, x })).toBe(true);
});

test('Gameboard placeShip horizontal success', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});

    var y = 7;
    var x = 5;

    var shipId = 2;
    var testShip = new Ship({ length: 3, id: shipId});

    var rows = 10;
    var cols = 10;
    var expectedBoard = Array.from({ length: rows }, () => Array(cols).fill(GameboardValues.EMPTY));
    expectedBoard[y][x] = shipId;
    expectedBoard[y][x + 1] = shipId;
    expectedBoard[y][x + 2] = shipId;

    gameboard.placeShip(testShip, { x, y }, ShipDirection.HORIZONTAL);

    expect(gameboard.getBoard()).toStrictEqual(expectedBoard);
});

test('Gameboard placeShip vertical success', () => {
    var gbId = 0;
    var gameboard = new Gameboard({id: gbId});

    var y = 7;
    var x = 5;

    var shipId = 2;
    var testShip = new Ship({ length: 3, id: shipId});

    var rows = 10;
    var cols = 10;
    var expectedBoard = Array.from({ length: rows }, () => Array(cols).fill(GameboardValues.EMPTY));
    expectedBoard[y][x] = shipId;
    expectedBoard[y + 1][x] = shipId;
    expectedBoard[y + 2][x] = shipId;

    gameboard.placeShip(testShip, { x, y }, ShipDirection.VERTICAL);

    expect(gameboard.getBoard()).toStrictEqual(expectedBoard);
});

