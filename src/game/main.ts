import { Boot } from "./scenes/boot";
import { GameOver } from "./scenes/game-over";
import { Level1 as MainGame } from "./scenes/level1";
import { Level2 } from "./scenes/level2";
import { Level3 } from "./scenes/level3";
import { Level4 } from "./scenes/level4";
import { Level5 } from "./scenes/level5";
import { Level6 } from "./scenes/level6";
import { Level10 } from "./scenes/level10";
import { Level11 } from "./scenes/level11";
import { MainMenu } from "./scenes/main-menu";
import { StoryboardStart } from "./scenes/storyboard-start";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/preloader";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    title: "My Untitled CISC374 Game",
    version: "0.0.1",
    type: AUTO,
    parent: "game-container",
    backgroundColor: "#ffffff",
    scene: [
        Boot,
        Preloader,
        StoryboardStart,
        MainMenu,
        MainGame,
        Level2,
        Level3,
        Level4,
        Level5,
        Level6,
        Level10,
        Level11,
        GameOver,
    ],
    scale: {
        parent: "phaser-game",
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1024,
        height: 768,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { x: 0, y: 300 },
        },
    },
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: false,
    },
    render: {
        pixelArt: false,
        antialias: true,
    },
    dom: {
        createContainer: true,
    },
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
