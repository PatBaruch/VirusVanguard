import Level from './Level.js';
import Worm from './GameItem/Worm.js';
import Level4 from './Level4.js';
import KeyListener from './KeyListener.js';
import CanvasRenderer from './CanvasRenderer.js';
import Player from './Player.js';
import { LEVEL_LAYOUTS } from './config/LevelConfig.js';
import GameConfig from './config/GameConfig.js';
import RunManager from './core/RunManager.js';
export default class Level3 extends Level {
    currentDialogue;
    spawnTimeout = null;
    constructor(canvas, health, score) {
        super(canvas, health, score);
        document.body.className = 'level3';
        this.currentLevel = 3;
        this.currentDialogue = 0;
        this.player = new Player();
        this.hasStarted = false;
        this.applyLayout(LEVEL_LAYOUTS[3]);
    }
    onExit() {
        if (this.spawnTimeout !== null) {
            clearTimeout(this.spawnTimeout);
            this.spawnTimeout = null;
        }
    }
    nextLevel() {
        if (this.isPlayerInExitGate() && this.score >= LEVEL_LAYOUTS[3].scoreGate && this.gameItems.length === 0) {
            return new Level4(this.canvas, this.playerHealth, this.score);
        }
        return null;
    }
    render(canvas) {
        super.render(canvas);
        const dialogues = [
            './assets/Dialogue-Level3/Level3-0.png',
            './assets/Dialogue-Level3/Level3-1.png',
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
        }
        if (this.score >= LEVEL_LAYOUTS[3].scoreGate && this.gameItems.length === 0) {
            document.body.className = 'goNextLevel';
        }
    }
    spawnNextItem() {
        const spawnTick = () => {
            if (this.score < LEVEL_LAYOUTS[3].scoreGate) {
                this.gameItems.push(new Worm(this.canvas, this.canvas.width * 0.45 + Math.random() * (this.canvas.width * 0.45), Math.random() * this.canvas.height * 0.86));
            }
            else {
                this.score = LEVEL_LAYOUTS[3].scoreGate;
            }
            const progress = Math.min(1, this.score / LEVEL_LAYOUTS[3].scoreGate);
            const nextInterval = Math.round(LEVEL_LAYOUTS[3].spawnIntervalMs * (1 - progress * 0.3));
            this.spawnTimeout = window.setTimeout(spawnTick, Math.max(250, Math.round(nextInterval * RunManager.getSpawnRateMultiplier())));
        };
        this.spawnTimeout = window.setTimeout(spawnTick, LEVEL_LAYOUTS[3].spawnIntervalMs);
    }
}
//# sourceMappingURL=Level3.js.map