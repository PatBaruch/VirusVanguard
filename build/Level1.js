import Level from './Level.js';
import FEmail from './GameItem/FEmail.js';
import Level2 from './Level2.js';
import KeyListener from './KeyListener.js';
import CanvasRenderer from './CanvasRenderer.js';
import Player from './Player.js';
import { LEVEL_LAYOUTS } from './config/LevelConfig.js';
import GameConfig from './config/GameConfig.js';
export default class Level1 extends Level {
    currentDialogue;
    keyListener;
    spawnInterval = null;
    constructor(canvas, health, score) {
        super(canvas, health, score);
        document.body.className = 'level1';
        this.currentLevel = 1;
        this.currentDialogue = 0;
        this.player = new Player();
        this.keyListener = new KeyListener();
        this.hasStarted = false;
        this.applyLayout(LEVEL_LAYOUTS[1]);
    }
    nextLevel() {
        if (this.isPlayerInExitGate() && this.score >= LEVEL_LAYOUTS[1].scoreGate && this.gameItems.length === 0) {
            return new Level2(this.canvas, this.playerHealth, this.score);
        }
        return null;
    }
    render(canvas) {
        const dialogues = [
            '../assets/Dialogue-Level1/Level1-0.png',
            '../assets/Dialogue-Level1/Level1-1.png',
        ];
        if (this.keyListener.keyPressed(KeyListener.KEY_SPACE)) {
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
        if (this.score >= LEVEL_LAYOUTS[1].scoreGate && this.gameItems.length === 0) {
            document.body.className = 'goNextLevel';
        }
    }
    spawnNextItem() {
        this.spawnInterval = setInterval(() => {
            if (this.score < LEVEL_LAYOUTS[1].scoreGate) {
                this.gameItems.push(new FEmail(this.canvas, Math.random() * this.canvas.width * 0.9, Math.random() * this.canvas.height * 0.86));
            }
            if (this.score >= LEVEL_LAYOUTS[1].scoreGate) {
                this.score = LEVEL_LAYOUTS[1].scoreGate;
            }
        }, LEVEL_LAYOUTS[1].spawnIntervalMs);
    }
}
//# sourceMappingURL=Level1.js.map