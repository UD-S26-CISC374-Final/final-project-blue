import { GameObjects, Scene } from "phaser";
import type { ChangeableScene } from "../reactable-scene";

export class StoryboardStart extends Scene implements ChangeableScene {
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    storySteps: { image: string; text: string }[] = [];
    storyText!: GameObjects.Text;
    background!: GameObjects.Image;
    textbox!: GameObjects.Graphics;
    currentStep: number = 0;
    typingEvent?: Phaser.Time.TimerEvent;

    constructor() {
        super("StoryboardStart");
    }
    typeText(text: string) {
        if (this.typingEvent) {
            this.typingEvent.remove(false);
            this.typingEvent = undefined;
        }

        this.storyText.setText("");
        let i = 0;

        this.typingEvent = this.time.addEvent({
            delay: 40,
            repeat: text.length - 1,
            callback: () => {
                this.storyText.setText(this.storyText.text + text[i]);
                i++;

                if (i >= text.length) {
                    this.typingEvent = undefined;
                }
            },
        });
    }

    nextStep() {
        if (this.typingEvent) {
            this.typingEvent.remove(false);
            this.typingEvent = undefined;
            this.storyText.setText(this.storySteps[this.currentStep].text);
            return;
        }

        this.currentStep++;

        if (this.currentStep >= this.storySteps.length) {
            // Go to game
            this.scene.start("Level1");
            return;
        }

        const step = this.storySteps[this.currentStep];

        // Change image
        this.background.setTexture(step.image);

        // Type next line
        this.typeText(step.text);
    }

    preload() {
        this.load.image("scene1", "assets/lcmainmenu.png");
        this.load.image("scene2", "assets/scene2.png");
        this.load.image("scene3", "assets/scene3.png");
        this.load.image("scene4", "assets/scene2.png");
        this.load.image("scene5", "assets/scene3.png");
        this.load.image("scene6", "assets/scene2.png");
        this.load.image("scene7", "assets/scene3.png");
    }

    create() {
        this.storySteps = [
            {
                image: "scene1",
                text: "Once upon a time, in a barn far, far away, there lived a chicken named Mama.",
            },
            {
                image: "scene1",
                text: "Mama was a great mama. She took care of many babies over the years.",
            },
            {
                image: "scene2",
                text: "But this time was special. She was especially anxious because one egg of hers just wouldn't hatch.",
            },
            {
                image: "scene2",
                text: "Finally, her baby hatched, but to her surprise...",
            },
            {
                image: "scene3",
                text: "Her baby was blue!",
            },
            {
                image: "scene3",
                text: "Mama was scared and concerned. I would be too, if my baby was blue.",
            },
            {
                image: "scene4",
                text: "Mama loved Baby Blue like any of her other chicks. But some coopmates weren't very kind to him.",
            },
            {
                image: "scene4",
                text: '"Go away you blue FREAK!" they would say. But Mama always taught Baby Blue to be brave, strong and kind.',
            },
            {
                image: "scene5",
                text: "But one day, Mama was gone! Blue frantically looked around the coop for his mama.",
            },
            {
                image: "scene5",
                text: "\"Mama is gone, just like every other grown hen.\" said the coopmates. \"They're gonna turn her into tenders. It's not long before it's your turn! We can't change this fate.\"",
            },
            {
                image: "scene6",
                text: "All of a sudden...",
            },
            {
                image: "scene7",
                text: '"REMEMBER WHO YOU ARE, LITTLE HATCHLING!!! YOUR MAMA IS COUNTING ON YOU!"',
            },
            {
                image: "scene7",
                text: '"DON\'T LET THEM TELL YOU WHO YOU ARE!" (Seriously, who even is this guy?)',
            },
            {
                image: "scene8",
                text: "With his newfound ancestral power, Baby Blue knew what to do. He put on his bravest face and set out on a journey to find his mama.",
            },
            {
                image: "scene7",
                text: "Wherever she was, he knew she was counting on him!",
            },
        ];

        this.currentStep = 0;

        // Background image
        this.background = this.add
            .image(0, 0, this.storySteps[0].image)
            .setOrigin(0);

        // Textbox UI
        const textboxWidth = 840;
        const textboxHeight = 180;
        const textboxX = (this.scale.width - textboxWidth) / 2;
        const textboxY = this.scale.height - textboxHeight - 40;

        this.textbox = this.add.graphics();
        this.textbox.fillStyle(0x000000, 0.85);
        this.textbox.fillRect(textboxX, textboxY, textboxWidth, textboxHeight);
        this.textbox.lineStyle(4, 0xffffff, 1);
        this.textbox.strokeRect(
            textboxX,
            textboxY,
            textboxWidth,
            textboxHeight,
        );

        // Text object
        this.storyText = this.add.text(textboxX + 24, textboxY + 24, "", {
            fontSize: "20px",
            color: "#ffffff",
            wordWrap: { width: textboxWidth - 48 },
        });

        // Start typewriter effect for first scene
        this.typeText(this.storySteps[this.currentStep].text);

        // Listen for space bar to advance
        this.input.keyboard!.on("keydown-SPACE", () => {
            this.nextStep();
        });
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }
        this.scale.startFullscreen();
        this.scene.start("Level1");
    }
}
