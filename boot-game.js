
import gameOptions from './game-options.js'

class bootGame extends Phaser.Scene {
    constructor() {
        super("BootGame");
    }
    preload() {
        this.load.image("emptytile", "assets/sprites/emptytile.png");
        this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
            frameWidth: gameOptions.tileSize,
            frameHeight: gameOptions.tileSize
        });

    }
    create() {
        console.log("game is booting...");
        this.scene.start("PlayGame");
        //this.canMove = false;
    }
}
export default bootGame
