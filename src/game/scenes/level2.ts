import { Level } from "./level";

export class Level2 extends Level {
    constructor() {
        super("Level2");
    }

    protected buildPlatforms() {
        this.createPlatform(400, 300, 1);
        this.createPlatform(200, 450, 2);
        this.createPlatform(550, 200, 3);
        this.createPlatform(850, 350, 4);
        this.createPlatform(500, 550, 5);
        this.createPlatform(700, 650, 6);
    }

    protected getTutorialText() {
        return ["Now learn PREV.", "Try node2->prev=node1"];
    }

    protected getCompletionScene() {
        return "Level3";
    }

    protected getGoalPlatform() {
        return 6;
    }
}
