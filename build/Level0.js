import CanvasRenderer from './CanvasRenderer.js';
import Level from './Level.js';
import Level1 from './Level1.js';
import KeyListener from './KeyListener.js';
import Player from './Player.js';
import { LEVEL_LAYOUTS } from './config/LevelConfig.js';
import GameConfig from './config/GameConfig.js';
export default class Level0 extends Level {
    currentDialogue;
    startScreenSkipped = false;
    constructor(canvas, helth, score) {
        super(canvas, helth, score);
        document.body.className = 'startScreen';
        this.currentLevel = 0;
        this.currentDialogue = 0;
        this.player = new Player();
        this.hasStarted = false;
        this.applyLayout(LEVEL_LAYOUTS[0]);
    }
    nextLevel() {
        if (this.isPlayerInExitGate()) {
            return new Level1(this.canvas, this.playerHealth, this.score);
        }
        return null;
    }
    render(canvas) {
        const dialogues = [
            '../assets/Dialogue-Level0/Level0-0.png',
            '../assets/Dialogue-Level0/Level0-1.png',
            '../assets/Dialogue-Level0/Level0-2.png',
            '../assets/Dialogue-Level0/Level0-3.png',
            '../assets/Dialogue-Level0/Level0-4.png',
            '../assets/Dialogue-Level0/Level0-5.png',
            '../assets/Dialogue-Level0/Level0-6.png',
        ];
        if (this.inputKeyListener !== null && this.inputKeyListener.keyPressed(KeyListener.KEY_SPACE)) {
            this.startScreenSkipped = true;
            if (this.startScreenSkipped) {
                this.currentDialogue += 1;
            }
        }
        if (this.startScreenSkipped === false) {
            document.body.className = 'startScreen';
            CanvasRenderer.writeText(canvas, 'Press space to start the game', canvas.width / 2, canvas.height / 2 + 200, 'center', 'Copperplate', 50, 'red');
        }
        else {
            document.body.className = 'level0';
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
        }
    }
    spawnNextItem() {
    }
}
//# sourceMappingURL=Level0.js.map