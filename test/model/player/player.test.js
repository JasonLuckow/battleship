import { Player } from "../../../src/model/player/Player";
import { Gameboard } from "../../../src/model/gameboard/gameboard";

test('Player gameboard set via constructor', () => {
    var gbId = 1;
    // var gameboard = new Gameboard({id: gbId});
    var player = new Player({id: gbId});
    
    expect(player.getGameboard().getId()).toBe(gbId);
});

test('Player gameboard set via setter', () => {
    var gbId = 1;
    var player = new Player({});
    player.setGameboard(new Gameboard({id: gbId}));
    
    expect(player.getGameboard().getId()).toBe(gbId);
});