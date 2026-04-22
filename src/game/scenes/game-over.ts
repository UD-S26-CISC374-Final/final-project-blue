import { EventBus } from "../event-bus";
import { Scene } from "phaser";

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;

    constructor() {
        super("GameOver");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);

        this.background = this.add.image(512, 384, "background");
        this.background.setAlpha(0.5);

        this.gameOverText = this.add
            .text(512, 384, "Game Over!", {
                fontFamily: "ChickinFont",
                fontSize: 100,
                color: "#ffffff",
                // stroke: "#000000",
                // strokeThickness: 8,
                align: "center",
                padding: { right: 390, bottom: 100 },
            })
            .setOrigin(0.5)
            .setDepth(100);
        const cam = this.cameras.main;

        const retryLevelButton = this.add
            .text(cam.width / 2 - 200, cam.height / 2 + 80, "Retry Level", {
                fontSize: "32px",
                color: "floralwhite",
                fontFamily: "ChickinFont",
                backgroundColor: "#af9165",
                padding: {
                    left: 12,
                    right: 12,
                    top: 6,
                    bottom: 6,
                },
                align: "left",
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true });
        retryLevelButton.on("pointerdown", () => {
            this.scene.stop("GameOver");
            this.scene.start("Level1");
        });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("MainMenu");
    }
}
