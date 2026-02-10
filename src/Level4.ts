import Level from './Level.js';
import Trojan from './GameItem/Trojan.js';
import Level5 from './Level5.js';
import KeyListener from './KeyListener.js';
import CanvasRenderer from './CanvasRenderer.js';
import Player from './Player.js';
import { LEVEL_LAYOUTS } from './config/LevelConfig.js';
import GameConfig from './config/GameConfig.js';

export default class Level4 extends Level {
  private currentDialogue: number;

  private spawnInterval: number;

  public constructor(canvas: HTMLCanvasElement, health: number, score: number){
    super(canvas, health, score);
    document.body.className = 'level4';
    this.currentLevel = 4;
    this.currentDialogue = 0;
    this.player = new Player();
    this.hasStarted = false;
    this.applyLayout(LEVEL_LAYOUTS[4]);
  }

  public override onExit(): void {
    clearInterval(this.spawnInterval);
  }

  /**
   *  @returns Level | null
   */
  public override nextLevel(): Level | null {
    if (this.isPlayerInExitGate() && this.score >= LEVEL_LAYOUTS[4].scoreGate && this.gameItems.length === 0) {
      return new Level5(this.canvas, this.playerHealth, this.score);
    }
    return null;
  }

  /**
   * Renders the Level3 on the canvas.
   * @param canvas - The HTML canvas element.
   */
  public override render(canvas: HTMLCanvasElement): void {
    const dialogues: string[] = [
      '../assets/Dialogue-Level4/Level4-0.png',
      '../assets/Dialogue-Level4/Level4-1.png',
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
    if (this.score >= LEVEL_LAYOUTS[4].scoreGate && this.gameItems.length === 0) {
      document.body.className = 'goNextLevel';
    }
  }

  /**
   * Spawns the next game item.
   */
  public override spawnNextItem(): void {
    this.spawnInterval = setInterval(() => {
      if (this.score < LEVEL_LAYOUTS[4].scoreGate) {
        this.gameItems.push(new Trojan(this.canvas));
      } if (this.score >= LEVEL_LAYOUTS[4].scoreGate) {
        this.score = LEVEL_LAYOUTS[4].scoreGate;
      }
    }, LEVEL_LAYOUTS[4].spawnIntervalMs);
  }
}
