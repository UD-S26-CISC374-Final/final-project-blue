import { Level } from "./level";

export class Level7 extends Level {
    private inserted2 = false;
    private inserted4 = false;

    constructor() {
        super("Level7");
    }

    startTutorial() {
        this.tutorialTexts = [
            "Now you're in control of building the list.",
            "Some nodes are missing — you must insert them.",
            "Use .next to attach nodes into the chain.",
            "Try inserting node2 first.",
        ];

        super.startTutorial();
    }

    compTutorial() {
        this.tutorialTexts = [
            "Nice.",
            "You rebuilt the missing parts of the list.",
            "This is manual linked list construction.",
        ];

        super.compTutorial();
    }

    processCommand(command: string) {
        const match =
            command.match(/node(\d+)(?:\.)(next|prev)\s*=\s*node(\d+)/);

        if (!match) {
            super.processCommand(command);
            return;
        }

        const from = parseInt(match[1]);
        const direction = match[2];
        const to = parseInt(match[3]);

        //
        // INSERT NODE 2
        //
        if (from === 1 && direction === "next" && to === 2 && !this.inserted2) {
            this.inserted2 = true;

            if (!this.platformList.has(2)) {
                this.createPlatform(
                    this.spawnx + 250,
                    this.spawny + 200,
                    2
                );
            }

            const node1 = this.platformList.get(1);
            const node2 = this.platformList.get(2);
            const node3 = this.platformList.get(3);

            this.drawAll();
            this.updatePlatformStates();

            this.add
                .text(this.cameras.main.centerX, 80, "node2 inserted", {
                    fontSize: "24px",
                    color: "#097000",
                    fontFamily: "ChickinFont",
                })
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setAlpha(1);

            super.processCommand(command);
            return;
        }

        //
        // INSERT NODE 4
        //
        if (from === 3 && direction === "next" && to === 4 && !this.inserted4) {
            this.inserted4 = true;

            if (!this.platformList.has(4)) {
                this.createPlatform(
                    this.spawnx + 550,
                    this.spawny + 100,
                    4
                );
            }

            const node3 = this.platformList.get(3);
            const node4 = this.platformList.get(4);
            const node5 = this.platformList.get(5);
            const node6 = this.platformList.get(6);

            this.drawAll();
            this.updatePlatformStates();

            this.add
                .text(this.cameras.main.centerX, 120, "node4 inserted", {
                    fontSize: "24px",
                    color: "#097000",
                    fontFamily: "ChickinFont",
                })
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setAlpha(1);

            super.processCommand(command);
            this.compTutorial();
            return;
        }

        super.processCommand(command);
    }

    protected buildPlatforms() {
        // initial chain has gaps
        this.createPlatform(this.spawnx + 50, this.spawny + 300, 1);

        // node2 missing
        this.createPlatform(this.spawnx + 350, this.spawny + 300, 3);

        // node4 missing
        this.createPlatform(this.spawnx + 650, this.spawny + 300, 5);
    }

    create() {
        super.create();
    }

    landOnPlatform(player: any, platform: any) {
        super.landOnPlatform(player, platform);

        if (this.currentPlatform === this.platformList.get(5)) {
            this.showLevelComplete();
        }
    }
}