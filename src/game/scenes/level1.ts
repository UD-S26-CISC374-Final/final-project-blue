 import { Level } from "./level";
 
 export class Level1 extends Level {

    //BETA CHANGE - tutorial properties are inherited from Level

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
            "Why not try node1.next=node2 and see what happens?",
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