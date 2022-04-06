import gameOptions from './game-options.js'


class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    create() {
        console.log("you are in playGame scene...");
        for (var i = 0; i < gameOptions.boardSize.rows; i++) {
            for (var j = 0; j < gameOptions.boardSize.cols; j++) {
                var tilePosition = this.getTilePosition(i, j);
                this.add.image(tilePosition.x, tilePosition.y, "emptytile");
            }
        }
    }
    getTilePosition(row, col){
        var posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize *
          (col + 0.5);
        var posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize *
          (row + 0.5);
        return new Phaser.Geom.Point(posX, posY);
    }
}
export default playGame
