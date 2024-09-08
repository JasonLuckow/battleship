export { PlayerDom };

class PlayerDom {

    playerNameInput;

    constructor(params) {
        var playerContainer = document.createElement('div')
        playerContainer.classList = 'player-container';
        playerContainer.appendChild(this.createPlayerNameBox(params.defaultName));

        return playerContainer;
    }

    createPlayerNameBox(defaultName) {
        var playerName = document.createElement('div');
        playerName.classList = 'player-name';
        playerName.textContent = defaultName;

        return playerName;
    }

    getPlayerName() {
        return this.playerNameInput;
    }
}