import { Level } from "./level";

export class Level1 extends Level {
    constructor() {
        super("Level1");
    }

    protected buildPlatforms(): void {
        this.createPlatform(200, 500, 1);
        this.createPlatform(450, 420, 2);
        this.createPlatform(700, 340, 3);
        this.createPlatform(950, 280, 4);
    }

    protected getTutorialText(): string[] {
        return [
            "Level 1: Node traversal basics.",
            "Use commands like node1->next=node2",
            "Connect nodes to create a path forward.",
            "Reach the final node to complete the level.",
        ];
    }

    protected getCompletionScene(): string {
        return "Level2";
    }

    protected getGoalPlatform(): number {
        return 4;
    }
}