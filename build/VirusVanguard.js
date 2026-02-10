import Game from './Game.js';
import CanvasRenderer from './CanvasRenderer.js';
import KeyListener from './KeyListener.js';
import Level0 from './Level0.js';
import GameConfig from './config/GameConfig.js';
import Viewport from './core/Viewport.js';
export default class VirusVanguard extends Game {
    canvas;
    currentLevel;
    keyListener;
    playerHealth;
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.canvas.height = GameConfig.VIRTUAL_HEIGHT;
        this.canvas.width = GameConfig.VIRTUAL_WIDTH;
        this.updateViewport();
        window.addEventListener('resize', () => {
            this.updateViewport();
        });
        this.keyListener = new KeyListener();
        this.playerHealth = 100;
        this.currentLevel = new Level0(this.canvas, 100, 0);
        this.currentLevel.onEnter();
    }
    updateViewport() {
        const viewport = Viewport.calculate(window.innerWidth, window.innerHeight, GameConfig.VIRTUAL_WIDTH, GameConfig.VIRTUAL_HEIGHT);
        this.canvas.style.width = `${viewport.renderWidth}px`;
        this.canvas.style.height = `${viewport.renderHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${viewport.offsetX}px`;
        this.canvas.style.top = `${viewport.offsetY}px`;
    }
    processInput() {
        this.currentLevel.processInput(this.keyListener);
    }
    render() {
        CanvasRenderer.clearCanvas(this.canvas);
        this.currentLevel.render(this.canvas);
        if (this.currentLevel.restartGame() === true) {
            this.currentLevel.onExit();
            this.currentLevel = new Level0(this.canvas, 100, 0);
            this.currentLevel.onEnter();
        }
    }
    update(elapsed) {
        this.currentLevel.update(elapsed);
        this.playerHealth = this.currentLevel.getPlayerHealth();
        const newLevel = this.currentLevel.nextLevel();
        if (newLevel !== null) {
            this.currentLevel.onExit();
            this.currentLevel = newLevel;
            this.currentLevel.onEnter();
        }
        return true;
    }
}
//# sourceMappingURL=VirusVanguard.js.map