import Level from './Level.js';
import RVirus from './GameItem/RVirus.js';
import Level3 from './Level3.js';
import KeyListener from './KeyListener.js';
import CanvasRenderer from './CanvasRenderer.js';
import Player from './Player.js';

export default class Level2 extends Level {
  private currentDialogue: number;
  private keyListener: KeyListener;
  private spawnInterval: number | null = null;

  public constructor(canvas: HTMLCanvasElement, health: number, score: number){
    super(canvas, health, score);
    document.body.className = 'level2';
    this.currentLevel = 2;
    this.currentDialogue = 0;
    this.player = new Player();
    this.keyListener = new KeyListener();
    this.hasStarted = false;
    this.maxX = 0.91 * this.canvas.width - this.player.getWidth() / 2;
    this.maxY = 0.86 * this.canvas.height - this.player.getHeight() / 2;
    this.minX = 0.05 * this.canvas.width;
    this.minY = 0.1 * this.canvas.height;
  }

  /**
   *  @returns Level | null
   */
  public override nextLevel(): Level | null {
    if (this.player.getPosX() > 0.9 * this.canvas.width - this.player.getWidth() / 2
    && this.player.getPosY() < 0.59 * this.canvas.height - this.player.getHeight() / 2
    && this.player.getPosY() > 0.4 * this.canvas.height - this.player.getHeight() / 2
    && this.score >= 400 && this.gameItems.length === 0) {
      return new Level3(this.canvas, this.playerHealth, this.score);
    }
    return null;
  }

  /**
   * Renders the level on the canvas.
   * @param canvas - The HTML canvas element to render on.
   */
  public override render(canvas: HTMLCanvasElement): void {
    const dialogues: string[] = [
      '../assets/Dialogue-Level2/Level2-0.png',
      '../assets/Dialogue-Level2/Level2-1.png',
    ];

    if (this.keyListener.keyPressed(KeyListener.KEY_SPACE)) {
      this.currentDialogue += 1;
    }

    if (this.currentDialogue < dialogues.length) {
      const filepath: string = dialogues[this.currentDialogue];
      CanvasRenderer.drawImage(canvas,
        CanvasRenderer.loadNewImage(filepath),
        (this.canvas.width / 2) - 480, (this.canvas.height / 2) - 270);
    } else {
      // Start the level after the last dialogue
      super.render(canvas);
      if (!this.hasStarted) {
        this.startLevel();
        this.hasStarted = true;
      }
    }
    if (this.score >= 400 && this.gameItems.length === 0) {
      document.body.className = 'goNextLevel';
    }
  }

  /**
   * Spawns the next game item.
   */
  public override spawnNextItem(): void {
    this.spawnInterval = setInterval(() => {
      if (this.score < 400) {
        this.gameItems.push(new RVirus(this.canvas,
          Math.random() * this.canvas.width * 0.9, Math.random() * this.canvas.height * 0.86));
      } if (this.score >= 400) {
        this.score = 400;
      }
    }, 1000);
  }
}
