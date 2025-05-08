import Level from './Level.js';
import Trojan from './GameItem/Trojan.js';
import Level5 from './Level5.js';
import KeyListener from './KeyListener.js';
import CanvasRenderer from './CanvasRenderer.js';
import Player from './Player.js';
export default class Level4 extends Level {
    currentDialogue;
    keyListener;
    spawnInterval;
    constructor(canvas, health, score) {
        super(canvas, health, score);
        document.body.className = 'level4';
        this.maxX = 0.91 * this.canvas.width;
        this.maxY = 0.86 * this.canvas.height;
        this.minX = 0.05 * this.canvas.width;
        this.minY = 0.1 * this.canvas.height;
        this.currentLevel = 4;
        this.currentDialogue = 0;
        this.player = new Player();
        this.keyListener = new KeyListener();
        this.hasStarted = false;
        this.maxX = 0.91 * this.canvas.width - this.player.getWidth() / 2;
        this.maxY = 0.86 * this.canvas.height - this.player.getHeight() / 2;
        this.minX = 0.05 * this.canvas.width;
        this.minY = 0.1 * this.canvas.height;
    }
    nextLevel() {
        if (this.player.getPosX() > 0.9 * this.canvas.width - this.player.getWidth() / 2
            && this.player.getPosY() < 0.59 * this.canvas.height - this.player.getHeight() / 2
            && this.player.getPosY() > 0.4 * this.canvas.height - this.player.getHeight() / 2
            && this.score >= 1000 && this.gameItems.length === 0) {
            return new Level5(this.canvas, this.playerHealth, this.score);
        }
        return null;
    }
    render(canvas) {
        const dialogues = [
            '../assets/Dialogue-Level4/Level4-0.png',
            '../assets/Dialogue-Level4/Level4-1.png',
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
        if (this.score >= 1000 && this.gameItems.length === 0) {
            document.body.className = 'goNextLevel';
        }
    }
    spawnNextItem() {
        this.spawnInterval = setInterval(() => {
            if (this.score < 1000) {
                this.gameItems.push(new Trojan(this.canvas));
            }
            if (this.score >= 1000) {
                this.score = 1000;
            }
        }, 2000);
    }
}
//# sourceMappingURL=Level4.js.map