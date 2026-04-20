import { PhaserGame } from "./PhaserGame";

/**
 * React Component that wraps the Phaser game and provides UI controls
 * to interact with the game.
 *
 * You can add buttons to change scenes, move sprites, and add new sprites
 * to the game world.
 *
 * If you need to invoke scene-specific functions,
 * update the `ChangeableScene` interface in `reactable-scene.ts` and implement
 * them in the corresponding scenes. The `changeScene` method demonstrates
 * a method that would be available in all scenes, while `moveSprite` is
 * specific to the `MainMenu` scene.
 *
 * If you don't need Scene-specific interactions, you can just use the
 * scene directly as in `addSprite`.
 *
 * If you need to invoke a function when a scene becomes active, you can
 * use the `onCurrentActiveSceneChange` prop of the `PhaserGame` component.
 *
 * If you don't want any React UI, then you can just get rid of these functions
 * and the TSX that's not needed (i.e., just return the `<PhaserGame />` component).
 *
 * @returns
 */
function App() {
    return (
        <div id="app">
            <div id="game-container"></div>
            <PhaserGame />
        </div>
    );
}

export default App;
