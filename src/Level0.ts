import CanvasRenderer from './CanvasRenderer.js';
import Level from './Level.js';
import Level1 from './Level1.js';
import KeyListener from './KeyListener.js';
import Player from './Player.js';

export default class Level0 extends Level {
  private currentDialogue: number;

  private keyListener: KeyListener;

  private startScreenSkipped: boolean = false;

  public constructor(canvas: HTMLCanvasElement, helth: number, score: number){
    super(canvas, helth, score);
    document.body.className = 'startScreen';
    this.keyListener = new KeyListener();
    this.currentLevel = 0;
    this.currentDialogue = 0;
    this.player = new Player();
    this.hasStarted = false;
    this.maxX = 0.73 * this.canvas.width - this.player.getWidth() / 2;
    this.maxY = 0.7 * this.canvas.height - this.player.getHeight() / 2;
    this.minX = 0.05 * this.canvas.width;
    this.minY = 0.22 * this.canvas.height;
  }

  /**
   *  @returns Level | null
   */
  public override nextLevel(): Level | null {
    if (this.player.getPosX() > 0.72 * this.canvas.width - this.player.getWidth() / 2
    && this.player.getPosY() < 0.59 * this.canvas.height - this.player.getHeight() / 2
    && this.player.getPosY() > 0.4 * this.canvas.height - this.player.getHeight() / 2) {
      return new Level1(this.canvas, this.playerHealth, this.score,);
    }
    return null;
  }

  /**
   * Renders the Level0 on the canvas.
   * @param canvas - The HTML canvas element.
   */
  public override render(canvas: HTMLCanvasElement): void {
    const dialogues: string[] = [
      '../assets/Dialogue-Level0/Level0-0.png',
      '../assets/Dialogue-Level0/Level0-1.png',
      '../assets/Dialogue-Level0/Level0-2.png',
      '../assets/Dialogue-Level0/Level0-3.png',
      '../assets/Dialogue-Level0/Level0-4.png',
      '../assets/Dialogue-Level0/Level0-5.png',
      '../assets/Dialogue-Level0/Level0-6.png',
    ];

    if (this.keyListener.keyPressed(KeyListener.KEY_SPACE)) {
      this.startScreenSkipped = true;
      if (this.startScreenSkipped) {
        this.currentDialogue += 1;
      }
    }
    if (this.startScreenSkipped === false) {
      document.body.className = 'startScreen';
      CanvasRenderer.writeText(canvas, 'Press space to start the game', canvas.width / 2, canvas.height / 2 + 200, 'center', 'Copperplate', 50, 'red');
    } else {
      document.body.className = 'level0';
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
    }
  }

  /**
   *
   */
  public override spawnNextItem(): void {
  }
}
