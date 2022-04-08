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
        var dRow = (d == LEFT || d == RIGHT) ? 0 : d == UP ? -1 : 1;
        var dCol = (d == UP || d == DOWN) ? 0 : d == LEFT ? -1 : 1;
        this.canMove = false;
        var movedTiles = 0;
        var firstRow = (d == UP) ? 1 : 0;
        var lastRow = gameOptions.boardSize.rows - ((d == DOWN) ? 1 : 0);
        var firstCol = (d == LEFT) ? 1 : 0;
        var lastCol = gameOptions.boardSize.cols - ((d == RIGHT) ? 1 : 0);
        for (var i = firstRow; i < lastRow; i++) {
            for (var j = firstCol; j < lastCol; j++) {
                var curRow = dRow == 1 ? (lastRow - 1) - i : i;
                var curCol = dCol == 1 ? (lastCol - 1) - j : j;
                var tileValue = this.boardArray[curRow][curCol].tileValue;
                if (tileValue != 0) {
                    var newRow = curRow;
                    var newCol = curCol;
                    while (this.isLegalPosition(newRow + dRow, newCol + dCol, tileValue)) {
                        newRow += dRow;
                        newCol += dCol;
                    }
                    movedTiles++;
                    this.boardArray[curRow][curCol].tileSprite.depth = movedTiles;
                    var newPos = this.getTilePosition(curRow + dRow, curCol + dCol);
                    this.boardArray[curRow][curCol].tileSprite.x = newPos.x;
                    this.boardArray[curRow][curCol].tileSprite.y = newPos.y;
                    this.boardArray[curRow][curCol].tileValue = 0;
                    if (this.boardArray[newRow][newCol].tileValue == tileValue) {
                        this.boardArray[newRow][newCol].tileValue++;
                        this.boardArray[curRow]
                        [curCol].tileSprite.setFrame(tileValue);
                    } else {
                        this.boardArray[newRow][newCol].tileValue = tileValue;
                    }

                }
            }
        }
        this.refreshBoard();
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

    handleSwipe(e) {
        if (this.canMove) {
            var swipeTime = e.upTime - e.downTime;
            var fastEnough = swipeTime < gameOptions.swipeMaxTime;
            var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
            var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
            var longEnough = swipeMagnitude > gameOptions.swipeMinDistance;
            if (longEnough && fastEnough) {
                Phaser.Geom.Point.SetMagnitude(swipe, 1);
                if (swipe.x > gameOptions.swipeMinNormal) {
                    this.makeMove(RIGHT);
                }
                if (swipe.x < -gameOptions.swipeMinNormal) {
                    this.makeMove(LEFT);
                }
                if (swipe.y > gameOptions.swipeMinNormal) {
                    this.makeMove(DOWN);
                }
                if (swipe.y < -gameOptions.swipeMinNormal) {
                    this.makeMove(UP);
                }
            }
        }
    }
    isLegalPosition(row, col, value) {
        var rowInside = row >= 0 && row < gameOptions.boardSize.rows;
        var colInside = col >= 0 && col < gameOptions.boardSize.cols;
        if (!rowInside || !colInside) {
            return false;
        }
        var emptySpot = this.boardArray[row][col].tileValue == 0;
        var sameValue = this.boardArray[row][col].tileValue == value;
        return emptySpot || sameValue;
    }

    refreshBoard() {
        for (var i = 0; i < gameOptions.boardSize.rows; i++) {
            for (var j = 0; j < gameOptions.boardSize.cols; j++) {
                var spritePosition = this.getTilePosition(i, j);
                this.boardArray[i][j].tileSprite.x = spritePosition.x;
                this.boardArray[i][j].tileSprite.y = spritePosition.y;
                var tileValue = this.boardArray[i][j].tileValue;
                if (tileValue > 0) {
                    this.boardArray[i][j].tileSprite.visible = true;
                    this.boardArray[i][j].tileSprite.setFrame(tileValue - 1);
                }
                else {
                    this.boardArray[i][j].tileSprite.visible = false;
                }
            }
        }
        this.addTile();
    }
}
export default playGame
