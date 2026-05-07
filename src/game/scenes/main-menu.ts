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
        const playButton = this.add.text(350, 550, "Click To Play", {
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
            this.tweens.add({
                targets: [this.title, playButton],
                alpha: 0,
                duration: 500,
                ease: "Linear",
            });
            this.cameras.main.setBackgroundColor(0x000000);
            this.cameras.main.fadeOut(300);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("StoryboardStart");
            });
        });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("StoryboardStart");
    }
}
