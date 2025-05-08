import Game from './Game.js';
import CanvasRenderer from './CanvasRenderer.js';
import KeyListener from './KeyListener.js';
import Level0 from './Level0.js';
import Level from './Level.js';

export default class VirusVanguard extends Game {
  private canvas: HTMLCanvasElement;

  private currentLevel: Level;

  private keyListener: KeyListener;

  private playerHealth: number;

  /**
   * Create a new instance of the game.
   *
   * @param canvas HTML canvas where the game should be rendered
   */
  public constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.keyListener = new KeyListener();
    this.playerHealth = 100;
    this.currentLevel = new Level0(this.canvas, 100, 0);
  }

  /**
  /**
   * Process all input. Called from the GameLoop.
   */
  public processInput(): void {
    this.currentLevel.processInput(this.keyListener);
  }

  /**
   * Render all the elements in the screen. Called from GameLoop
   */
  public render(): void {
    CanvasRenderer.clearCanvas(this.canvas);
    this.currentLevel.render(this.canvas);
    if (this.currentLevel.restartGame() === true) {
      this.currentLevel = new Level0(this.canvas, 100, 0);
    }
  }

  /**
   * Update game state. Called from the GameLoop
   *
   * @param elapsed time elapsed from the GameLoop
   * @returns true if the game should continue
   */
  public update(elapsed: number): boolean {
    this.currentLevel.update(elapsed);
    this.playerHealth = this.currentLevel.getPlayerHealth();
    const newLevel: Level | null = this.currentLevel.nextLevel();
    if (newLevel !== null) {
      this.currentLevel = newLevel;
    }
    return true;
  }
}
