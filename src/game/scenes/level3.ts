import { EventBus } from "../event-bus";
import { Scene } from "phaser";

export class Level3 extends Scene {
    camera!: Phaser.Cameras.Scene2D.Camera;
    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    spawnx!: number;
    spawny!: number;

    platforms!: Phaser.Physics.Arcade.StaticGroup;
    platformList!: Map<number, Phaser.Physics.Arcade.Image>;
    currentPlatform?: Phaser.Physics.Arcade.Image;

    items!: Phaser.Physics.Arcade.StaticGroup;
    collectedCount = 0;
    totalItems = 0;

    finishSlab!: Phaser.Physics.Arcade.Image;

    lastPlatform: Phaser.Physics.Arcade.Image | null = null;

    constructor() {
        super("Level3");
    }

    preload() {
        this.load.image("hay", "assets/hay.png");
        this.load.image("slab", "assets/platform.png");
        this.load.image("key", "assets/star.png");
        this.load.image("s1bg", "assets/stage1bg.png");

        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 42,
        });
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(
            20,
            700,
            "Level 3: Use commands like 1.next=2 and 2.prev=1. Collect all stars and reach Platform 7!",
            {
                color: "black",
                fontSize: "15px",
                wordWrap: { width: 500 },
            },
        );

        this.add
            .image(0, 0, "s1bg")
            .setOrigin(0)
            .setDisplaySize(2000, 800)
            .setDepth(-10);

        this.spawnx = 100;
        this.spawny = 150;

        this.player = this.physics.add.sprite(this.spawnx, this.spawny, "dude");
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.platforms = this.physics.add.staticGroup();
        this.platformList = new Map();
        this.items = this.physics.add.staticGroup();

        // NEW LAYOUT
        this.createPlatform(100, 300, 1);
        this.createPlatform(350, 500, 2);
        this.createPlatform(600, 200, 3);
        this.createPlatform(900, 400, 4);
        this.createPlatform(1200, 250, 5);
        this.createPlatform(1500, 500, 6);
        this.createPlatform(1800, 300, 7);

        // Items
        this.createItemOnPlatform(2, "key");
        this.createItemOnPlatform(3, "key");
        this.createItemOnPlatform(4, "key");
        this.createItemOnPlatform(5, "key");

        this.createFinishSlab(7);

        // COLLIDER (IMPORTANT)
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

        // Item collection
        this.physics.add.overlap(this.player, this.items, (_player, item) => {
            const i = item as Phaser.Physics.Arcade.Image;

            if (i.getData("collected")) return;

            i.setData("collected", true);
            i.disableBody(true, true);
            this.collectedCount++;

            if (this.collectedCount === this.totalItems) {
                this.unlockFinishSlab();
            }
        });

        // Disable ALL platforms
        this.platformList.forEach((platform) => {
            if (platform.body) {
                platform.body.enable = false;
            }
        });

        // Enable start
        const start = this.platformList.get(1);
        if (start?.body) {
            start.body.enable = true;
            this.currentPlatform = start;
        }

        this.updatePlatformStates();

        // Camera
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player);

        // COMMAND INPUT
        const commandBox = this.add.dom(width / 2, height - 50).createFromHTML(`
            <input
                type="text"
                id="commandBox"
                placeholder="Enter command..."
                style="font-size:20px; padding:5px; width:400px;"
            />
        `);

        commandBox.setScrollFactor(0);

        const input = document.getElementById("commandBox") as HTMLInputElement;

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.processCommand(input.value);
            }
        });

        EventBus.emit("current-scene-ready", this);
    }

    // -------------------------
    // PLATFORM SYSTEM
    // -------------------------

    createPlatform(x: number, y: number, num: number) {
        const p = this.platforms.create(
            x,
            y,
            "hay",
        ) as Phaser.Physics.Arcade.Image;
        p.setDisplaySize(150, 32).refreshBody();

        p.setData("number", num);
        p.setData("next", null);
        p.setData("prev", null);

        this.add
            .text(x, y - 40, num.toString(), {
                fontSize: "20px",
                color: "#000",
            })
            .setOrigin(0.5);

        this.platformList.set(num, p);
    }

    updatePlatformStates() {
        this.platformList.forEach((platform) => {
            if (platform.body) {
                platform.body.enable = false;
                platform.clearTint();
            }
        });

        if (!this.currentPlatform) return;

        this.currentPlatform.body!.enable = true;

        const next = this.currentPlatform.getData("next");
        const prev = this.currentPlatform.getData("prev");

        if (next?.body) next.body.enable = true;
        if (prev?.body) {
            prev.body.enable = true;
            prev.setTint(0xffaa00);
        }
    }

    processCommand(command: string) {
        const match = command.match(/(\d+)\.(next|prev)\s*=\s*(\d+)/);
        if (!match) return;

        const from = parseInt(match[1]);
        const direction = match[2];
        const to = parseInt(match[3]);

        const fromPlatform = this.platformList.get(from);
        const toPlatform = this.platformList.get(to);

        if (!fromPlatform || !toPlatform) return;

        fromPlatform.setData(direction, toPlatform);

        this.updatePlatformStates();
    }

    landOnPlatform(player: any, platform: any) {
        const p = platform as Phaser.Physics.Arcade.Image;

        if (!player.body.blocked.down) return;

        this.currentPlatform = p;

        // WIN CONDITION
        if (this.currentPlatform === this.platformList.get(7)) {
            console.log("Level Complete!");
        }

        this.updatePlatformStates();
    }

    // -------------------------
    // ITEMS / GOAL
    // -------------------------

    createItemOnPlatform(num: number, key: string) {
        const p = this.platformList.get(num);
        if (!p) return;

        const item = this.items.create(p.x, p.y - 50, key);
        item.setData("collected", false);

        this.totalItems++;
    }

    createFinishSlab(num: number) {
        const p = this.platformList.get(num);
        if (!p) return;

        this.finishSlab = this.physics.add.staticImage(p.x, p.y - 50, "slab");
    }

    unlockFinishSlab() {
        this.finishSlab.disableBody(true, true);
    }

    // -------------------------
    // UPDATE
    // -------------------------

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body!.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
}
