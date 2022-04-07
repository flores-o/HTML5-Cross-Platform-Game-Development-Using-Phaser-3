import gameOptions from './game-options.js'


class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    create() {
        console.log("you are in playGame scene...");
        this.boardArray = [];
        for (var i = 0; i < gameOptions.boardSize.rows; i++) {
            this.boardArray[i] = [];
            for (var j = 0; j < gameOptions.boardSize.cols; j++) {
                var tilePosition = this.getTilePosition(i, j);
                this.add.image(tilePosition.x, tilePosition.y, "emptytile");
                var tile = this.add.sprite(tilePosition.x, tilePosition.y, "tiles", 3);
                tile.visible = false;
                this.boardArray[i][j] = {
                    tileValue: 0,
                    tileSprite: tile
                }

            }
        }
        this.addTile();
        this.addTile();
    }
    getTilePosition(row, col) {
        var posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize *
            (col + 0.5);
        var posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize *
            (row + 0.5);
        return new Phaser.Geom.Point(posX, posY);
    }

    addTile() {
        var emptyTiles = [];
        for (var i = 0; i < gameOptions.boardSize.rows; i++) {
            for (var j = 0; j < gameOptions.boardSize.cols; j++) {
                if (this.boardArray[i][j].tileValue == 0) {
                    emptyTiles.push({
                        row: i,
                        col: j
                    })
                }
            }
        }
        if (emptyTiles.length > 0) {
            var chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);
            this.boardArray[chosenTile.row][chosenTile.col].tileValue = 1;
            this.boardArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
            this.boardArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
            this.boardArray[chosenTile.row][chosenTile.col].tileSprite.alpha = 0;
            this.tweens.add({
                targets: [this.boardArray[chosenTile.row][chosenTile.col].tileSprite],
                alpha: 1,
                duration: gameOptions.tweenSpeed
            });
        }
    }
}
export default playGame
