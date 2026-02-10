import Level from './Level.js';
import MrHacker from './GameItem/MrHacker.js';
import KeyListener from './KeyListener.js';
import CanvasRenderer from './CanvasRenderer.js';
import Player from './Player.js';
import { LEVEL_LAYOUTS } from './config/LevelConfig.js';
import GameConfig from './config/GameConfig.js';
import RunManager from './core/RunManager.js';
export default class Level5 extends Level {
    currentDialogue;
    spawnInterval = null;
    endlessWave = 1;
    constructor(canvas, health, score) {
        super(canvas, health, score);
        document.body.className = 'level5';
        this.currentLevel = 5;
        this.currentDialogue = 0;
        this.player = new Player();
        this.hasStarted = false;
        this.applyLayout(LEVEL_LAYOUTS[5]);
    }
    onExit() {
        if (this.spawnInterval !== null) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
    }
    isGameWon() {
        return this.ifWin;
    }
    nextLevel() {
        if (RunManager.getRunState().mode === 'endless') {
            return null;
        }
        if (this.isPlayerInExitGate()
            && this.score >= 0 && this.gameItems.length === 0) {
            this.ifWin = true;
        }
        return null;
    }
    render(canvas) {
        if (this.score >= 1010 && this.gameItems.length === 0 && RunManager.getRunState().mode !== 'endless') {
            document.body.className = 'goNextLevel';
        }
        if (RunManager.getRunState().mode === 'endless') {
            CanvasRenderer.writeText(canvas, `Endless Wave: ${this.endlessWave}`, 50, 260, 'left', 'Copperplate', 40, 'orange');
        }
        if (this.ifWin) {
            document.body.className = 'victory';
            CanvasRenderer.writeText(canvas, `Score: ${this.score}`, canvas.width / 2, canvas.height / 2 + 0, 'center', 'Copperplate', 50, 'Chartreuse');
            CanvasRenderer.writeText(canvas, `Score Multiplier: ${this.multiplier.toFixed(2)}`, canvas.width / 2, canvas.height / 2 + 100, 'center', 'Copperplate', 50, 'Chartreuse');
            CanvasRenderer.writeText(canvas, `Final Score: ${(this.score * this.multiplier).toFixed(0)} `, canvas.width / 2, canvas.height / 2 + 200, 'center', 'Copperplate', 50, 'Chartreuse');
            CanvasRenderer.writeText(canvas, 'Press Space to Restart', canvas.width / 2, canvas.height / 2 + 300, 'center', 'Copperplate', 50, 'Chartreuse');
        }
        else {
            const dialogues = [
                '../assets/Dialogue-Level5/Level5-0.png',
                '../assets/Dialogue-Level5/Level5-1.png',
                '../assets/Dialogue-Level5/Level5-2.png',
            ];
            if (this.inputKeyListener !== null && this.inputKeyListener.keyPressed(KeyListener.KEY_SPACE)) {
                this.currentDialogue += 1;
            }
            if (this.currentDialogue < dialogues.length) {
                const filepath = dialogues[this.currentDialogue];
                CanvasRenderer.drawImage(canvas, CanvasRenderer.loadNewImage(filepath), (this.canvas.width / 2) - GameConfig.DIALOGUE_OFFSET_X, (this.canvas.height / 2) - GameConfig.DIALOGUE_OFFSET_Y);
            }
            else {
                super.render(canvas);
                if (!this.hasStarted) {
                    this.startLevel();
                    this.hasStarted = true;
                }
                else if (RunManager.getRunState().mode === 'endless' && this.gameItems.length === 0) {
                    this.endlessWave += 1;
                    this.score += 100;
                    this.spawnNextItem();
                }
            }
        }
        if (this.score >= 1200 && this.gameItems.length === 0 && RunManager.getRunState().mode !== 'endless') {
            document.body.className = 'victory';
        }
    }
    spawnNextItem() {
        this.gameItems.push(new MrHacker(this.canvas));
    }
}
//# sourceMappingURL=Level5.js.map