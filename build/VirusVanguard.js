import Game from './Game.js';
import CanvasRenderer from './CanvasRenderer.js';
import KeyListener from './KeyListener.js';
import Level0 from './Level0.js';
import Level1 from './Level1.js';
import GameConfig from './config/GameConfig.js';
import Viewport from './core/Viewport.js';
import RunManager from './core/RunManager.js';
import Persistence from './core/Persistence.js';
export default class VirusVanguard extends Game {
    canvas;
    currentLevel;
    keyListener;
    playerHealth;
    transitionFadeTimer = 0;
    persistedStats;
    scoreAttackRemainingMs = 0;
    scoreAttackFinished = false;
    constructor(canvas) {
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
        }
        else {
            this.currentLevel = new Level0(this.canvas, 100, 0);
        }
        this.currentLevel.onEnter();
    }
    updateViewport() {
        const viewport = Viewport.calculate(window.innerWidth, window.innerHeight, GameConfig.VIRTUAL_WIDTH, GameConfig.VIRTUAL_HEIGHT);
        this.canvas.style.width = `${viewport.renderWidth}px`;
        this.canvas.style.height = `${viewport.renderHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${viewport.offsetX}px`;
        this.canvas.style.top = `${viewport.offsetY}px`;
    }
    processInput() {
        if (this.scoreAttackFinished) {
            return;
        }
        this.currentLevel.processInput(this.keyListener);
    }
    render() {
        CanvasRenderer.clearCanvas(this.canvas);
        this.currentLevel.render(this.canvas);
        const runState = RunManager.getRunState();
        if (runState.mode === 'score-attack') {
            CanvasRenderer.writeText(this.canvas, `Score Attack ${(this.scoreAttackRemainingMs / 1000).toFixed(1)}s`, this.canvas.width - 20, 50, 'right', 'Copperplate', 36, 'orange');
        }
        CanvasRenderer.writeText(this.canvas, `Best: ${this.persistedStats.bestFinalScore}`, this.canvas.width - 20, 95, 'right', 'Copperplate', 28, 'white');
        CanvasRenderer.writeText(this.canvas, `Medals: ${this.persistedStats.unlockedMedals.length}`, this.canvas.width - 20, 130, 'right', 'Copperplate', 24, 'Chartreuse');
        if (this.scoreAttackFinished) {
            CanvasRenderer.writeText(this.canvas, 'Score Attack Complete', this.canvas.width / 2, this.canvas.height / 2, 'center', 'Copperplate', 70, 'Gold');
        }
        if (this.transitionFadeTimer > 0) {
            const alpha = this.transitionFadeTimer / GameConfig.TRANSITION_FADE_DURATION_MS;
            CanvasRenderer.fillRectangle(this.canvas, 0, 0, this.canvas.width, this.canvas.height, `rgba(0, 0, 0, ${alpha})`);
        }
        if (this.currentLevel.restartGame() === true) {
            this.currentLevel.onExit();
            this.currentLevel = new Level0(this.canvas, 100, 0);
            this.currentLevel.onEnter();
            this.transitionFadeTimer = GameConfig.TRANSITION_FADE_DURATION_MS;
        }
    }
    update(elapsed) {
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
        const newLevel = this.currentLevel.nextLevel();
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
    persistBestScore() {
        const estimatedFinalScore = this.currentLevel.getFinalScore();
        this.unlockMedals(estimatedFinalScore);
        if (estimatedFinalScore > this.persistedStats.bestFinalScore) {
            this.persistedStats.bestFinalScore = estimatedFinalScore;
            this.persistedStats.lastSeed = RunManager.getRunState().seed;
            Persistence.saveStats(this.persistedStats);
        }
    }
    unlockMedals(finalScore) {
        const unlocked = new Set(this.persistedStats.unlockedMedals);
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
//# sourceMappingURL=VirusVanguard.js.map