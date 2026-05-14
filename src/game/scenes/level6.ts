import { Level } from "./level";

export class Level6 extends Level {
    constructor() {
        super("Level6");
    }

    // tutorial shown at start
    startTutorial() {
        this.tutorialTexts = [
            "Sometimes, when traversing a linked list, you may need to insert a new node.",
            "Use .next to connect the current node to the new node.",
            "Type node1.next=node2 to insert node2 after node1.",
            "That will make node2 appear.",
        ];

        super.startTutorial();
    }

    // tutorial after successful insertion
    compTutorial() {
        this.tutorialTexts = [
            "Nice work!",
            "You inserted a new node into the list.",
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

        // INSERTION: create node2 and immediately connect + draw the arrow
        if (from === 1 && direction === "next" && to === 2) {
            // create platform 2 if it's missing
            if (!this.platformList.has(2)) {
                this.createPlatform(this.spawnx + 350, this.spawny + 300, 2);
            }

            const fromPlatform = this.platformList.get(from);
            const toPlatform = this.platformList.get(to);

            if (fromPlatform && toPlatform) {
                // set the connection immediately
                fromPlatform.setData(direction, toPlatform);

                // visual feedback (same as base class)
                const nextConnect = this.add
                    .text(toPlatform.x, toPlatform.y - 50, "Connection Made!", {
                        fontSize: "35px",
                        color: "#097000",
                        fontFamily: "ChickinFont",
                    })
                    .setOrigin(0.5);
                nextConnect.setScrollFactor(0);

                this.tweens.add({
                    targets: nextConnect,
                    alpha: 0,
                    duration: 2000,
                    ease: "Linear",
                    onComplete: () => nextConnect.destroy(),
                });

                // redraw connections and update which platforms are enabled
                this.drawAll();
                this.updatePlatformStates();
            }

            // handled here — skip base processing to avoid duplicate effects
            return;
        }

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
    }

    protected buildPlatforms() {
        this.createPlatform(this.spawnx + 50, this.spawny + 300, 1);

        this.createPlatform(this.spawnx + 550, this.spawny + 300, 3);
        this.createPlatform(this.spawnx + 750, this.spawny + 300, 4);
        this.createPlatform(this.spawnx + 950, this.spawny + 300, 5);
        this.createPlatform(this.spawnx + 1150, this.spawny + 300, 6);
    }

    // level ends on node6
    landOnPlatform(player: any, platform: any) {
        super.landOnPlatform(player, platform);

        if (this.currentPlatform === this.platformList.get(6)) {
            this.showLevelComplete();
        }
    }
}