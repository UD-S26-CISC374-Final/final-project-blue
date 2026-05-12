import { EventBus } from "../event-bus";
import { Scene } from "phaser";

export abstract class Level extends Scene {
    camera!: Phaser.Cameras.Scene2D.Camera;

    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    spawnx = 100;
    spawny = 150;

    platforms!: Phaser.Physics.Arcade.StaticGroup;
    platformList!: Map<number, Phaser.Physics.Arcade.Image>;

    lines!: Phaser.GameObjects.Graphics;

    currentPlatform?: Phaser.Physics.Arcade.Image;
    lastPlatform: Phaser.Physics.Arcade.Image | null = null;

    health = 100;
    maxHealth = 100;
    healthBarBg!: Phaser.GameObjects.Graphics;
    healthBarFill!: Phaser.GameObjects.Graphics;

    overlay!: Phaser.GameObjects.Container;

    commandInput!: HTMLInputElement;

    tutorialActive = true;
    tutorialTexts: string[] = [];
    tutorialIndex = 0;

    hurtChirp!:
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound
        | Phaser.Sound.WebAudioSound;

    constructor(sceneKey: string) {
        super(sceneKey);
    }

    // must implement
    protected abstract buildPlatforms(): void;
    protected abstract getTutorialText(): string[];
    protected abstract getCompletionScene(): string;
    protected abstract getGoalPlatform(): number;

    preload() {
        this.load.audio("tweet", "assets/tweet.mp3");
        this.load.image("hay", "assets/hay.png");
        this.load.image("s1bg", "assets/stage1bg.png");

        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 42,
        });
    }

    create() {
        this.setupBackground();
        this.setupPlayer();
        this.setupAnimations();

        this.platforms = this.physics.add.staticGroup();
        this.platformList = new Map();
        this.lines = this.add.graphics();

        this.buildPlatforms();

        this.setupPlatformCollisions();
        this.enableStartingPlatform();

        this.setupCamera();
        this.setupCommandBox();
        this.setupHealthBar();
        this.setupOverlay();

        this.drawConnections();

        this.input.keyboard!.addCapture('ENTER');
        this.input.keyboard!.addCapture('SPACE');

        this.input.keyboard!.enabled = true;
        //this.input.keyboard!.capture = true;

        this.startTutorial();

        EventBus.emit("current-scene-ready", this);
    }
    setupHealthBar() {
        throw new Error("Method not implemented.");
    }

    setupPlayer() {
        this.player = this.physics.add.sprite(this.spawnx, this.spawny, "dude");

        this.player.setFrame(5);
        this.player.setDisplaySize(32, 42);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.hurtChirp = this.sound.add("tweet");
    }

    setupAnimations() {
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1,
        });
    }

    setupBackground() {
        const bg = this.add.image(0, 0, "s1bg").setOrigin(0);
        bg.setDepth(-10);
        bg.setDisplaySize(1800, 700);
    }

    setupCamera() {
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, 1800, 700);
        this.physics.world.setBounds(0, 0, 1800, 700);
        this.camera.startFollow(this.player);
    }

    createPlatform(x: number, y: number, num: number) {
        const p = this.platforms.create(x, y, "hay") as Phaser.Physics.Arcade.Image;

        p.setDisplaySize(150, 32);
        p.refreshBody();

        p.setData("next", null);
        p.setData("prev", null);
        
        p.setImmovable(true);
        //p.body!.allowGravity = false;

        this.platformList.set(num, p);

        this.add.text(x, y, `node${num}`, {
            fontSize: "24px",
            color: "#000",
        }).setOrigin(0.5);
    }

    setupPlatformCollisions() {
        this.physics.add.collider(this.player, this.platforms, (_, platform) => {
            const p = platform as Phaser.Physics.Arcade.Image;

            if (!this.player.body?.blocked.down) return;
            if (this.lastPlatform === p) return;

            this.lastPlatform = p;
            this.currentPlatform = p;

            this.landOnPlatform(p);
        });
    }

    enableStartingPlatform() {
        const start = this.platformList.get(1);
        if (!start) return;

        this.currentPlatform = start;

        // snap player onto platform 1
        this.player.setPosition(start.x, start.y - 40);

        // force correct physics state
        this.platformList.forEach(p => {
            if (p.body) p.body.enable = false;
        });

        start.body!.enable = true;
    }

    landOnPlatform(platform: Phaser.Physics.Arcade.Image) {
        if (platform === this.platformList.get(this.getGoalPlatform())) {
            this.showLevelComplete();
        }

        this.updatePlatformStates();
        this.player.setVelocity(0, 0);
        this.player.setPosition(platform.x, platform.y - 40);
    }

    updatePlatformStates() {
        this.platformList.forEach((p) => {
            if (p.body) p.body.enable = false;
        });

        if (!this.currentPlatform) return;

        this.currentPlatform.body!.enable = true;

        const next = this.currentPlatform.getData("next");
        const prev = this.currentPlatform.getData("prev");

        if (next?.body) next.body.enable = true;
        if (prev?.body) prev.body.enable = true;

        this.drawConnections();
    }

    drawConnections() {
        this.lines.clear();
        this.lines.lineStyle(3, 0xffffff, 0.6);

        this.platformList.forEach((p) => {
            const next = p.getData("next");

            if (next) {
                this.lines.beginPath();
                this.lines.moveTo(p.x, p.y);
                this.lines.lineTo(next.x, next.y);
                this.lines.strokePath();
            }
        });
    }

    processCommand(command: string) {
        const match = command.match(/node(\d+)->(next|prev)\s*=\s*node(\d+)/);
        if (!match) return;

        const from = Number(match[1]);
        const dir = match[2];
        const to = Number(match[3]);

        const fromP = this.platformList.get(from);
        const toP = this.platformList.get(to);

        if (!fromP || !toP) return;

        fromP.setData(dir, toP);

        this.updatePlatformStates();
    }

    setupCommandBox() {
        const { width, height } = this.scale;

        const box = this.add.dom(width / 2, height - 50).createFromHTML(`
            <input id="commandBox"
            style="font-size:24px;padding:8px;width:470px;" />
        `);

        box.setScrollFactor(0);

        this.commandInput = document.getElementById("commandBox") as HTMLInputElement;

        this.commandInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.processCommand(this.commandInput.value);
                this.commandInput.value = "";
            }
        });

    }

    update() {
        if (this.tutorialActive) return;

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

        if (this.cursors.up.isDown && this.player.body?.touching.down) {
            this.player.setVelocityY(-250);
        }
    }

    showLevelComplete() {
        this.overlay.setVisible(true);
    }

    setupOverlay() {
        const text = this.add.text(500, 300, "Level Complete", {
            fontSize: "48px",
            color: "#fff",
        }).setOrigin(0.5);

        text.setInteractive();

        text.on("pointerdown", () => {
            this.scene.start(this.getCompletionScene());
        });

        this.overlay = this.add.container(0, 0, [text]);
        this.overlay.setVisible(false);
    }

    startTutorial() {
        this.tutorialTexts = this.getTutorialText();

        const text = this.add.text(500, 550, this.tutorialTexts[0], {
            fontSize: "24px",
            color: "#fff",
            wordWrap: { width: 500 },
        }).setScrollFactor(0);

        this.input.keyboard!.on("keydown-SPACE", () => {
            this.tutorialIndex++;

            if (this.tutorialIndex >= this.tutorialTexts.length - 1) {
                this.tutorialActive = false;
                text.destroy();
                return;
            }

            text.setText(this.tutorialTexts[this.tutorialIndex]);
        });
    }
}