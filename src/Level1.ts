import Level from './Level.js';
import FEmail from './GameItem/FEmail.js';
import Level2 from './Level2.js';
import KeyListener from './KeyListener.js';
import CanvasRenderer from './CanvasRenderer.js';
import Player from './Player.js';
import { LEVEL_LAYOUTS } from './config/LevelConfig.js';
import GameConfig from './config/GameConfig.js';

export default class Level1 extends Level {
  private currentDialogue: number;

  private spawnTimeout: number | null = null;

  public constructor(canvas: HTMLCanvasElement, health: number, score: number,) {
    super(canvas, health, score);
    document.body.className = 'level1';
    this.currentLevel = 1;
    this.currentDialogue = 0;
    this.player = new Player();
    this.hasStarted = false;
    this.applyLayout(LEVEL_LAYOUTS[1]);
  }

  public override onExit(): void {
    if (this.spawnTimeout !== null) {
      clearTimeout(this.spawnTimeout);
      this.spawnTimeout = null;
    }
  }

  /**
   *  @returns Level | null
   */
  public override nextLevel(): Level | null {
    if (this.isPlayerInExitGate() && this.score >= LEVEL_LAYOUTS[1].scoreGate && this.gameItems.length === 0) {
      return new Level2(this.canvas, this.playerHealth, this.score);
    }
    return null;
  }

  /**
   * Renders the level on the canvas.
   * @param canvas - The HTML canvas element to render on.
   */
  public override render(canvas: HTMLCanvasElement): void {
    const dialogues: string[] = [
      '../assets/Dialogue-Level1/Level1-0.png',
      '../assets/Dialogue-Level1/Level1-1.png',
    ];

    if (this.inputKeyListener !== null && this.inputKeyListener.keyPressed(KeyListener.KEY_SPACE)) {
      this.currentDialogue += 1;
    }

    if (this.currentDialogue < dialogues.length) {
      const filepath: string = dialogues[this.currentDialogue];
      CanvasRenderer.drawImage(canvas,
        CanvasRenderer.loadNewImage(filepath),
        (this.canvas.width / 2) - GameConfig.DIALOGUE_OFFSET_X,
        (this.canvas.height / 2) - GameConfig.DIALOGUE_OFFSET_Y);
    } else {
      // Start the level after the last dialogue
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

  /**
   * Spawns the next game item.
   */
  public override spawnNextItem(): void {
    const spawnTick = (): void => {
      if (this.score < LEVEL_LAYOUTS[1].scoreGate) {
        this.gameItems.push(new FEmail(this.canvas,
          Math.random() * this.canvas.width * 0.9, Math.random() * this.canvas.height * 0.86));
      } else {
        this.score = LEVEL_LAYOUTS[1].scoreGate;
      }

      const progress: number = Math.min(1, this.score / LEVEL_LAYOUTS[1].scoreGate);
      const nextInterval: number = Math.round(LEVEL_LAYOUTS[1].spawnIntervalMs * (1 - progress * 0.25));
      this.spawnTimeout = window.setTimeout(spawnTick, Math.max(300, nextInterval));
    };

    this.spawnTimeout = window.setTimeout(spawnTick, LEVEL_LAYOUTS[1].spawnIntervalMs);
  }
}
