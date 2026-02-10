import Game from './Game.js';
import CanvasRenderer from './CanvasRenderer.js';
import KeyListener from './KeyListener.js';
import Level0 from './Level0.js';
import Level from './Level.js';
import Level1 from './Level1.js';
import GameConfig from './config/GameConfig.js';
import Viewport from './core/Viewport.js';
import RunManager from './core/RunManager.js';
import Persistence, { type PersistedStats } from './core/Persistence.js';

export default class VirusVanguard extends Game {
  private canvas: HTMLCanvasElement;

  private currentLevel: Level;

  private keyListener: KeyListener;

  private playerHealth: number;

  private transitionFadeTimer: number = 0;

  private persistedStats: PersistedStats;

  private scoreAttackRemainingMs: number = 0;

  private scoreAttackFinished: boolean = false;

  /**
   * Create a new instance of the game.
   *
   * @param canvas HTML canvas where the game should be rendered
   */
  public constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.canvas.height = GameConfig.VIRTUAL_HEIGHT;
    this.canvas.width = GameConfig.VIRTUAL_WIDTH;
    RunManager.initializeFromUrl();
    RunManager.applySeededRandom();

    this.updateViewport();
    window.addEventListener('resize', () => {
      this.updateViewport();
    });
    this.keyListener = new KeyListener();
    this.playerHealth = 100;
    this.persistedStats = Persistence.loadStats();

    const runState = RunManager.getRunState();
    this.scoreAttackRemainingMs = runState.scoreAttackTimeMs;

    if (runState.mode === 'score-attack' || runState.mode === 'endless') {
      this.currentLevel = new Level1(this.canvas, 100, 0);
    } else {
      this.currentLevel = new Level0(this.canvas, 100, 0);
    }

    this.currentLevel.onEnter();
  }

  private updateViewport(): void {
    const viewport = Viewport.calculate(
      window.innerWidth,
      window.innerHeight,
      GameConfig.VIRTUAL_WIDTH,
      GameConfig.VIRTUAL_HEIGHT,
    );

    this.canvas.style.width = `${viewport.renderWidth}px`;
    this.canvas.style.height = `${viewport.renderHeight}px`;
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = `${viewport.offsetX}px`;
    this.canvas.style.top = `${viewport.offsetY}px`;
  }

  /**
  /**
   * Process all input. Called from the GameLoop.
   */
  public processInput(): void {
    if (this.scoreAttackFinished) {
      return;
    }

    this.currentLevel.processInput(this.keyListener);
  }

  /**
   * Render all the elements in the screen. Called from GameLoop
   */
  public render(): void {
    CanvasRenderer.clearCanvas(this.canvas);
    this.currentLevel.render(this.canvas);
    const runState = RunManager.getRunState();
    if (runState.mode === 'score-attack') {
      CanvasRenderer.writeText(
        this.canvas,
        `Score Attack ${(this.scoreAttackRemainingMs / 1000).toFixed(1)}s`,
        this.canvas.width - 20,
        50,
        'right',
        'Copperplate',
        36,
        'orange',
      );
    }

    CanvasRenderer.writeText(
      this.canvas,
      `Best: ${this.persistedStats.bestFinalScore}`,
      this.canvas.width - 20,
      95,
      'right',
      'Copperplate',
      28,
      'white',
    );

    CanvasRenderer.writeText(
      this.canvas,
      `Medals: ${this.persistedStats.unlockedMedals.length}`,
      this.canvas.width - 20,
      130,
      'right',
      'Copperplate',
      24,
      'Chartreuse',
    );

    if (this.scoreAttackFinished) {
      CanvasRenderer.writeText(
        this.canvas,
        'Score Attack Complete',
        this.canvas.width / 2,
        this.canvas.height / 2,
        'center',
        'Copperplate',
        70,
        'Gold',
      );
    }

    if (this.transitionFadeTimer > 0) {
      const alpha: number = this.transitionFadeTimer / GameConfig.TRANSITION_FADE_DURATION_MS;
      CanvasRenderer.fillRectangle(this.canvas, 0, 0, this.canvas.width, this.canvas.height, `rgba(0, 0, 0, ${alpha})`);
    }
    if (this.currentLevel.restartGame() === true) {
      this.currentLevel.onExit();
      this.currentLevel = new Level0(this.canvas, 100, 0);
      this.currentLevel.onEnter();
      this.transitionFadeTimer = GameConfig.TRANSITION_FADE_DURATION_MS;
    }
  }

  /**
   * Update game state. Called from the GameLoop
   *
   * @param elapsed time elapsed from the GameLoop
   * @returns true if the game should continue
   */
  public update(elapsed: number): boolean {
    if (this.scoreAttackFinished) {
      return true;
    }

    this.currentLevel.update(elapsed);
    this.transitionFadeTimer = Math.max(0, this.transitionFadeTimer - elapsed);
    const runState = RunManager.getRunState();
    if (runState.mode === 'score-attack') {
      this.scoreAttackRemainingMs = Math.max(0, this.scoreAttackRemainingMs - elapsed);
      if (this.scoreAttackRemainingMs <= 0) {
        this.scoreAttackFinished = true;
      }
    }

    this.playerHealth = this.currentLevel.getPlayerHealth();
    const newLevel: Level | null = this.currentLevel.nextLevel();
    if (newLevel !== null) {
      this.currentLevel.onExit();
      this.currentLevel = newLevel;
      this.currentLevel.onEnter();
      this.transitionFadeTimer = GameConfig.TRANSITION_FADE_DURATION_MS;
    }

    if (this.currentLevel.isGameWon()) {
      this.persistBestScore();
    }

    if (this.scoreAttackFinished) {
      this.persistBestScore();
    }

    return true;
  }

  private persistBestScore(): void {
    const estimatedFinalScore: number = this.currentLevel.getFinalScore();
    this.unlockMedals(estimatedFinalScore);
    if (estimatedFinalScore > this.persistedStats.bestFinalScore) {
      this.persistedStats.bestFinalScore = estimatedFinalScore;
      this.persistedStats.lastSeed = RunManager.getRunState().seed;
      Persistence.saveStats(this.persistedStats);
    }
  }

  private unlockMedals(finalScore: number): void {
    const unlocked: Set<string> = new Set<string>(this.persistedStats.unlockedMedals);

    if (finalScore >= 2000) {
      unlocked.add('Bronze Defender');
    }
    if (finalScore >= 5000) {
      unlocked.add('Silver Guardian');
    }
    if (finalScore >= 9000) {
      unlocked.add('Gold Vanguard');
    }
    if (RunManager.getRunState().mode === 'score-attack' && finalScore >= 2500) {
      unlocked.add('Speed Runner');
    }

    this.persistedStats.unlockedMedals = [...unlocked];
    Persistence.saveStats(this.persistedStats);
  }
}
