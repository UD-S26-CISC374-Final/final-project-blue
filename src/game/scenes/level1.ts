import { EventBus } from "../event-bus";
import { Scene } from "phaser";

import PhaserLogo from "../objects/phaser-logo";
import FpsText from "../objects/fps-text";

export class Level1 extends Scene {
    didShowConnectionTutorial = false;
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    phaserLogo: PhaserLogo;
    fpsText: FpsText;
    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    spawnx: number;
    spawny: number;
    platforms!: Phaser.Physics.Arcade.StaticGroup;
    currentPlatform?: Phaser.Physics.Arcade.Image;
    platformList!: Map<number, Phaser.Physics.Arcade.Image>;
    lines!: Phaser.GameObjects.Graphics;
    private lastPlatform: Phaser.Physics.Arcade.Image | null = null;
    health = 100;
    maxHealth = 100;
    healthBarBg!: Phaser.GameObjects.Graphics;
    healthBarFill!: Phaser.GameObjects.Graphics;
    overlay!: Phaser.GameObjects.Container;
    hurtChirp:
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound
        | Phaser.Sound.WebAudioSound;

    //BETA CHANGE
    tutorialBox!: Phaser.GameObjects.Container;
    tutorialActive = true;
    tutorialTexts: string[] = [];
    tutorialIndex = 0;
    commandInput!: HTMLInputElement;

    constructor() {
        super("Level1");
    }

    //BETA CHANGE
    advanceTutorial(dialogue: Phaser.GameObjects.Text) {
        if (!this.tutorialActive) return;

        this.tutorialIndex++;

        if (this.tutorialIndex >= this.tutorialTexts.length) {
            this.tutorialBox.destroy();
            this.tutorialActive = false;
            this.commandInput.disabled = false;
            this.commandInput.focus();

            return;
        }
        dialogue.setText(this.tutorialTexts[this.tutorialIndex]);
    }

    //BETA CHANGE
    startTutorial() {
        this.tutorialActive = true;
        this.commandInput.disabled = true;
        const cam = this.cameras.main;

        // dark overlay
        const bg = this.add
            .rectangle(cam.width / 2, cam.height, cam.width, 180, 0x000000, 0.7)
            .setOrigin(0.5, 1)
            .setScrollFactor(0);

        // character portrait placeholder
        const portrait = this.add.image(500, 400, "trina");

        // dialogue text
        const dialogue = this.add
            .text(520, cam.height - 150, "", {
                fontSize: "24px",
                color: "floralwhite",
                wordWrap: { width: 400 },
                fontFamily: "ChickinFont",
            })
            .setScrollFactor(0);

        const clickSpace = this.add.text(
            520,
            600,
            "(Press Space to Continue)",
            {
                fontSize: "19px",
                color: "floralwhite",
                fontFamily: "ChickinFont",
            },
        );
        clickSpace.alpha = 0.5;

        this.tutorialTexts = [
            "Hey kid, I'm Trina Rex. What, you've never seen a dinosaur with glasses before?",
            "If you want to find your mom, you're going to have to learn a thing or two about linked lists.",
            "See those platforms? They're called NODES. Each of 'em has a name.",
            'Like a chicken has feathers, nodes have a feature called "next".',
            "If you want to jump from one platform to another, make sure the current node's NEXT points to the right node.",
            "Why not try node1->next=node2 and see what happens?",
        ];

        dialogue.setText(this.tutorialTexts[0]);
        this.tutorialBox = this.add.container(0, 0, [
            bg,
            portrait,
            dialogue,
            clickSpace,
        ]);
        this.input.keyboard!.on("keydown-SPACE", () => {
            this.advanceTutorial(dialogue);
        });
        this.input.on("pointerdown", () => {
            this.advanceTutorial(dialogue);
        });
    }

    //BETA CHANGE
    compTutorial() {
        this.input.removeAllListeners("pointerdown");
        this.input.keyboard!.removeAllListeners("keydown-SPACE");
        this.tutorialActive = true;
        this.commandInput.disabled = true;
        const cam = this.cameras.main;

        // dark overlay
        const bg = this.add
            .rectangle(cam.width / 2, cam.height, cam.width, 180, 0x000000, 0.7)
            .setOrigin(0.5, 1)
            .setScrollFactor(0);

        // character portrait placeholder
        const portrait = this.add.image(500, 400, "trina");

        // dialogue text
        const dialogue = this.add
            .text(520, cam.height - 150, "", {
                fontSize: "24px",
                color: "#ffffff",
                wordWrap: { width: 400 },
                fontFamily: "ChickinFont",
            })
            .setScrollFactor(0);

        this.tutorialIndex = 0;
        this.tutorialTexts = [
            "Look at that! Now you can jump to the next platform safely.",
            "You can move around using the ARROW KEYS.",
            "Keep making it to the last visible platform, and you'll be outta this rinky-dink barn in no time.",
        ];

        dialogue.setText(this.tutorialTexts[0]);
        this.tutorialBox = this.add.container(0, 0, [bg, portrait, dialogue]);
        this.input.keyboard!.on("keydown-SPACE", () => {
            this.advanceTutorial(dialogue);
        });
        this.input.on("pointerdown", () => {
            this.advanceTutorial(dialogue);
        });
    }

    showLevelComplete() {
        this.overlay.setVisible(true);
        this.overlay.setAlpha(0);
        this.overlay.setScale(0.9);
        this.tweens.add({
            targets: this.overlay,
            alpha: 1,
            scale: 1,
            duration: 700,
            ease: "Back.easeOut",
        });
        this.player.body!.enable = false;
    }

    takeDamage(amount: number) {
        this.health = Math.max(0, this.health - amount);
        this.drawHealthBar();
    }
    heal(amount: number) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.drawHealthBar();
    }
    drawHealthBar() {
        const x = 780;
        const y = 20;
        const width = 200;
        const height = 20;

        const percent = this.health / this.maxHealth;

        //black border BETA CHANGE
        const healthRect = this.add
            .rectangle(x + 100, y + 10, 200, 20)
            .setStrokeStyle(2, 0x000000);
        healthRect.setScrollFactor(0);

        // background (red/empty)
        this.healthBarBg.clear();
        this.healthBarBg.fillStyle(0xcf8782);
        this.healthBarBg.fillRect(x, y, width, height);

        // foreground (green/current HP)
        this.healthBarFill.clear();
        this.healthBarFill.fillStyle(0x82cf93);
        this.healthBarFill.fillRect(x, y, width * percent, height);

        //make sure it scrolls with the screen
        this.healthBarBg.setScrollFactor(0);
        this.healthBarFill.setScrollFactor(0);
    }

    updatePlatformStates() {
        // Turn OFF all platforms first
        this.platformList.forEach((platform) => {
            if (platform.body) {
                platform.body.enable = false;
                platform.clearTint();
            }
        });

        if (!this.currentPlatform) return;

        // Current platform stays solid
        if (this.currentPlatform.body) {
            this.currentPlatform.body.enable = true;
        }

        // Enable .next
        const next = this.currentPlatform.getData(
            "next",
        ) as Phaser.Physics.Arcade.Image | null;

        if (next && next.body) {
            next.body.enable = true;
        }

        // Enable .prev
        const prev = this.currentPlatform.getData(
            "prev",
        ) as Phaser.Physics.Arcade.Image | null;
        if (prev && prev.body) {
            prev.body.enable = true;
            prev.setTint(0xffaa00);
        }
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
        graphics.alpha = 0.4;
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
        //BETA CHANGE
        const match = command.match(/node(\d+)->(next|prev)\s*=\s*node(\d+)/);

        if (!match) {
            //BETA CHANGE
            const warn = this.add
                .text(600, 700, "Invalid Input!", {
                    fontSize: "25px",
                    color: "#c72828",
                    fontFamily: "ChickinFont",
                })
                .setOrigin(0.5);
            warn.setScrollFactor(0);

            this.tweens.add({
                targets: warn,
                alpha: 0, // Target alpha
                duration: 3000,
                ease: "Linear",
                onComplete: () => {
                    warn.destroy();
                },
            });
            return;
        }
        //Breaking down the match command into smaller bits - from, direction (next/prev) and to
        const from = parseInt(match[1]);
        const direction = match[2];
        const to = parseInt(match[3]);

        //Map works with keys! So get the from key for the current platform and likewise with to
        const fromPlatform = this.platformList.get(from);
        const toPlatform = this.platformList.get(to);

        //BETA
        const nextConnect = this.add
            .text(toPlatform!.x, toPlatform!.y - 50, "Connection Made!", {
                fontSize: "35px",
                color: "#097000",
                fontFamily: "ChickinFont",
            })
            .setOrigin(0.5);
        nextConnect.setScrollFactor(0);

        this.tweens.add({
            targets: nextConnect,
            alpha: 0, // Target alpha
            duration: 2000,
            ease: "Linear",
            onComplete: () => {
                nextConnect.destroy();
            },
        });

        if (!fromPlatform || !toPlatform) return;
        fromPlatform.setData(direction, toPlatform);
        fromPlatform.setData(direction, toPlatform);

        //BETA CHANGE
        if (from === 1 && direction === "next" && to === 2) {
            this.didShowConnectionTutorial = true;
            this.compTutorial();
        }

        this.drawAll();
        this.updatePlatformStates();
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
        this.currentPlatform = currPlatform;

        if (this.currentPlatform === this.platformList.get(5)) {
            this.showLevelComplete();
        }

        this.updatePlatformStates();
    }

    createPlatform(x: number, y: number, number: number) {
        const hayPlatform = this.platforms.create(
            x,
            y,
            "hay",
        ) as Phaser.Physics.Arcade.Image;
        hayPlatform.setDisplaySize(150, 32).refreshBody();

        //BETA CHANGE
        this.add.rectangle(x, y, 150, 32).setStrokeStyle(2, 0xffffff);

        //Monitor movement of Blue onto the platform - test which platform he's on
        this.physics.add.collider(
            this.player,
            this.platforms,
            (player, platform) => {
                const p = platform as Phaser.Physics.Arcade.Image;
                if (this.lastPlatform === p) return;
                this.lastPlatform = p;

                this.landOnPlatform(player, platform);
            },
            undefined,
            this,
        );

        //The number above the platforms
        hayPlatform.setData("number", number);
        this.add
            .text(x, y, "node" + number.toString(), {
                fontSize: "25px",
                color: "#000000",
                fontFamily: "ChickinFont",
            })
            .setOrigin(0.5);

        hayPlatform.setData("next", null);
        hayPlatform.setData("prev", null);
        this.platformList.set(number, hayPlatform);
    }

    preload() {
        this.load.audio("tweet", "assets/tweet.mp3");
        this.load.image("hay", "assets/hay.png");
        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 42,
        });

        //BETA CHANGE
        this.load.image("s1bg", "assets/stage1bg.png");
        this.load.image("trina", "assets/trina.png");
    }

    create() {
        const { width, height } = this.scale;
        const s1bg = this.add.image(0, 0, "s1bg").setOrigin(0);
        s1bg.setDepth(-10);
        s1bg.setDisplaySize(1800, 700);
        s1bg.setScale(1.1);
        this.lines = this.add.graphics();
        this.platformList = new Map(); //New list
        this.health = 100;
        this.currentPlatform = undefined;
        this.spawnx = 100;
        this.spawny = 150;
        this.player = this.physics.add.sprite(100, 150, "dude");
        this.player.setFrame(5);
        this.textures.get("dude").setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.player.setDisplaySize(32, 42);
        this.hurtChirp = this.sound.add("tweet");

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
        this.createPlatform(this.spawnx + 650, this.spawny + 350, 3);
        this.createPlatform(this.spawnx + 950, this.spawny + 300, 4);
        this.createPlatform(this.spawnx + 1350, this.spawny + 350, 5);

        // Disable ALL first
        this.platformList.forEach((platform) => {
            if (platform.body) {
                platform.body.enable = false;
            }
        });

        //texts, BETA CHANGE
        this.add.text(400, 230, "node1->next=node2", {
            fontSize: "25px",
            color: "#5a3604",
            fontFamily: "ChickinFont",
        });
        this.add.text(530, 320, "Use arrow keys to move", {
            fontSize: "25px",
            color: "#5a3604",
            fontFamily: "ChickinFont",
        });

        // Enable starting platform
        const startPlatform = this.platformList.get(1);

        if (startPlatform && startPlatform.body) {
            startPlatform.body.enable = true;
            this.currentPlatform = startPlatform;
        }

        this.camera = this.cameras.main;
        this.cameras.main.setBounds(0, 0, 1800, 700);
        this.physics.world.setBounds(0, 0, 1800, 700);
        this.cameras.main.startFollow(this.player);
        this.camera.setBackgroundColor(0xffffff);

        const commandBox = this.add.dom(width / 2, height - 50).createFromHTML(`
            <input
                type="text"
                id = "commandBox"

                placeholder = "Enter a command..."
                style="font-size:24px;
                    padding: 8px;
                    width:470px;
                    position: absolute;
                    z-index: 1000;
                    background: white;
                    border: 1px solid black;
                "
            />
        `);
        commandBox.setScrollFactor(0);

        //BETA CHANGE
        const enter = document.getElementById(
            "commandBox",
        ) as HTMLInputElement | null;
        if (!enter) return;
        enter.focus();
        this.commandInput = enter;
        enter.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                const value = enter.value;
                this.processCommand(value); //HERE
                //BETA CHANGE
                enter.value = "";
            }
        });

        this.healthBarBg = this.add.graphics();
        this.healthBarFill = this.add.graphics();
        this.drawHealthBar();

        const overlay = this.add
            .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
            .setOrigin(0);
        this.tweens.add({
            targets: overlay,
            alpha: 0,
            duration: 1000,
            onComplete: () => overlay.destroy(),
        });

        this.overlay = this.add.container(0, 0);
        this.overlay.setDepth(999); // always on top
        this.overlay.setVisible(false);

        const cam = this.cameras.main;

        const bg = this.add.rectangle(
            cam.width / 2,
            cam.height / 2,
            cam.width,
            cam.height,
            0xaf9165,
            0.6,
        );

        const text = this.add
            .text(cam.width / 2, cam.height / 2, "Level Completed!", {
                fontSize: "48px",
                color: "floralwhite",
                fontFamily: "ChickinFont",
            })
            .setOrigin(0.5);

        this.overlay.add([bg, text]);
        bg.setScrollFactor(0);
        text.setScrollFactor(0);

        const nextLevelButton = this.add
            .text(cam.width / 2, cam.height / 2 + 80, "Next Level", {
                fontSize: "32px",
                color: "#af9165",
                backgroundColor: "floralwhite",
                padding: {
                    left: 12,
                    right: 12,
                    top: 6,
                    bottom: 6,
                },
                fontFamily: "ChickinFont",
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true });
        this.overlay.add(nextLevelButton);
        nextLevelButton.on("pointerdown", () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("Level2");
            });
        });
        const retryLevelButton = this.add
            .text(cam.width / 2, cam.height / 2 + 130, "Retry Level", {
                fontSize: "32px",
                color: "#af9165",
                backgroundColor: "floralwhite",
                padding: {
                    left: 12,
                    right: 12,
                    top: 6,
                    bottom: 6,
                },
                fontFamily: "ChickinFont",
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true });
        this.overlay.add(retryLevelButton);
        retryLevelButton.on("pointerdown", () => {
            this.scene.restart();
        });
        this.startTutorial(); //beta change

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        const pointer = this.input.activePointer;
        const speed = 2; // Adjust speed as needed
        const edgeMargin = 50; // Pixels from edge to trigger scroll

        //BETA CHANGE
        if (this.tutorialActive) {
            this.player.setVelocity(0);
            return;
        }
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
            this.player.setVelocityY(-230);
        }

        //Fall + Respawn
        if (this.player.y > this.scale.height - 100) {
            this.player.setPosition(
                this.currentPlatform!.x,
                this.currentPlatform!.y - 80,
            );

            this.takeDamage(20);
            this.player.setTint(0xff0000);
            this.hurtChirp.play();
            this.time.delayedCall(
                500,
                () => {
                    this.player.clearTint();
                },
                [],
                this,
            );
        }

        if (!this.currentPlatform) return;

        if (this.health <= 0) {
            this.currentPlatform = undefined;
            this.player.setPosition(this.spawnx, this.spawny);
            this.scene.restart();
            this.scene.start("GameOver", { returnTo: "Level1" });
            this.physics.resume();
        }
    }
}
