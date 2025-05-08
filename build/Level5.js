import Level from './Level.js';
import MrHacker from './GameItem/MrHacker.js';
import KeyListener from './KeyListener.js';
import CanvasRenderer from './CanvasRenderer.js';
import Player from './Player.js';
export default class Level5 extends Level {
    currentDialogue;
    keyListener;
    spawnInterval = null;
    constructor(canvas, health, score) {
        super(canvas, health, score);
        document.body.className = 'level5';
        this.currentLevel = 5;
        this.currentDialogue = 0;
        this.player = new Player();
        this.keyListener = new KeyListener();
        this.hasStarted = false;
        this.maxX = 0.91 * this.canvas.width - this.player.getWidth() / 2;
        this.maxY = 0.86 * this.canvas.height - this.player.getHeight() / 2;
        this.minX = 0.05 * this.canvas.width;
        this.minY = 0.1 * this.canvas.height;
    }
    isGameWon() {
        return this.ifWin;
    }
    nextLevel() {
        if (this.player.getPosX() > 0.89 * this.canvas.width - this.player.getWidth() / 2
            && this.player.getPosY() < 0.59 * this.canvas.height - this.player.getHeight() / 2
            && this.player.getPosY() > 0.4 * this.canvas.height - this.player.getHeight() / 2
            && this.score >= 0 && this.gameItems.length === 0) {
            this.ifWin = true;
        }
        return null;
    }
    render(canvas) {
        if (this.score >= 1010 && this.gameItems.length === 0) {
            document.body.className = 'goNextLevel';
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
            if (this.keyListener.keyPressed(KeyListener.KEY_SPACE)) {
                this.currentDialogue += 1;
            }
            if (this.currentDialogue < dialogues.length) {
                const filepath = dialogues[this.currentDialogue];
                CanvasRenderer.drawImage(canvas, CanvasRenderer.loadNewImage(filepath), (this.canvas.width / 2) - 480, (this.canvas.height / 2) - 270);
            }
            else {
                super.render(canvas);
                if (!this.hasStarted) {
                    this.startLevel();
                    this.hasStarted = true;
                }
            }
        }
        if (this.score >= 1200 && this.gameItems.length === 0) {
            document.body.className = 'victory';
        }
    }
    spawnNextItem() {
        this.gameItems.push(new MrHacker(this.canvas));
    }
}
//# sourceMappingURL=Level5.js.map