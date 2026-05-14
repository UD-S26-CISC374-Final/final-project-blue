import Phaser from "phaser";
import { Level } from "./level";

export class Level10 extends Level {
    constructor() {
        super("Level10");
    }

    // tutorial shown at start
    startTutorial() {
        this.tutorialTexts = [
            "Sometimes, when traversing a linked list, you may need to delete an existing node from your list.",
            "Use .next from the current node to connect to the the next node after the node you want to delete.",
            "Type node1.next=node3 to delete node2 from the list.",
            "That will make node2 disappear and allow you to connect the rest of the list.",
        ];

        super.startTutorial();
    }

    // tutorial after successful insertion
    compTutorial() {
        this.tutorialTexts = [
            "Nice work!",
            "You deleted a node from the list.",
            "Now traverse to the end.",
        ];

        super.compTutorial();
    }

    // Level 6 specific command behavior
    processCommand(command: string) {

        const match = command.match(/node(\d+)(?:\.)(next|prev)\s*=\s*node(\d+)/);

        if (!match) {
            super.processCommand(command);
            return;
        }
        const from = parseInt(match[1]);
        const direction = match[2];
        const to = parseInt(match[3]);

        // Special behavior for deletion: connecting node1.next=node3 should delete node2
        if (from === 1 && direction === "next" && to === 3) {
            const node2 = this.platformList.get(2);
            if (node2) {
                // If the player is on node2, move them back to node1 to avoid floating
                if (this.currentPlatform === node2) {
                    const node1 = this.platformList.get(1);
                    if (node1) {
                        this.currentPlatform = node1;
                        this.player.setPosition(node1.x, node1.y - 80);
                    }
                }

                // Clear any references to node2 from other platforms
                this.platformList.forEach((platform) => {
                    const next = platform.getData("next") as Phaser.Physics.Arcade.Image | null;
                    const prev = platform.getData("prev") as Phaser.Physics.Arcade.Image | null;
                    if (next === node2) platform.setData("next", null);
                    if (prev === node2) platform.setData("prev", null);
                });

                // Remove from physics group and destroy the game object
                if (this.platforms && (this.platforms as any).remove) {
                    // remove(child, removeFromScene = true, destroyChild = true)
                    (this.platforms as any).remove(node2, true, true);
                }
                node2.destroy();
                this.platformList.delete(2);

                const msg = this.add
                    .text(this.cameras.main.centerX, 80, "node2 deleted", {
                        fontSize: "24px",
                        color: "#097000",
                        fontFamily: "ChickinFont",
                    })
                    .setOrigin(0.5);
                msg.setScrollFactor(0);
                this.time.delayedCall(1500, () => msg.destroy(), [], this);
            }

            // Now let the base handler create the connection node1.next=node3
            super.processCommand(command);
            this.drawAll();
            this.updatePlatformStates();
            return;
        }

        // Default behavior
        super.processCommand(command);
    }

    create() {
        super.create();
        
        // PUT IT HERE
        this.add.text(400, 230, "node1.next=node2", {
            fontSize: "25px",
           color: "#5a3604",
            fontFamily: "ChickinFont",
        });

        // disable all
        this.platformList.forEach((platform) => {
            if (platform.body) {
                platform.body.enable = false;
            }
        });

        const startPlatform = this.platformList.get(1);

        if (startPlatform?.body) {
            startPlatform.body.enable = true;
            this.currentPlatform = startPlatform;
        }

        const node2 = this.platformList.get(2);
        if (node2) {
            this.physics.add.overlap(
                this.player,
                node2,
                () => {
                    this.scene.restart();
                },
                undefined,
                this,
            );
        }
    }

    protected buildPlatforms() {
        this.createPlatform(this.spawnx + 50, this.spawny + 300, 1);

        this.createPlatform(this.spawnx + 250, this.spawny + 250, 2);
        this.createPlatform(this.spawnx + 250, this.spawny + 300, 3);
        this.createPlatform(this.spawnx + 450, this.spawny + 300, 4);
        this.createPlatform(this.spawnx + 650, this.spawny + 300, 5);
        this.createPlatform(this.spawnx + 850, this.spawny + 300, 6);
        this.createPlatform(this.spawnx + 1050, this.spawny + 300, 7);
    }

    // level ends on node6
    landOnPlatform(player: any, platform: any) {
        super.landOnPlatform(player, platform);

        // If the player lands on node2, restart the level immediately
        if (this.currentPlatform === this.platformList.get(2)) {
            this.scene.restart();
            return;
        }

        if (this.currentPlatform === this.platformList.get(6)) {
            this.showLevelComplete();
        }
    }

    update(): void {
        // Call base update (movement, input, etc.)
        super.update();

        const node2 = this.platformList.get(2);
        if (!node2 || !this.player) return;

    const pBounds = this.player.getBounds();
    const nBounds = node2.getBounds();

        if (Phaser.Geom.Intersects.RectangleToRectangle(pBounds, nBounds)) {
            this.scene.restart();
        }
    }
}