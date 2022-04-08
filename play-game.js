import gameOptions from './game-options.js'
import { LEFT, RIGHT, UP, DOWN } from './game-options.js';


class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    create() {
        console.log("you are in playGame scene...");
        this.canMove = false
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

        // waiting for player input
        this.input.keyboard.on("keydown", this.handleKey, this);
        this.input.on("pointerup", this.handleSwipe, this);
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
                duration: gameOptions.tweenSpeed,
                callbackScope: this,
                onComplete: function () {
                    console.log("tween completed");
                    this.canMove = true;
                },
            });
        }
    }

    makeMove(d) {
        console.log("about to move");
    }

    handleKey(e) {
        var keyPressed = e.code
        if (this.canMove) {
            switch (e.code) {
                case "KeyA":
                case "ArrowLeft":
                    this.makeMove(LEFT);
                    break;
                case "KeyD":
                case "ArrowRight":
                    this.makeMove(RIGHT);
                    break;
                case "KeyW":
                case "ArrowUp":
                    this.makeMove(UP);
                    break;
                case "KeyS":
                case "ArrowDown":
                    this.makeMove(DOWN);
                    break;
            }
        }
    }

    handleSwipe(e){
        if(this.canMove){
            var swipeTime = e.upTime - e.downTime;
            var fastEnough = swipeTime < gameOptions.swipeMaxTime;
            var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
            var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
            var longEnough = swipeMagnitude > gameOptions.swipeMinDistance;
            if(longEnough && fastEnough){
                Phaser.Geom.Point.SetMagnitude(swipe, 1);
                if(swipe.x > gameOptions.swipeMinNormal){
                    this.makeMove(RIGHT);
                }
                if(swipe.x < -gameOptions.swipeMinNormal){
                    this.makeMove(LEFT);
                }
                if(swipe.y > gameOptions.swipeMinNormal){
                    this.makeMove(DOWN);
                }
                if(swipe.y < -gameOptions.swipeMinNormal){
                    this.makeMove(UP);
                }
    } }
    }
}
export default playGame
