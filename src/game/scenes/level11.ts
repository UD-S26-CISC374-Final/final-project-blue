import { Level } from "./level";

export class Level11 extends Level {
    private deletedNode5 = false;

    constructor() {
        super("Level11");
    }

    startTutorial() {
        this.tutorialTexts = [
            "This list has a problem.",
            "node5 is in the wrong position — it appears right after node1.",
            "First delete it using node1.next=node2.",
            "Then re-insert it after node4 using node4.next=node5.",
        ];

        super.startTutorial();
    }

    compTutorial() {
        this.tutorialTexts = [
            "Perfect!",
            "You deleted and re-inserted a node.",
            "That is how linked list rearrangement works.",
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
        // STEP 1: delete node5
        //
        if (
            from === 1 &&
            direction === "next" &&
            to === 2 &&
            !this.deletedNode5
        ) {
            const node5 = this.platformList.get(5);

            if (node5) {
                node5.destroy();
                this.platformList.delete(5);
                this.deletedNode5 = true;
            }

            super.processCommand(command);
            return;
        }

        //
        // STEP 2: reinsert node5 after node4
        //
        if (
            from === 4 &&
            direction === "next" &&
            to === 5 &&
            this.deletedNode5
        ) {
            if (!this.platformList.has(5)) {
                // exactly centered between node4 and node6
                this.createPlatform(
                    this.spawnx + 950,
                    this.spawny + 300,
                    5
                );
            }

            super.processCommand(command);


        }

        super.processCommand(command);
    }

    protected buildPlatforms() {
        this.createPlatform(this.spawnx + 50, this.spawny + 300, 1);

        // correct chain
        this.createPlatform(this.spawnx + 250, this.spawny + 300, 2);
        this.createPlatform(this.spawnx + 450, this.spawny + 300, 3);
        this.createPlatform(this.spawnx + 650, this.spawny + 300, 4);

        // WRONG node (must delete first)
        this.createPlatform(this.spawnx + 250, this.spawny + 250, 5);

    }

    create() {
        super.create();

        this.add.text(400, 230, "node1.next=node2", {
            fontSize: "25px",
            color: "#5a3604",
            fontFamily: "ChickinFont",
        });

        this.add.text(900, 230, "then node4.next=node5", {
            fontSize: "25px",
            color: "#5a3604",
            fontFamily: "ChickinFont",
        });
    }

    landOnPlatform(player: any, platform: any) {
        super.landOnPlatform(player, platform);

        if (this.currentPlatform === this.platformList.get(6)) {
            this.showLevelComplete();
        }
    }
}