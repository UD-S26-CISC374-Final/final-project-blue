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
    spawnx: number;
    spawny: number;
    platforms!: Phaser.Physics.Arcade.StaticGroup;
    currentPlatform?: number;
    platformList!: Map<number, Phaser.Physics.Arcade.Image>;
    lines!: Phaser.GameObjects.Graphics;

    constructor() {
        super("Level1");
    }

    drawConnection(
        graphics: Phaser.GameObjects.Graphics,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        width: number,
        height: number,
        fill = true,
    ) {
        graphics.lineBetween(x1, y1, x2, y2);

        const dx = x2 - x1;
        const dy = y2 - y1;

        const lineLength = Math.sqrt(dx * dx + dy * dy);

        // Line unit vector
        const udx = dx / lineLength;
        const udy = dy / lineLength;

        // Perpendicular unit vector
        const pdx = -udy;
        const pdy = udx;

        // Arrowhead base vertices
        const x3 = x2 - height * udx + width * pdx;
        const y3 = y2 - height * udy + width * pdy;
        const x4 = x2 - height * udx - width * pdx;
        const y4 = y2 - height * udy - width * pdy;

        if (fill) {
            graphics.fillTriangle(x2, y2, x3, y3, x4, y4);
        } else {
            graphics
                .beginPath()
                .moveTo(x3, y3)
                .lineTo(x2, y2)
                .lineTo(x4, y4)
                .strokePath();
        }
    }

    drawAll() {
        this.lines.clear(); //fun fact - this resets even LINE STYLES. :')
        this.lines.lineStyle(2, 0x000000);
        this.lines.fillStyle(0x000000);
        this.lines.setDepth(1);

        this.platformList.forEach((platform: Phaser.Physics.Arcade.Image) => {
            const next = platform.getData(
                "next",
            ) as Phaser.Physics.Arcade.Image | null;
            const prev = platform.getData(
                "prev",
            ) as Phaser.Physics.Arcade.Image | null;

            if (next) {
                this.drawConnection(
                    this.lines,
                    platform.x + 50,
                    platform.y,
                    next.x,
                    next.y,
                    15,
                    30,
                    false,
                );
            }
            if (prev) {
                this.drawConnection(
                    this.lines,
                    platform.x - 50,
                    platform.y,
                    prev.x,
                    prev.y,
                    15,
                    30,
                    false,
                );
            }
        });
    }

    processCommand(command: string) {
        const match = command.match(/(\d+)\.(next|prev)\s*=\s*(\d+)/);

        if (!match) return;
        //Breaking down the match command into smaller bits - from, direction (next/prev) and to
        const from = parseInt(match[1]);
        const direction = match[2];
        const to = parseInt(match[3]);

        //Map works with keys! So get the from key for the current platform and likewise with to
        const fromPlatform = this.platformList.get(from);
        const toPlatform = this.platformList.get(to);

        if (!fromPlatform || !toPlatform) return;
        fromPlatform.setData(direction, toPlatform);

        this.drawAll();
    }

    landOnPlatform(
        player:
            | Phaser.Physics.Arcade.Body
            | Phaser.Physics.Arcade.StaticBody
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
        platform:
            | Phaser.Physics.Arcade.Body
            | Phaser.Physics.Arcade.StaticBody
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
    ) {
        const currPlayer = player as Phaser.Physics.Arcade.Sprite;
        if (!currPlayer.body!.blocked.down) return;
        const currPlatform = platform as Phaser.Physics.Arcade.Image;
        const number: number = currPlatform.getData("number") as number;
        this.currentPlatform = number;
    }

    createPlatform(x: number, y: number, number: number) {
        const hayPlatform = this.platforms.create(
            x,
            y,
            "hay",
        ) as Phaser.Physics.Arcade.Image;
        hayPlatform.setDisplaySize(150, 32).refreshBody();

        //Monitor movement of Blue onto the platform - test which platform he's on
        this.physics.add.collider(
            this.player,
            this.platforms,
            (player, platform) => {
                this.landOnPlatform(player, platform);
            },
        );

        //The number above the platforms
        hayPlatform.setData("number", number);
        this.add
            .text(x, y - 40, number.toString(), {
                fontSize: "20px",
                color: "#000000",
            })
            .setOrigin(0.5);

        hayPlatform.setData("next", null);
        hayPlatform.setData("prev", null);
        this.platformList.set(number, hayPlatform);
    }

    preload() {
        this.load.image("hay", "assets/hay.png");
        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
    }

    create() {
        const { width, height } = this.scale;
        this.lines = this.add.graphics();
        this.platformList = new Map(); //New list
        this.spawnx = 100;
        this.spawny = 150;
        this.player = this.physics.add.sprite(100, 150, "dude");
        this.player.setFrame(5);

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.lines = this.add.graphics();

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

        this.platforms = this.physics.add.staticGroup();
        //PLATFORMS ARE MADE HERE!!!
        this.createPlatform(this.spawnx, this.spawny + 150, 1);
        this.createPlatform(this.spawnx + 300, this.spawny + 300, 2);
        this.createPlatform(this.spawnx + 550, this.spawny + 200, 3);

        this.camera = this.cameras.main;
        this.cameras.main.setBounds(0, 0, 2000, 600);
        this.cameras.main.startFollow(this.player);
        this.camera.setBackgroundColor(0xffffff);

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
                this.processCommand(value); //HERE
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

        //Respawn
        if (this.player.y > this.scale.height - 100) {
            this.player.setPosition(this.spawnx, this.spawny);
            this.player.setTint(0xff0000);
            this.time.delayedCall(
                500,
                () => {
                    this.player.clearTint();
                },
                [],
                this,
            );
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
