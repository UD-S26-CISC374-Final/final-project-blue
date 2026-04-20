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

    create() {
        //The Title
        this.title = this.add.text(512, 300, "Linkin Chickin", {
            fontSize: "150px",
            color: "#040903",
            fontFamily: "ChickinFont",
        });
        this.title.setOrigin(0.5, 0.5);

        //Play Button
        const playButton = this.add.text(450, 400, "Play", {
            fontSize: "70px",
            backgroundColor: "#af9165",
            fontFamily: "ChickinFont",
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
