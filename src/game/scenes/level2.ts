import { Level } from "./level";
 
 export class Level2 extends Level {

    //BETA CHANGE - tutorial properties are inherited from Level

    constructor() {
        super("Level2");
        this.finishPlatformNumber = 6;
    }

    create() {
        // Run base setup
        super.create();

        // Place player on node1 so they start on the first platform
        const startPlatform = this.platformList.get(1);
        if (startPlatform) {
            // Position player above the platform
            this.player.setPosition(startPlatform.x, startPlatform.y - 80);
            // Ensure platform is enabled and set as current
            if (startPlatform.body) startPlatform.body.enable = true;
            this.currentPlatform = startPlatform;
        }
    }

    protected buildPlatforms() {
        this.createPlatform(300, 300, 1);
        this.createPlatform(200, 450, 2);
        this.createPlatform(550, 200, 3);
        this.createPlatform(850, 350, 4);
        this.createPlatform(500, 550, 5);
        this.createPlatform(700, 650, 6);
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
            "Just like NEXT, you can also go backwards and go to the node before another.",
            "This is called PREV as in previous, another piece of our node.",
            "Want to use it? Try node2.prev=node1 as you solve this puzzle.",
            "Collect all the conveniently placed stars and make it to the last platform!",
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
            "Nice Work!",
            "This is how you traverse. I'll show up a little less now that you've got this down.",
            "Keep it up!",
        ];

        dialogue.setText(this.tutorialTexts[0]);
        this.tutorialBox = this.add.container(0, 0, [bg, portrait, dialogue]);
        this.input.keyboard!.on("keydown-SPACE", () => {
            this.advanceTutorial(dialogue);
        });
        this.input.on("pointerdown", () => {
            this.advanceTutorial(dialogue);
        });

        this.add.text(400, 230, "node1.next=node2", {
            fontSize: "25px",
            color: "#5a3604",
            fontFamily: "ChickinFont",
        });
        this.add.text(530, 320, "Use arrow keys to move", {
            fontSize: "25px",
            color: "#5a3604",
            fontFamily: "ChickinFont",
        });
    }
}