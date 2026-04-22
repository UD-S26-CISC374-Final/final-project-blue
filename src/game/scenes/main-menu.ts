import { GameObjects, Scene } from "phaser";
import { EventBus } from "../event-bus";
import type { ChangeableScene } from "../reactable-scene";

export class MainMenu extends Scene implements ChangeableScene {
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor() {
        super("MainMenu");
    }

    preload() {
        this.load.image("mmbackground", "assets/lcmainmenu.png");
    }

    create() {
        //The Title
        this.title = this.add.text(512, 150, "Linkin' Chickin", {
            fontSize: "150px",
            color: "floralwhite",
            fontFamily: "ChickinFont",
        });
        this.title.setOrigin(0.5, 0.5);
        const bg = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "mmbackground",
        );
        bg.setDepth(-10);

        //Play Button
        const playButton = this.add.text(450, 550, "Play", {
            fontSize: "70px",
            backgroundColor: "#af9165",
            fontFamily: "ChickinFont",
            padding: {
                left: 12,
                right: 12,
                top: 6,
                bottom: 6,
            },
        });
        playButton.setInteractive();
        playButton.on("pointerdown", () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.changeScene();
            });
        });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        //this.scale.startFullscreen();
        this.scene.start("Level1");
    }
}
