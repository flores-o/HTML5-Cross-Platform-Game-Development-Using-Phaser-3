
class bootGame extends Phaser.Scene {
    constructor() {
        super("BootGame");
    }
    preload() {
        this.load.image("emptytile", "assets/sprites/emptytile.png");
    }
    create() {
        console.log("game is booting...");
        this.scene.start("PlayGame");
    }
}
export default bootGame
