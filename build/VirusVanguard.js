import Game from './Game.js';
import CanvasRenderer from './CanvasRenderer.js';
import KeyListener from './KeyListener.js';
import Level0 from './Level0.js';
export default class VirusVanguard extends Game {
    canvas;
    currentLevel;
    keyListener;
    playerHealth;
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.keyListener = new KeyListener();
        this.playerHealth = 100;
        this.currentLevel = new Level0(this.canvas, 100, 0);
    }
    processInput() {
        this.currentLevel.processInput(this.keyListener);
    }
    render() {
        CanvasRenderer.clearCanvas(this.canvas);
        this.currentLevel.render(this.canvas);
        if (this.currentLevel.restartGame() === true) {
            this.currentLevel = new Level0(this.canvas, 100, 0);
        }
    }
    update(elapsed) {
        this.currentLevel.update(elapsed);
        this.playerHealth = this.currentLevel.getPlayerHealth();
        const newLevel = this.currentLevel.nextLevel();
        if (newLevel !== null) {
            this.currentLevel = newLevel;
        }
        return true;
    }
}
//# sourceMappingURL=VirusVanguard.js.map