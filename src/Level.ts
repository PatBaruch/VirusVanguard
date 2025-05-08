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

export default abstract class Level {
  private duplicateCount: number = 0;

  private enemyCount: number = 0;

  private hpDecreaseTimer: number = 0;

  private isGameOver: boolean = false;

  private isLoaded: boolean = false;

  private isMrHackerAlive: boolean = true;

  private mrHackerHealthBarImage: HTMLImageElement;

  private restart: boolean = false;

  private rvirusStuckToPlayer: boolean = false;

  private timeSinceStart: number = 0;

  private timeToSpawnEnemyOnMrHacker: number = 3000;

  protected canvas: HTMLCanvasElement;

  protected currentLevel: number;

  protected gameItems: GameItem[] = [];

  protected hasStarted: boolean = false;

  protected ifWin: boolean = false;

  protected maxX: number;

  protected maxY: number;

  protected minX: number;

  protected minY: number;

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
  }

  /**
   * Starts the level by spawning the next item.
   */
  protected startLevel(): void {
    this.spawnNextItem();
  }

  /**
   * Chartreuseuces the health of the player by the specified amount of damage.
   * @param damage damage taken by player
   */
  public damegePlayer(damage: number): void {
    this.playerHealth -= damage;
  }

  /**
   * Get the player's health.
   * @returns The player's health.
   */
  public getPlayerHealth(): number {
    return this.playerHealth;
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
      if (keyListener.isKeyDown(KeyListener.KEY_W) && keyListener.isKeyDown(KeyListener.KEY_D)
        && this.player.getPosY() > this.minY && this.player.getPosX() < this.maxX) {
        this.player.moveDiagonallyRightUp();
      } else if (keyListener.isKeyDown(KeyListener.KEY_S)
        && keyListener.isKeyDown(KeyListener.KEY_D)
        && this.player.getPosY() < this.maxY && this.player.getPosX() < this.maxX) {
        this.player.moveDiagonallyRightDown();
      } else if (keyListener.isKeyDown(KeyListener.KEY_W)
        && keyListener.isKeyDown(KeyListener.KEY_A)
        && this.player.getPosY() > this.minY && this.player.getPosX() > this.minX) {
        this.player.moveDiagonallyLefttUp();
      } else if (keyListener.isKeyDown(KeyListener.KEY_S)
        && keyListener.isKeyDown(KeyListener.KEY_A)
        && this.player.getPosY() < this.maxY && this.player.getPosX() > this.minX) {
        this.player.moveDiagonallyLeftDown();
      } else if (keyListener.isKeyDown(KeyListener.KEY_W) && this.player.getPosY() > this.minY) {
        this.player.moveUp();
      } else if (keyListener.isKeyDown(KeyListener.KEY_A) && this.player.getPosX() > this.minX) {
        this.player.moveLeft();
      } else if (keyListener.isKeyDown(KeyListener.KEY_S) && this.player.getPosY() < this.maxY) {
        this.player.moveDown();
      } else if (keyListener.isKeyDown(KeyListener.KEY_D) && this.player.getPosX() < this.maxX) {
        this.player.moveRight();
      }
      if (keyListener.keyPressed(KeyListener.KEY_SPACE) && this.currentLevel !== 0) {
        this.shoot();
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
        this.canvas.width / 2 - 480, this.canvas.height / 2 - 968);
    }
    if (this.playerHealth <= 0) {
      CanvasRenderer.writeText(canvas, 'Game Over', canvas.width / 2, canvas.height / 2, 'center', 'Copperplate', 100, 'Red');
      CanvasRenderer.writeText(canvas, `Score: ${this.score}`, canvas.width / 2, canvas.height / 2 + 100, 'center', 'Copperplate', 100, 'Red');
      CanvasRenderer.writeText(canvas, 'Press space to restart the game', canvas.width / 2, canvas.height / 2 + 200, 'center', 'Copperplate', 100, 'Red');
      this.isGameOver = true;
    } else {
      this.player.render(canvas);
      CanvasRenderer.writeText(canvas, `Health: ${this.playerHealth}`, 50, 50, 'left', 'Copperplate', 60, 'white');
      CanvasRenderer.writeText(canvas, `Level: ${this.currentLevel}`, 50, 120, 'left', 'Copperplate', 60, 'Chartreuse');
      this.gameItems.forEach((item: GameItem) => {
        item.render(canvas);
      }
      );
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
    const speed: number = 2;
    const playerCenterX: number = this.player.getPosX() + this.player.getWidth() / 2;
    const playerCenterY: number = this.player.getPosY() + this.player.getHeight() / 2;
    if (this.currentLevel < 3) {
      if (this.player.getDirection() === 'E') {
        this.gameItems.push(new Bullet(this.canvas,
          playerCenterX, playerCenterY, speed, 0));
      } else if (this.player.getDirection() === 'W') {
        this.gameItems.push(new Bullet(this.canvas,
          playerCenterX, playerCenterY, -speed, 0));
      } else if (this.player.getDirection() === 'N') {
        this.gameItems.push(new Bullet(this.canvas,
          playerCenterX, playerCenterY, 0, -speed));
      } else if (this.player.getDirection() === 'S') {
        this.gameItems.push(new Bullet(this.canvas,
          playerCenterX, playerCenterY, 0, speed));
      } else if (this.player.getDirection() === 'NE') {
        this.gameItems.push(new Bullet(this.canvas,
          playerCenterX, playerCenterY, speed / Math.sqrt(2), -speed / Math.sqrt(2)));
      } else if (this.player.getDirection() === 'SE') {
        this.gameItems.push(new Bullet(this.canvas,
          playerCenterX, playerCenterY, speed / Math.sqrt(2), speed / Math.sqrt(2)));
      } else if (this.player.getDirection() === 'NW') {
        this.gameItems.push(new Bullet(this.canvas,
          playerCenterX, playerCenterY, -speed / Math.sqrt(2), -speed / Math.sqrt(2)));
      } else if (this.player.getDirection() === 'SW') {
        this.gameItems.push(new Bullet(this.canvas,
          playerCenterX, playerCenterY, -speed / Math.sqrt(2), speed / Math.sqrt(2)));
      }
    } else if (this.currentLevel >= 4){
      if (this.player.getDirection() === 'E') {
        this.gameItems.push(new Bullet(this.canvas,
          playerCenterX + 10, playerCenterY + 10, speed, 1));
        this.gameItems.push(new Bullet(this.canvas,
          playerCenterX + 10, playerCenterY + 10, speed, -1));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, speed, 0));
      } else if (this.player.getDirection() === 'W') {
        this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed, 1));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed, -1));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed, 0));
      } else if (this.player.getDirection() === 'N') {
        this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, 1, -speed));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -1, -speed));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, 0, -speed));
      } else if (this.player.getDirection() === 'S') {
        this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, 1, speed));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -1, speed));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, 0, speed));
      } else if (this.player.getDirection() === 'NE') {
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, speed / Math.sqrt(2), -speed / Math.sqrt(2)));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, speed / Math.sqrt(2), -speed / Math.sqrt(2) + 1));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, speed / Math.sqrt(2), -speed / Math.sqrt(2) - 1));
      } else if (this.player.getDirection() === 'SE') {
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, speed / Math.sqrt(2), speed / Math.sqrt(2)));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, speed / Math.sqrt(2) - 1, speed / Math.sqrt(2)));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, speed / Math.sqrt(2) + 1, speed / Math.sqrt(2)));
      } else if (this.player.getDirection() === 'NW') {
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, -speed / Math.sqrt(2), -speed / Math.sqrt(2)));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, -speed / Math.sqrt(2) + 1, -speed / Math.sqrt(2)));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, -speed / Math.sqrt(2) - 1, -speed / Math.sqrt(2)));
      } else if (this.player.getDirection() === 'SW') {
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, -speed / Math.sqrt(2), speed / Math.sqrt(2)));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, -speed / Math.sqrt(2) + 1, speed / Math.sqrt(2)));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, -speed / Math.sqrt(2) - 1, speed / Math.sqrt(2)));
      }
    } else if (this.currentLevel >= 3 && this.currentLevel < 4 ) {
      if (this.player.getDirection() === 'E') {
        this.gameItems.push(new Bullet(this.canvas,
          playerCenterX + 10, playerCenterY + 15, speed, 0));
        this.gameItems.push(new Bullet(this.canvas,
          playerCenterX + 10, playerCenterY - 15, speed, 0));
      } else if (this.player.getDirection() === 'W') {
        this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY + 15, -speed, 0));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY - 15, -speed, 0));
      } else if (this.player.getDirection() === 'N') {
        this.gameItems.push(new Bullet(this.canvas, playerCenterX + 15, playerCenterY, 0, -speed));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX - 15, playerCenterY, 0, -speed));
      } else if (this.player.getDirection() === 'S') {
        this.gameItems.push(new Bullet(this.canvas, playerCenterX + 15, playerCenterY, 0, speed));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX - 15, playerCenterY, 0, speed));
      } else if (this.player.getDirection() === 'NE') {
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, speed / Math.sqrt(2), -speed / Math.sqrt(2)));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY - 30, speed / Math.sqrt(2), -speed / Math.sqrt(2)));
      } else if (this.player.getDirection() === 'SE') {
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, speed / Math.sqrt(2), speed / Math.sqrt(2)));
        this.gameItems.push(new Bullet(this.canvas,
          playerCenterX, playerCenterY - 30, speed / Math.sqrt(2), speed / Math.sqrt(2)));
      } else if (this.player.getDirection() === 'NW') {
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, -speed / Math.sqrt(2), -speed / Math.sqrt(2)));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY - 30, -speed / Math.sqrt(2), -speed / Math.sqrt(2)));
      } else if (this.player.getDirection() === 'SW') {
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY, -speed / Math.sqrt(2), speed / Math.sqrt(2)));
        this.gameItems.push(new Bullet(this.canvas, playerCenterX,
          playerCenterY - 30, -speed / Math.sqrt(2), speed / Math.sqrt(2)));
      }
    }
  }

  public abstract spawnNextItem(): void;

  /**
   * Updates the level state based on the elapsed time.
   * @param elapsed The elapsed time in milliseconds.
   */
  public update(elapsed: number): void {
    const itemsToRemove: GameItem[] = [];

    if (!(this.isGameOver || this.isGameWon())) {
      this.multiplier *= 0.9999;
    }

    this.levelTimer += elapsed;
    this.timeToSpawnEnemyOnMrHacker -= elapsed;

    if (this.currentLevel == 3 && this.levelTimer >= 2000 && this.score < 600) {
      const newWorms: Worm[] = [];
      this.gameItems.forEach((item: Worm) => {
        if (item instanceof Worm) {
          const newWorm: Worm = new Worm(this.canvas, item.getPosX(), item.getPosY());
          newWorms.push(newWorm);
        }
      });

      this.gameItems = [...this.gameItems, ...newWorms];
      this.levelTimer = 0;
      this.duplicateCount += 1;
    }

    if (this.currentLevel == 4 && this.levelTimer >= 3000 && this.score < 1000) {
      const newWorms: Worm[] = [];
      this.gameItems.forEach((item: Worm) => {
        if (item instanceof Worm) {
          const newWorm: Worm = new Worm(this.canvas, item.getPosX(), item.getPosY());
          newWorms.push(newWorm);
        }
      });

      this.gameItems = [...this.gameItems, ...newWorms];
      this.levelTimer = 0;
      this.duplicateCount += 1;
    }

    const deathItemsToAdd: Death[] = [];

    this.gameItems.forEach((item: GameItem) => {
      if (this.currentLevel === 5 && item instanceof MrHacker) {
        const images: string[] = [
          '../assets/BossBar_Sprite/bossbar_00.png',
          '../assets/BossBar_Sprite/bossbar_01.png',
          '../assets/BossBar_Sprite/bossbar_02.png',
          '../assets/BossBar_Sprite/bossbar_03.png',
          '../assets/BossBar_Sprite/bossbar_04.png',
          '../assets/BossBar_Sprite/bossbar_05.png',
          '../assets/BossBar_Sprite/bossbar_06.png',
          '../assets/BossBar_Sprite/bossbar_07.png',
          '../assets/BossBar_Sprite/bossbar_08.png',
          '../assets/BossBar_Sprite/bossbar_09.png',
          '../assets/BossBar_Sprite/bossbar_10.png',
          '../assets/BossBar_Sprite/bossbar_11.png',
          '../assets/BossBar_Sprite/bossbar_12.png',
          '../assets/BossBar_Sprite/bossbar_13.png',
          '../assets/BossBar_Sprite/bossbar_14.png',
          '../assets/BossBar_Sprite/bossbar_15.png',
          '../assets/BossBar_Sprite/bossbar_16.png',
          '../assets/BossBar_Sprite/bossbar_17.png',
          '../assets/BossBar_Sprite/bossbar_18.png',
          '../assets/BossBar_Sprite/bossbar_19.png',
          '../assets/BossBar_Sprite/bossbar_20.png',
          '../assets/BossBar_Sprite/bossbar_21.png',
          '../assets/BossBar_Sprite/bossbar_22.png',
          '../assets/BossBar_Sprite/bossbar_23.png',
          '../assets/BossBar_Sprite/bossbar_24.png',
          '../assets/BossBar_Sprite/bossbar_25.png',
        ];
        this.mrHackerHealthBarImage = CanvasRenderer.loadNewImage(images[item.getHealthPoints()]);
        this.isLoaded = true;
        console.log(item.getHealthPoints());
        if (item.getHealthPoints() <= 0) {
          this.isMrHackerAlive = false;
        }
      }
      if (item instanceof MrHacker) {
        if (this.timeToSpawnEnemyOnMrHacker < 0) {
          const rng: number = Math.random();
          if (rng < 0.33) {
            this.gameItems.push(new FEmail(this.canvas, item.getPosX() + 100, item.getPosY() + 30));
          } else if (rng < 0.66) {
            this.gameItems.push(new RVirus(this.canvas, item.getPosX() + 100, item.getPosY() - 30));
          } else {
            this.gameItems.push(new Worm(this.canvas, item.getPosX() + 100, item.getPosY() + 30));
          }
          this.timeToSpawnEnemyOnMrHacker = 3000;
        }
        if (item.isTimeToShoot()) {
          const mrHackerCenterX: number = item.getPosX() + item.getWidth() / 2;
          const mrHackerCenterY: number = item.getPosY() + item.getHeight() / 2;
          const playerCenterX: number = this.player.getPosX() + this.player.getWidth() / 2;
          const playerCenterY: number = this.player.getPosY() + this.player.getHeight() / 2;
          const deltaX: number = playerCenterX - mrHackerCenterX;
          const deltaY: number = playerCenterY - mrHackerCenterY;
          let direction: string;

          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            direction = deltaX > 0 ? 'E' : 'W';
          } else {
            direction = deltaY > 0 ? 'S' : 'N';
          }

          const angle: number = 10 + Math.random() * 45;
          // Angle in degrees (negative for left direction)
          const angleInRadians: number = (angle * Math.PI) / 180; // Convert angle to radians
          const speed: number = 1; // Constant speed of the bullet
          const velocityX: number = Math.cos(angleInRadians) * speed;
          // Calculate the x component of velocity
          const velocityY: number = Math.sin(angleInRadians) * speed;
          // Calculate the y component of velocity

          switch (direction) {
            case 'N':
              this.gameItems.push(new EnemyBullet(this.canvas,
                mrHackerCenterX, mrHackerCenterY, 0, -velocityY));
              this.gameItems.push(new EnemyBullet(this.canvas,
                mrHackerCenterX, mrHackerCenterY, velocityX, -velocityY));
              this.gameItems.push(new EnemyBullet(this.canvas,
                mrHackerCenterX, mrHackerCenterY, -velocityX, -velocityY));
              break;
            case 'S':
              this.gameItems.push(new EnemyBullet(this.canvas,
                mrHackerCenterX, mrHackerCenterY, 0, velocityY));
              this.gameItems.push(new EnemyBullet(this.canvas,
                mrHackerCenterX, mrHackerCenterY, velocityX, velocityY));
              this.gameItems.push(new EnemyBullet(this.canvas,
                mrHackerCenterX, mrHackerCenterY, -velocityX, velocityY));
              break;
            case 'E':
              this.gameItems.push(new EnemyBullet(this.canvas,
                mrHackerCenterX, mrHackerCenterY, velocityX, 0));
              this.gameItems.push(new EnemyBullet(this.canvas,
                mrHackerCenterX, mrHackerCenterY, velocityX, velocityY));
              this.gameItems.push(new EnemyBullet(this.canvas,
                mrHackerCenterX, mrHackerCenterY, velocityX, -velocityY));
              break;
            case 'W':
              this.gameItems.push(new EnemyBullet(this.canvas,
                mrHackerCenterX, mrHackerCenterY, -velocityX, 0));
              this.gameItems.push(new EnemyBullet(this.canvas,
                mrHackerCenterX, mrHackerCenterY, -velocityX, velocityY));
              this.gameItems.push(new EnemyBullet(this.canvas,
                mrHackerCenterX, mrHackerCenterY, -velocityX, -velocityY));
              break;
          }
          item.setTimeToShoot();
        }
      }
      if (
        this.player.isPlayerColidingWithItem(item) &&
        !(item instanceof Bullet) &&
        !(item instanceof MrHacker) &&
        !(item instanceof RVirus) &&
        !(item instanceof Death)
      ) {
        itemsToRemove.push(item);
        this.damegePlayer(item.getDamage());
      }

      if (this.player.isPlayerColidingWithItem(item) && (item instanceof RVirus)) {
        if (!this.rvirusStuckToPlayer && item.getHealthPoints() > 0) {
          item.setFollowingPlayer(this.player);
          this.rvirusStuckToPlayer = true;
        } else {
          this.rvirusStuckToPlayer = false;
          this.levelTimer += elapsed;
          if (this.levelTimer >= 1500) {
            this.damegePlayer(5);
            this.levelTimer = 0;
          }
        }
      }
      if (item instanceof EnemyBullet) {
        if (item.getPosX() < this.minX * 0.9 || item.getPosX() > this.maxX * 1.05
          || item.getPosY() < this.minY * 0.9 || item.getPosY() > this.maxY * 1.05) {
          itemsToRemove.push(item);
        }
      }
      if (item instanceof Bullet) {
        if (item.getPosX() < this.minX * 0.9 || item.getPosX() > this.maxX * 1.05
          || item.getPosY() < this.minY * 0.9 || item.getPosY() > this.maxY * 1.05) {
          itemsToRemove.push(item);
        }

        // Check for collision with other game items
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
            }
          }
          if (otherItem instanceof Trojan && item.isBulletColidingWithItem(otherItem)) {
            itemsToRemove.push(item, otherItem);
            this.gameItems.push(new FEmail(this.canvas, item.getPosX() + 100, item.getPosY() + 30));
            this.gameItems.push(new RVirus(this.canvas, item.getPosX() + 100, item.getPosY() - 30));
            this.gameItems.push(new Worm(this.canvas, item.getPosX() + 100, item.getPosY() + 30));
          }
        }
      }

      if (item instanceof Trojan && item.getPosX() < this.minX) {
        itemsToRemove.push(item);
        this.damegePlayer(item.getDamage());
        this.gameItems.push(new FEmail(this.canvas, item.getPosX() + 100, item.getPosY() + 30));
        this.gameItems.push(new RVirus(this.canvas, item.getPosX() + 100, item.getPosY() - 30));
        this.gameItems.push(new Worm(this.canvas, item.getPosX() + 100, item.getPosY() + 30));
      }
    });

    // Remove items that should be removed
    this.gameItems = this.gameItems.filter((item: GameItem) => !itemsToRemove.includes(item));
    this.gameItems.push(...deathItemsToAdd);
    this.gameItems.forEach((item: GameItem) => {
      item.update(elapsed);
    });
  }
}
