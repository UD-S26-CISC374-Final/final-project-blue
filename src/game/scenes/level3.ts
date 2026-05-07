import { EventBus } from "../event-bus";
import { Scene } from "phaser";

import PhaserLogo from "../objects/phaser-logo";
import FpsText from "../objects/fps-text";

export class Level3 extends Scene {
    lockedConnections!: Set<string>;
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

    items!: Phaser.Physics.Arcade.StaticGroup;
    collectedCount = 0;
    totalItems = 0;
    finishSlab!: Phaser.Physics.Arcade.Image;
    uiIcons: Phaser.GameObjects.Image[] = [];

    tutorialBox!: Phaser.GameObjects.Container;
    tutorialActive = true;
    tutorialTexts: string[] = [];
    tutorialIndex = 0;
    commandInput!: HTMLInputElement;
    didShowConnectionTutorial: boolean;
    forbiddenConnections!: Set<string>;
    aliasMap: Map<number, number> = new Map();

    constructor() {
        super("Level3");
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

        // dialogue text BETA ADD
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
            "Sometimes, you won't know what one of the values are, but you want to get it right anyway.",
            "From what you know about using NEXT and PREV... can you equate Node1 and Node3 to the dark nodes... indirectly?",
            "Give it a go!",
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
        this.tutorialBox.setDepth(10001);
    }
    isReachable(targetId: number): boolean {
        if (!this.currentPlatform) return false;

        const startId = [...this.platformList.entries()].find(
            ([, p]) => p === this.currentPlatform,
        )?.[0];

        if (startId === undefined) return false;

        const visited = new Set<number>();
        const queue: number[] = [startId];

        while (queue.length > 0) {
            const current = queue.shift()!;
            if (current === targetId) return true;

            if (visited.has(current)) continue;
            visited.add(current);

            const node = this.platformList.get(current);
            if (!node) continue;

            const next = node.getData("next") as number | null;

            if (next !== null && !visited.has(next)) {
                queue.push(next);
            }
        }

        return false;
    }

    //BETA CHANGE
    // compTutorial() {
    //     this.input.removeAllListeners("pointerdown");
    //     this.input.keyboard!.removeAllListeners("keydown-SPACE");
    //     this.tutorialActive = true;
    //     this.commandInput.disabled = true;
    //     const cam = this.cameras.main;

    //     // dark overlay
    //     const bg = this.add
    //         .rectangle(cam.width / 2, cam.height, cam.width, 180, 0x000000, 0.7)
    //         .setOrigin(0.5, 1)
    //         .setScrollFactor(0);

    //     // character portrait placeholder
    //     const portrait = this.add.image(500, 400, "trina");

    //     // dialogue text
    //     const dialogue = this.add
    //         .text(520, cam.height - 150, "", {
    //             fontSize: "24px",
    //             color: "#ffffff",
    //             wordWrap: { width: 400 },
    //             fontFamily: "ChickinFont",
    //         })
    //         .setScrollFactor(0);

    //     this.tutorialIndex = 0;
    //     this.tutorialTexts = [
    //         "Nice Work!",
    //         "This is how you traverse. I'll show up a little less now that you've got this down.",
    //         "Keep it up!",
    //     ];

    //     dialogue.setText(this.tutorialTexts[0]);
    //     this.tutorialBox = this.add.container(0, 0, [bg, portrait, dialogue]);
    //     this.input.keyboard!.on("keydown-SPACE", () => {
    //         this.advanceTutorial(dialogue);
    //     });
    //     this.input.on("pointerdown", () => {
    //         this.advanceTutorial(dialogue);
    //     });
    // }
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

        const healthRect = this.add
            .rectangle(x + 100, y + 10, 200, 20)
            .setStrokeStyle(2, 0x000000);
        healthRect.setScrollFactor(0);

        const percent = this.health / this.maxHealth;

        // background (red/empty)
        this.healthBarBg.clear();
        this.healthBarBg.fillStyle(0xcf8782);
        this.healthBarBg.fillRect(x, y, width, height);

        // foreground (green/current HP)
        this.healthBarFill.clear();
        this.healthBarFill.fillStyle(0x82cf93);
        this.healthBarFill.fillRect(x, y, width * percent, height);

        this.healthBarBg.setScrollFactor(0);
        this.healthBarFill.setScrollFactor(0);
    }

    updatePlatformStates() {
        // disable everything first
        this.platformList.forEach((platform) => {
            if (!platform.body) return;
            platform.body.enable = false;
        });

        if (!this.currentPlatform) return;

        // always enable current
        this.currentPlatform.body!.enable = true;

        // ONLY follow NEXT chain
        const nextId = this.currentPlatform.getData("next") as number | null;

        if (nextId !== null) {
            const next = this.platformList.get(nextId);
            if (next && next.body) {
                next.body.enable = true;
            }
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
    resolveEndpoint(
        nodeNumber: number,
        direction: "next" | "prev",
    ): number | null {
        const current = this.platformList.get(nodeNumber);
        if (!current) return null;

        let targetId = current.getData(direction) as number | null;

        if (targetId == null) return nodeNumber;

        // ONLY allow chaining for NEXT
        if (direction === "next") {
            let safety = 0;

            while (safety < 10) {
                const nextNode = this.platformList.get(targetId);
                if (!nextNode) break;

                const chained = nextNode.getData("next") as number | null;

                if (chained == null) break;

                targetId = chained;
                safety++;
            }
        }

        return targetId;
    }

    drawAll() {
        this.lines.clear(); //fun fact - this resets even LINE STYLES. :')
        this.lines.lineStyle(2, 0x000000);
        this.lines.fillStyle(0x000000);
        this.lines.setDepth(1);

        this.platformList.forEach((platform: Phaser.Physics.Arcade.Image) => {
            const nextId = platform.getData("next") as number | null;
            const prevId = platform.getData("prev") as number | null;

            if (prevId !== null) {
                const prev = this.platformList.get(prevId);
                if (prev && prev.body) {
                    prev.body.enable = true;
                }
            }

            const next = nextId ? this.platformList.get(nextId) : null;
            const prev = prevId ? this.platformList.get(prevId) : null;

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

    showWarn() {
        const warn = this.add
            .text(600, 700, "Invalid Input!", {
                fontSize: "25px",
                color: "#c72828",
                fontFamily: "ChickinFont",
            })
            .setOrigin(0.5);
        this.tweens.add({
            targets: warn,
            alpha: 0,
            duration: 3000,
            ease: "Linear",
            onComplete: () => warn.destroy(),
        });
        return;
    }

    showSuccess(x: number, y: number) {
        const warn = this.add
            .text(x, y - 50, "Connection Made!", {
                fontSize: "25px",
                color: "#42c728",
                fontFamily: "ChickinFont",
            })
            .setOrigin(0.5);
        this.tweens.add({
            targets: warn,
            alpha: 0,
            duration: 3000,
            ease: "Linear",
            onComplete: () => warn.destroy(),
        });
        return;
    }

    processCommand(command: string) {
        command = command.replace(/\s+/g, " ").trim();

        const [leftRaw, rightRaw] = command.split("=");
        if (!leftRaw || !rightRaw) {
            this.showWarn();
            return;
        }

        const leftMatch = leftRaw.trim().match(/node(\d+)->(next|prev)/);
        const rightMatch = rightRaw.trim().match(/node(\d+)(?:->(next|prev))?/);

        if (!leftMatch || !rightMatch) {
            this.showWarn();
            return;
        }

        const from = Number(leftMatch[1]);
        const direction = leftMatch[2] as "next" | "prev";

        const rhsNode = Number(rightMatch[1]);
        const rhsDirection = rightMatch[2] as "next" | "prev" | undefined;

        let to = rhsNode;

        if (rhsDirection) {
            const resolved = this.resolveEndpoint(rhsNode, rhsDirection);
            to = resolved ?? rhsNode;
        }
        const isDirect = !rhsDirection;

        if (isDirect) {
            const banKey = `${from}:${direction}:${rhsNode}`;

            if (this.forbiddenConnections.has(banKey)) {
                this.showWarn();
                return;
            }
        }

        const fromPlatform = this.platformList.get(from);
        const toPlatform = this.platformList.get(to);

        if (!fromPlatform || !toPlatform) {
            this.showWarn();
            return;
        }

        const lockKey = `${from}:${direction}`;

        if (this.lockedConnections.has(lockKey)) {
            this.showWarn(); // or a custom message like "Connection is locked!"
            return;
        }
        const forbiddenKey = `${from}:${direction}:${to}`;

        if (this.forbiddenConnections.has(forbiddenKey)) {
            this.showWarn();
            return;
        }

        fromPlatform.setData(direction, to);

        this.showSuccess(toPlatform.x, toPlatform.y);
        this.drawAll();
        this.updatePlatformStates();
        console.log("the command is ", JSON.stringify(command));
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

        //CHANGE4NEWLEVEL
        if (this.currentPlatform === this.platformList.get(6)) {
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
        this.add.rectangle(x, y, 150, 32).setStrokeStyle(2, 0xffffff);

        //The number above the platforms
        this.add
            .text(x, y, "node" + number.toString(), {
                fontSize: "25px",
                color: "#000000",
                fontFamily: "ChickinFont",
            })
            .setOrigin(0.5);

        hayPlatform.setData("next", null as number | null);
        hayPlatform.setData("prev", null as number | null);
        this.platformList.set(number, hayPlatform);
    }

    createItemOnPlatform(platformNumber: number, itemKey: string) {
        const platform = this.platformList.get(platformNumber);

        if (!platform) return;

        const item = this.items.create(
            platform.x,
            platform.y - 50,
            itemKey,
        ) as Phaser.Physics.Arcade.Image;

        item.setDisplaySize(30, 30);
        item.setData("collected", false);

        this.totalItems++;
    }

    createUIIcons() {
        const startX = 30;
        const startY = 30;
        const spacing = 40;

        for (let i = 0; i < this.totalItems; i++) {
            const icon = this.add.image(
                startX + i * spacing,
                startY,
                "gem-silhouette",
            );

            icon.setScrollFactor(0);

            this.uiIcons.push(icon);
        }
    }
    updateUI() {
        const index = this.collectedCount;

        if (this.uiIcons[index]) {
            this.uiIcons[index].setTexture("gem");
        }
    }

    createFinishSlab(platformNumber: number) {
        const platform = this.platformList.get(platformNumber);

        if (!platform) return;

        this.finishSlab = this.physics.add.staticImage(
            platform.x,
            platform.y - 50,
            "slab",
        );

        this.finishSlab.setDisplaySize(150, 32);

        // Start locked
        this.finishSlab.body!.enable = true;
    }
    unlockFinishSlab() {
        this.finishSlab.disableBody(true, true);

        console.log("Finish unlocked!");
    }

    preload() {
        this.load.audio("tweet", "assets/tweet.mp3");
        this.load.image("hay", "assets/hay.png");
        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 42,
        });
        this.load.image("key", "assets/star.png");
        this.load.image("slab", "assets/platform.png");
        this.load.image("s1bg", "assets/stage1bg.png");

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
        this.player = this.physics.add.sprite(400, 150, "dude");
        this.player.setFrame(5);
        this.textures.get("dude").setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.player.setDisplaySize(32, 42);
        this.hurtChirp = this.sound.add("tweet");

        this.items = this.physics.add.staticGroup();
        this.cursors = this.input.keyboard!.createCursorKeys();

        this.player.setBounce(0.35);
        this.player.setCollideWorldBounds(true);

        this.lines = this.add.graphics();
        this.forbiddenConnections = new Set<string>();

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
        this.createPlatform(this.spawnx + 300, this.spawny + 150, 1);
        this.createPlatform(this.spawnx + 100, this.spawny + 300, 2);
        this.createPlatform(this.spawnx + 550, this.spawny + 50, 3);
        this.createPlatform(this.spawnx + 840, this.spawny + 200, 4);
        this.createPlatform(this.spawnx + 450, this.spawny + 350, 5);
        this.createPlatform(this.spawnx + 650, this.spawny + 550, 6);

        this.createItemOnPlatform(2, "key");
        this.createItemOnPlatform(3, "key");
        this.createItemOnPlatform(4, "key");
        // this.createItemOnPlatform(5, "key");
        this.createFinishSlab(6);
        this.lockedConnections = new Set();

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

        this.platformList.forEach((platform) => {
            if (platform.body) {
                platform.body.enable = false;
            }
        });

        //Setting Forbidden Things

        this.forbiddenConnections.add("1:next:5");

        const node5 = this.platformList.get(5);
        const node2 = this.platformList.get(2);
        const node6 = this.platformList.get(6);
        const node4 = this.platformList.get(4);
        const node3 = this.platformList.get(3);

        if (node6 && node4 && node3) {
            node6.setData("next", 4);
            node4.setData("next", 6);

            this.aliasMap.set(6, 4);
            this.aliasMap.set(4, 6);
            this.lockedConnections.add("6:next");
            this.lockedConnections.add("4:next");
        }

        if (node2) {
            this.add.rectangle(
                node2.x,
                node2.y,
                150,
                32,
                0x000000, // fill color
                1, // alpha (transparency)
            );
        }
        if (node4) {
            this.add.rectangle(
                node4.x,
                node4.y,
                150,
                32,
                0x000000, // fill color
                1, // alpha (transparency)
            );
        }

        if (node5) {
            node5.setData("prev", 2);
            this.aliasMap.set(5, 2);
            this.lockedConnections.add("5:prev");
        }
        if (node2) {
            node2.setData("next", 1);

            this.aliasMap.set(5, 2);
            this.lockedConnections.add("5:prev");
        }

        this.drawAll();
        this.updatePlatformStates();

        //to collect time, BETA CHANGE
        this.physics.add.overlap(
            this.player,
            this.items,
            (_player, item) => {
                const currItem = item as Phaser.Physics.Arcade.Image;

                if (currItem.getData("collected")) return;
                if (!this.currentPlatform) return;

                // 🔥 FIND ITEM'S PLATFORM
                const itemPlatform = [...this.platformList.entries()].find(
                    ([, p]) => {
                        const itemAtPlatform = this.items
                            .getChildren()
                            .some((i) => {
                                const ip = i as Phaser.Physics.Arcade.Image;
                                return (
                                    ip === currItem &&
                                    Math.abs(ip.x - p.x) < 5 &&
                                    Math.abs(ip.y - p.y + 50) < 10
                                );
                            });
                        return itemAtPlatform;
                    },
                )?.[1];

                if (!itemPlatform) return;

                // 🔥 GET IDS
                const startId = [...this.platformList.entries()].find(
                    ([, p]) => p === this.currentPlatform,
                )?.[0];

                const targetId = [...this.platformList.entries()].find(
                    ([, p]) => p === itemPlatform,
                )?.[0];

                if (startId === undefined || targetId === undefined) return;

                // ⭐ REAL CHECK: can current platform reach item platform?
                const reachable = this.isReachable(targetId);

                if (!reachable) return;

                // ✅ collect
                currItem.setData("collected", true);
                currItem.disableBody(true, true);

                this.collectedCount++;
                this.updateUI();

                if (this.collectedCount === this.totalItems) {
                    this.unlockFinishSlab();
                }
            },
            undefined,
            this,
        ); // Enable starting platform
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

        //Text Box
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
                this.scene.start("Level5");
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
        this.add.text(80, 30, "(Press Esc to Retry)", {
            fontSize: "19px",
            color: "floralwhite",
            fontFamily: "ChickinFont",
        });

        this.input.keyboard!.on("keydown-ESC", () => {
            this.scene.restart();
        });
    }

    update() {
        const pointer = this.input.activePointer;
        const speed = 2; // Adjust speed as needed
        const edgeMargin = 50; // Pixels from edge to trigger scroll

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
            this.player.setVelocityY(-330);
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
            this.scene.start("GameOver", { returnTo: "Level3" });
            this.physics.resume();
        }
    }
}
