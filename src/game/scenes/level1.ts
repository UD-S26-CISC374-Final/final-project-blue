import { EventBus } from "../event-bus";
import { Scene } from "phaser";

import PhaserLogo from "../objects/phaser-logo";
import FpsText from "../objects/fps-text";

export class Level1 extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    phaserLogo: PhaserLogo;
    fpsText: FpsText;
    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super("Level1");
    }

    preload() {
        this.load.image("hay", "assets/hay.png");
        this.load.spritesheet("dude", "../../public/assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
    }

    create() {
        const { width, height } = this.scale;
        this.player = this.physics.add.sprite(100, 150, "dude");
        this.player.setFrame(5);

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // animations
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        const hayPlatform1 = this.physics.add
            .staticImage(100 + 75, 400, "hay")
            .setDisplaySize(150, 32)
            .refreshBody();
        const hayPlatform2 = this.physics.add
            .staticImage(350 + 75, 320, "hay")
            .setDisplaySize(150, 32)
            .refreshBody();

        this.physics.add.collider(this.player, hayPlatform1);
        this.physics.add.collider(this.player, hayPlatform2);

        this.camera = this.cameras.main;
        this.cameras.main.setBounds(0, 0, 2000, 600);
        this.camera.setBackgroundColor(0xffffff);
        // this.lines = this.add.graphics();

        //Text Box
        const commandBox = this.add.dom(width / 2, height - 50).createFromHTML(`
            <input
                type="text"
                id = "commandBox"

                placeholder = "Enter a command..."
                style="font-size:24px;
                    padding: 8px;
                    width:250px;
                    position: absolute;
                    z-index: 1000;
                    background: white;
                    border: 1px solid black;
                "
            />
        `);
        commandBox.setScrollFactor(0);

        const enter = document.getElementById(
            "commandBox",
        ) as HTMLInputElement | null;
        if (!enter) return;
        enter.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                const value = enter.value;
                console.log(value);
            }
        });

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        const pointer = this.input.activePointer;
        const speed = 2; // Adjust speed as needed
        const edgeMargin = 50; // Pixels from edge to trigger scroll

        // Right Edge
        if (pointer.x > this.scale.width - edgeMargin) {
            this.cameras.main.scrollX += speed;
        }
        // Left Edge
        else if (pointer.x < edgeMargin) {
            this.cameras.main.scrollX -= speed;
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);

            this.player.anims.play("turn");
        }

        if (this.cursors.up.isDown && this.player.body!.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
