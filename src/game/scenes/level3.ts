import { Level } from "./level";

export class Level3 extends Level {
    constructor() {
        super("Level3");
    }

    protected setupLevel(): void {
        // Level 3 specific setup goes here

        this.createPlatform(this.spawnx + 300, this.spawny + 150, 1);
        this.createPlatform(this.spawnx + 100, this.spawny + 300, 2);
        this.createPlatform(this.spawnx + 550, this.spawny + 50, 3);
        this.createPlatform(this.spawnx + 840, this.spawny + 200, 4);
        this.createPlatform(this.spawnx + 450, this.spawny + 350, 5);
        this.createPlatform(this.spawnx + 650, this.spawny + 550, 6);

        this.createItemOnPlatform(2, "key");
        this.createItemOnPlatform(3, "key");
        this.createItemOnPlatform(4, "key");

        this.createFinishSlab(6);

        // locked / forbidden connections
        this.forbiddenConnections.add("1:next:5");

        const node5 = this.platformList.get(5);
        const node2 = this.platformList.get(2);
        const node6 = this.platformList.get(6);
        const node4 = this.platformList.get(4);

        if (node6 && node4) {
            node6.setData("next", 4);
            node4.setData("next", 6);

            this.aliasMap.set(6, 4);
            this.aliasMap.set(4, 6);

            this.lockedConnections.add("6:next");
            this.lockedConnections.add("4:next");
        }

        if (node5) {
            node5.setData("prev", 2);
            this.aliasMap.set(5, 2);
            this.lockedConnections.add("5:prev");
        }

        if (node2) {
            node2.setData("next", 1);
        }
    }

    protected startLevelTutorial(): void {
        this.startTutorial();
    }
}
