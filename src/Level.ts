import KeyListener from './KeyListener.js';
import GameItem from './GameItem.js';
import Player from './Player.js';
import Bullet from './GameItem/Bullet.js';
import CanvasRenderer from './CanvasRenderer.js';
import Worm from './GameItem/Worm.js';
import Trojan from './GameItem/Trojan.js';
import FEmail from './GameItem/FEmail.js';
import RVirus from './GameItem/RVirus.js';
import MrHacker from './GameItem/MrHacker.js';
import Death from './GameItem/Death.js';
import EnemyBullet from './GameItem/EnemyBullet.js';
import GameConfig from './config/GameConfig.js';
import type { LevelLayoutConfig } from './config/LevelConfig.js';
import { LEVEL_LAYOUTS } from './config/LevelConfig.js';
import ArenaBounds from './core/ArenaBounds.js';
import RunManager from './core/RunManager.js';
import type { Rect } from './types/Geometry.js';
import PlayerMovementSystem from './level/systems/PlayerMovementSystem.js';
import PlayerWeaponSystem from './level/systems/PlayerWeaponSystem.js';
import BossPhaseSystem from './level/systems/BossPhaseSystem.js';
import TransientUiSystem, { type ScorePopup } from './level/systems/TransientUiSystem.js';
import WormDuplicationSystem from './level/systems/WormDuplicationSystem.js';

export default abstract class Level {
  private duplicateCount: number = 0;

  private enemyCount: number = 0;

  private hpDecreaseTimer: number = 0;

  private isGameOver: boolean = false;

  private isLoaded: boolean = false;

  private isMrHackerAlive: boolean = true;

  private mrHackerHealthBarImage: HTMLImageElement;

  private restart: boolean = false;

  private fireCooldownRemaining: number = 0;

  private rvirusStuckToPlayer: boolean = false;

  private damageFlashTimer: number = 0;

  private rvirusDamageTimer: number = 0;

  private timeSinceStart: number = 0;

  private scorePopups: ScorePopup[] = [];

  private timeToSpawnEnemyOnMrHacker: number = GameConfig.BOSS_SUMMON_INTERVAL_MS;

  protected canvas: HTMLCanvasElement;

  protected currentLevel: number;

  protected gameItems: GameItem[] = [];

  protected hasStarted: boolean = false;

  protected ifWin: boolean = false;

  protected inputKeyListener: KeyListener | null = null;

  protected maxX: number;

  protected maxY: number;

  protected minX: number;

  protected minY: number;

  protected playArea: Rect;

  protected exitGate: Rect;

  protected multiplier: number = 5;

  protected player: Player;

  protected playerHealth: number;

  protected score: number;

  public levelTimer: number = 0;

  public mrHacker: MrHacker;

  public constructor(canvas: HTMLCanvasElement, playerHealth: number, score: number,) {
    this.canvas = canvas;
    this.playerHealth = playerHealth;
    this.score = score;
    this.playArea = {
      left: 0,
      top: 0,
      right: canvas.width,
      bottom: canvas.height,
    };
    this.exitGate = {
      left: canvas.width,
      top: 0,
      right: canvas.width,
      bottom: canvas.height,
    };
  }

  protected applyLayout(layout: LevelLayoutConfig): void {
    const playerWidthOffset: number = this.player.getWidth() / 2;
    const playerHeightOffset: number = this.player.getHeight() / 2;

    this.playArea = ArenaBounds.fromRatioRect(
      this.canvas,
      layout.playArea,
      playerWidthOffset,
      playerHeightOffset,
    );
    const exitGateBounds: Rect = ArenaBounds.fromRatioRect(this.canvas, layout.exitGate);
    this.exitGate = {
      left: exitGateBounds.left - playerWidthOffset,
      top: exitGateBounds.top - playerHeightOffset,
      right: exitGateBounds.right - playerWidthOffset,
      bottom: exitGateBounds.bottom - playerHeightOffset,
    };

    this.minX = this.playArea.left;
    this.minY = this.playArea.top;
    this.maxX = this.playArea.right;
    this.maxY = this.playArea.bottom;
  }

  protected isPlayerInExitGate(): boolean {
    const playerX: number = this.player.getPosX();
    const playerY: number = this.player.getPosY();

    return playerX > this.exitGate.left
      && playerY > this.exitGate.top
      && playerY < this.exitGate.bottom;
  }

  /**
   * Starts the level by spawning the next item.
   */
  protected startLevel(): void {
    this.spawnNextItem();
  }

  public onEnter(): void {
    // default no-op
  }

  public onExit(): void {
    // default no-op
  }

  /**
   * Chartreuseuces the health of the player by the specified amount of damage.
   * @param damage damage taken by player
   */
  public damegePlayer(damage: number): void {
    this.playerHealth -= damage * RunManager.getDamageTakenMultiplier();
    this.damageFlashTimer = GameConfig.DAMAGE_FLASH_DURATION_MS;
  }

  /**
   * Get the player's health.
   * @returns The player's health.
   */
  public getPlayerHealth(): number {
    return this.playerHealth;
  }

  public getScore(): number {
    return this.score;
  }

  public getFinalScore(): number {
    return Math.round(this.score * this.multiplier);
  }

  /**
   * Checks if the game is won.
   * @returns True if the game is won, false otherwise.
   */
  public isGameWon(): boolean {
    return false;
  }

  public abstract nextLevel(): Level | null;

  /**
   *
   * @param keyListener key that is pressed
   */
  public processInput(keyListener: KeyListener): void {
    this.inputKeyListener = keyListener;

    if ((this.isGameOver && keyListener.keyPressed(KeyListener.KEY_SPACE))) {
      this.restart = true;
      this.restartGame();
    } else if (this.isGameWon() && keyListener.keyPressed(KeyListener.KEY_SPACE)) {
      this.restart = true;
      this.restartGame();
    } else {
      this.restart = false;
    }
    if (this.hasStarted) {
      PlayerMovementSystem.processMovement(this.player, keyListener, {
        minX: this.minX,
        maxX: this.maxX,
        minY: this.minY,
        maxY: this.maxY,
      });

      if (this.currentLevel !== 0
        && keyListener.isKeyDown(KeyListener.KEY_SPACE)
        && this.fireCooldownRemaining <= 0) {
        this.shoot();
        this.fireCooldownRemaining = GameConfig.PLAYER_FIRE_COOLDOWN_MS * RunManager.getFireCooldownMultiplier();
      }
    }
  }

  /**
   * Removes a game item from the level.
   * @param item The game item to remove.
   */
  public removeGameItem(item: GameItem): void {
    const index: number = this.gameItems.indexOf(item);
    if (index > -1) {
      this.gameItems.splice(index, 1);
    }
  }

  /**
   *
   * @param canvas canvas on which it is rended
   */
  public render(canvas: HTMLCanvasElement): void {
    if (this.isLoaded && this.isMrHackerAlive) {
      CanvasRenderer.drawImage(canvas, this.mrHackerHealthBarImage,
        this.canvas.width / 2 - GameConfig.BOSS_HEALTHBAR_OFFSET_X,
        this.canvas.height / 2 - GameConfig.BOSS_HEALTHBAR_OFFSET_Y);
    }
    if (this.playerHealth <= 0) {
      CanvasRenderer.writeText(canvas, 'Game Over', canvas.width / 2, canvas.height / 2, 'center', 'Copperplate', 100, 'Red');
      CanvasRenderer.writeText(canvas, `Score: ${this.score}`, canvas.width / 2, canvas.height / 2 + 100, 'center', 'Copperplate', 100, 'Red');
      CanvasRenderer.writeText(canvas, 'Press space to restart the game', canvas.width / 2, canvas.height / 2 + 200, 'center', 'Copperplate', 100, 'Red');
      this.isGameOver = true;
    } else {
      this.player.render(canvas);
      CanvasRenderer.drawRectangle(
        canvas,
        this.playArea.left,
        this.playArea.top,
        this.playArea.right - this.playArea.left,
        this.playArea.bottom - this.playArea.top,
        GameConfig.BORDER_COLOR,
      );
      CanvasRenderer.writeText(canvas, `Health: ${this.playerHealth}`, 50, 50, 'left', 'Copperplate', 60, 'white');
      CanvasRenderer.writeText(canvas, `Level: ${this.currentLevel}`, 50, 120, 'left', 'Copperplate', 60, 'Chartreuse');
      const scoreGate: number = this.getCurrentScoreGate();
      if (scoreGate > 0) {
        CanvasRenderer.writeText(
          canvas,
          `Objective: ${Math.min(this.score, scoreGate)} / ${scoreGate}`,
          50,
          190,
          'left',
          'Copperplate',
          40,
          GameConfig.OBJECTIVE_TEXT_COLOR,
        );
      }
      this.gameItems.forEach((item: GameItem) => {
        item.render(canvas);
      }
      );

      this.scorePopups.forEach((popup: ScorePopup) => {
        CanvasRenderer.writeText(
          canvas,
          popup.text,
          popup.x,
          popup.y,
          'center',
          'Copperplate',
          30,
          'Chartreuse',
        );
      });

      if (this.damageFlashTimer > 0) {
        CanvasRenderer.fillRectangle(
          canvas,
          this.playArea.left,
          this.playArea.top,
          this.playArea.right - this.playArea.left,
          this.playArea.bottom - this.playArea.top,
          GameConfig.DAMAGE_FLASH_COLOR,
        );
      }
    }
  }

  /**
   * Restarts the game if it is over and restart is allowed.
   * @returns True if the game is restarted, false otherwise.
   */
  public restartGame(): boolean {
    if (this.isGameOver && this.restart) {
      return true;
    } else if ((this.ifWin && this.restart)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Shoots a bullet from the player's current position and direction.
   */
  public shoot(): void {
    const speed: number = GameConfig.BULLET_SPEED;
    const playerCenterX: number = this.player.getPosX() + this.player.getWidth() / 2;
    const playerCenterY: number = this.player.getPosY() + this.player.getHeight() / 2;
    const bulletVectors = PlayerWeaponSystem.createBulletVectors(
      this.currentLevel,
      this.player.getDirection(),
      speed,
    );

    bulletVectors.forEach((vector) => {
      this.gameItems.push(new Bullet(
        this.canvas,
        playerCenterX + vector.offsetX,
        playerCenterY + vector.offsetY,
        vector.velocityX,
        vector.velocityY,
      ));
    });
  }

  public abstract spawnNextItem(): void;

  /**
   * Updates the level state based on the elapsed time.
   * @param elapsed The elapsed time in milliseconds.
   */
  public update(elapsed: number): void {
    const itemsToRemove: GameItem[] = [];
    const deathItemsToAdd: Death[] = [];

    this.updateFrameState(elapsed);
    this.updateTimers(elapsed);
    this.processWormDuplication();

    this.gameItems.forEach((item: GameItem) => {
      this.processBossBehavior(item);
      this.processPlayerCollisions(item, itemsToRemove, elapsed);
      this.processProjectileCulling(item, itemsToRemove);
      this.processBulletCollisions(item, itemsToRemove, deathItemsToAdd);
      this.processTrojanBreach(item, itemsToRemove);
    });

    this.finalizeFrame(elapsed, itemsToRemove, deathItemsToAdd);
  }

  private updateFrameState(elapsed: number): void {
    this.fireCooldownRemaining = Math.max(0, this.fireCooldownRemaining - elapsed);
    this.damageFlashTimer = Math.max(0, this.damageFlashTimer - elapsed);
    this.scorePopups = TransientUiSystem.updatePopups(
      this.scorePopups,
      elapsed,
      GameConfig.SCORE_POPUP_SPEED_PER_MS,
    );

    if (!(this.isGameOver || this.isGameWon())) {
      this.multiplier *= Math.pow(
        GameConfig.MULTIPLIER_DECAY_PER_SECOND * RunManager.getMultiplierDecayMultiplier(),
        elapsed / 1000,
      );
    }
  }

  private updateTimers(elapsed: number): void {
    this.levelTimer += elapsed;
    this.timeToSpawnEnemyOnMrHacker -= elapsed;
  }

  private processWormDuplication(): void {
    if (WormDuplicationSystem.shouldDuplicate(this.currentLevel, this.levelTimer, this.score)) {
      const newWorms: Worm[] = WormDuplicationSystem.createDuplicates(this.canvas, this.gameItems);
      this.gameItems = [...this.gameItems, ...newWorms];
      this.levelTimer = 0;
      this.duplicateCount += 1;
    }
  }

  private processBossBehavior(item: GameItem): void {
    if (!(item instanceof MrHacker)) {
      return;
    }

    if (this.currentLevel === 5) {
      this.mrHackerHealthBarImage = CanvasRenderer.loadNewImage(
        BossPhaseSystem.getHealthBarImage(item.getHealthPoints()),
      );
      this.isLoaded = true;
      if (item.getHealthPoints() <= 0) {
        this.isMrHackerAlive = false;
      }
    }

    if (this.timeToSpawnEnemyOnMrHacker < 0) {
      const rng: number = Math.random();
      if (rng < 0.33) {
        this.gameItems.push(new FEmail(this.canvas, item.getPosX() + 100, item.getPosY() + 30));
      } else if (rng < 0.66) {
        this.gameItems.push(new RVirus(this.canvas, item.getPosX() + 100, item.getPosY() - 30));
      } else {
        this.gameItems.push(new Worm(this.canvas, item.getPosX() + 100, item.getPosY() + 30));
      }

      this.timeToSpawnEnemyOnMrHacker = BossPhaseSystem.getSummonInterval(
        item.getHealthPoints(),
        GameConfig.BOSS_SUMMON_INTERVAL_MS,
      );
    }

    if (!item.isTimeToShoot()) {
      return;
    }

    const mrHackerCenterX: number = item.getPosX() + item.getWidth() / 2;
    const mrHackerCenterY: number = item.getPosY() + item.getHeight() / 2;
    const playerCenterX: number = this.player.getPosX() + this.player.getWidth() / 2;
    const playerCenterY: number = this.player.getPosY() + this.player.getHeight() / 2;
    const direction = BossPhaseSystem.resolveDirection(
      mrHackerCenterX,
      mrHackerCenterY,
      playerCenterX,
      playerCenterY,
    );

    const phaseRange = BossPhaseSystem.getShotPhase(item.getHealthPoints());
    const angle: number = phaseRange.minAngle + Math.random() * (phaseRange.maxAngle - phaseRange.minAngle);
    const angleInRadians: number = (angle * Math.PI) / 180;
    const velocityX: number = Math.cos(angleInRadians) * phaseRange.bulletSpeed;
    const velocityY: number = Math.sin(angleInRadians) * phaseRange.bulletSpeed;

    const spreadVectors = BossPhaseSystem.createSpreadVectors(direction, velocityX, velocityY);
    spreadVectors.forEach((vector) => {
      this.gameItems.push(new EnemyBullet(
        this.canvas,
        mrHackerCenterX,
        mrHackerCenterY,
        vector.velocityX,
        vector.velocityY,
      ));
    });

    item.setTimeToShoot();
  }

  private processPlayerCollisions(item: GameItem, itemsToRemove: GameItem[], elapsed: number): void {
    if (
      this.player.isPlayerColidingWithItem(item)
      && !(item instanceof Bullet)
      && !(item instanceof MrHacker)
      && !(item instanceof RVirus)
      && !(item instanceof Death)
    ) {
      itemsToRemove.push(item);
      this.damegePlayer(item.getDamage());
    }

    if (this.player.isPlayerColidingWithItem(item) && item instanceof RVirus) {
      if (!this.rvirusStuckToPlayer && item.getHealthPoints() > 0) {
        item.setFollowingPlayer(this.player);
        this.rvirusStuckToPlayer = true;
        this.rvirusDamageTimer = 0;
      } else {
        this.rvirusStuckToPlayer = false;
        this.rvirusDamageTimer += elapsed;
        if (this.rvirusDamageTimer >= GameConfig.RVIRUS_DOT_INTERVAL_MS) {
          this.damegePlayer(GameConfig.RVIRUS_DOT_DAMAGE);
          this.rvirusDamageTimer = 0;
        }
      }
    }
  }

  private processProjectileCulling(item: GameItem, itemsToRemove: GameItem[]): void {
    if (item instanceof EnemyBullet || item instanceof Bullet) {
      if (item.getPosX() < this.minX * GameConfig.BULLET_CULL_MIN_MULTIPLIER
        || item.getPosX() > this.maxX * GameConfig.BULLET_CULL_MAX_MULTIPLIER
        || item.getPosY() < this.minY * GameConfig.BULLET_CULL_MIN_MULTIPLIER
        || item.getPosY() > this.maxY * GameConfig.BULLET_CULL_MAX_MULTIPLIER) {
        itemsToRemove.push(item);
      }
    }
  }

  private processBulletCollisions(item: GameItem, itemsToRemove: GameItem[], deathItemsToAdd: Death[]): void {
    if (!(item instanceof Bullet)) {
      return;
    }

    for (const otherItem of this.gameItems) {
      if (otherItem !== item && item.isBulletColidingWithItem(otherItem)
        && !(otherItem instanceof Death) && !(otherItem instanceof Bullet)) {
        deathItemsToAdd.push(new Death(this, this.canvas, item.getPosX(), item.getPosY()));
        if (otherItem instanceof RVirus && otherItem.getHealthPoints() > 5) {
          otherItem.decreaseHealth();
          itemsToRemove.push(item);
        } else if (otherItem instanceof MrHacker && otherItem.getHealthPoints() > 0) {
          otherItem.decreaseHealth();
          itemsToRemove.push(item);
          if (otherItem.getHealthPoints() <= 0) {
            this.isMrHackerAlive = false;
          }
        } else {
          itemsToRemove.push(item, otherItem);
          this.score += otherItem.getScore();
          this.scorePopups.push({
            text: `+${otherItem.getScore()}`,
            x: otherItem.getPosX(),
            y: otherItem.getPosY(),
            ttl: GameConfig.SCORE_POPUP_DURATION_MS,
          });
        }
      }

      if (otherItem instanceof Trojan && item.isBulletColidingWithItem(otherItem)) {
        itemsToRemove.push(item, otherItem);
        this.addTrojanSpawnPack(item.getPosX(), item.getPosY());
      }
    }
  }

  private processTrojanBreach(item: GameItem, itemsToRemove: GameItem[]): void {
    if (item instanceof Trojan && item.getPosX() < this.minX) {
      itemsToRemove.push(item);
      this.damegePlayer(item.getDamage());
      this.addTrojanSpawnPack(item.getPosX(), item.getPosY());
    }
  }

  private addTrojanSpawnPack(posX: number, posY: number): void {
    this.gameItems.push(new FEmail(this.canvas, posX + 100, posY + 30));
    this.gameItems.push(new RVirus(this.canvas, posX + 100, posY - 30));
    this.gameItems.push(new Worm(this.canvas, posX + 100, posY + 30));
  }

  private finalizeFrame(elapsed: number, itemsToRemove: GameItem[], deathItemsToAdd: Death[]): void {
    this.gameItems = this.gameItems.filter((item: GameItem) => !itemsToRemove.includes(item));
    this.gameItems.push(...deathItemsToAdd);
    this.gameItems.forEach((item: GameItem) => {
      item.update(elapsed);
    });
  }

  private getCurrentScoreGate(): number {
    const levelLayout: LevelLayoutConfig | undefined = LEVEL_LAYOUTS[this.currentLevel];
    if (levelLayout === undefined) {
      return 0;
    }

    return levelLayout.scoreGate;
  }
}
