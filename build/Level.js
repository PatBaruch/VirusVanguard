import KeyListener from './KeyListener.js';
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
import { LEVEL_LAYOUTS } from './config/LevelConfig.js';
import ArenaBounds from './core/ArenaBounds.js';
import RunManager from './core/RunManager.js';
export default class Level {
    duplicateCount = 0;
    enemyCount = 0;
    hpDecreaseTimer = 0;
    isGameOver = false;
    isLoaded = false;
    isMrHackerAlive = true;
    mrHackerHealthBarImage;
    restart = false;
    fireCooldownRemaining = 0;
    rvirusStuckToPlayer = false;
    damageFlashTimer = 0;
    rvirusDamageTimer = 0;
    timeSinceStart = 0;
    scorePopups = [];
    timeToSpawnEnemyOnMrHacker = GameConfig.BOSS_SUMMON_INTERVAL_MS;
    canvas;
    currentLevel;
    gameItems = [];
    hasStarted = false;
    ifWin = false;
    inputKeyListener = null;
    maxX;
    maxY;
    minX;
    minY;
    playArea;
    exitGate;
    multiplier = 5;
    player;
    playerHealth;
    score;
    levelTimer = 0;
    mrHacker;
    constructor(canvas, playerHealth, score) {
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
    applyLayout(layout) {
        const playerWidthOffset = this.player.getWidth() / 2;
        const playerHeightOffset = this.player.getHeight() / 2;
        this.playArea = ArenaBounds.fromRatioRect(this.canvas, layout.playArea, playerWidthOffset, playerHeightOffset);
        this.exitGate = ArenaBounds.fromRatioRect(this.canvas, layout.exitGate, playerWidthOffset, playerHeightOffset);
        this.minX = this.playArea.left;
        this.minY = this.playArea.top;
        this.maxX = this.playArea.right;
        this.maxY = this.playArea.bottom;
    }
    isPlayerInExitGate() {
        const playerX = this.player.getPosX();
        const playerY = this.player.getPosY();
        return playerX > this.exitGate.left
            && playerY > this.exitGate.top
            && playerY < this.exitGate.bottom;
    }
    startLevel() {
        this.spawnNextItem();
    }
    onEnter() {
    }
    onExit() {
    }
    damegePlayer(damage) {
        this.playerHealth -= damage * RunManager.getDamageTakenMultiplier();
        this.damageFlashTimer = GameConfig.DAMAGE_FLASH_DURATION_MS;
    }
    getPlayerHealth() {
        return this.playerHealth;
    }
    getScore() {
        return this.score;
    }
    getFinalScore() {
        return Math.round(this.score * this.multiplier);
    }
    isGameWon() {
        return false;
    }
    processInput(keyListener) {
        this.inputKeyListener = keyListener;
        if ((this.isGameOver && keyListener.keyPressed(KeyListener.KEY_SPACE))) {
            this.restart = true;
            this.restartGame();
        }
        else if (this.isGameWon() && keyListener.keyPressed(KeyListener.KEY_SPACE)) {
            this.restart = true;
            this.restartGame();
        }
        else {
            this.restart = false;
        }
        if (this.hasStarted) {
            if (keyListener.isKeyDown(KeyListener.KEY_W) && keyListener.isKeyDown(KeyListener.KEY_D)
                && this.player.getPosY() > this.minY && this.player.getPosX() < this.maxX) {
                this.player.moveDiagonallyRightUp();
            }
            else if (keyListener.isKeyDown(KeyListener.KEY_S)
                && keyListener.isKeyDown(KeyListener.KEY_D)
                && this.player.getPosY() < this.maxY && this.player.getPosX() < this.maxX) {
                this.player.moveDiagonallyRightDown();
            }
            else if (keyListener.isKeyDown(KeyListener.KEY_W)
                && keyListener.isKeyDown(KeyListener.KEY_A)
                && this.player.getPosY() > this.minY && this.player.getPosX() > this.minX) {
                this.player.moveDiagonallyLefttUp();
            }
            else if (keyListener.isKeyDown(KeyListener.KEY_S)
                && keyListener.isKeyDown(KeyListener.KEY_A)
                && this.player.getPosY() < this.maxY && this.player.getPosX() > this.minX) {
                this.player.moveDiagonallyLeftDown();
            }
            else if (keyListener.isKeyDown(KeyListener.KEY_W) && this.player.getPosY() > this.minY) {
                this.player.moveUp();
            }
            else if (keyListener.isKeyDown(KeyListener.KEY_A) && this.player.getPosX() > this.minX) {
                this.player.moveLeft();
            }
            else if (keyListener.isKeyDown(KeyListener.KEY_S) && this.player.getPosY() < this.maxY) {
                this.player.moveDown();
            }
            else if (keyListener.isKeyDown(KeyListener.KEY_D) && this.player.getPosX() < this.maxX) {
                this.player.moveRight();
            }
            if (this.currentLevel !== 0
                && keyListener.isKeyDown(KeyListener.KEY_SPACE)
                && this.fireCooldownRemaining <= 0) {
                this.shoot();
                this.fireCooldownRemaining = GameConfig.PLAYER_FIRE_COOLDOWN_MS * RunManager.getFireCooldownMultiplier();
            }
        }
    }
    removeGameItem(item) {
        const index = this.gameItems.indexOf(item);
        if (index > -1) {
            this.gameItems.splice(index, 1);
        }
    }
    render(canvas) {
        if (this.isLoaded && this.isMrHackerAlive) {
            CanvasRenderer.drawImage(canvas, this.mrHackerHealthBarImage, this.canvas.width / 2 - GameConfig.BOSS_HEALTHBAR_OFFSET_X, this.canvas.height / 2 - GameConfig.BOSS_HEALTHBAR_OFFSET_Y);
        }
        if (this.playerHealth <= 0) {
            CanvasRenderer.writeText(canvas, 'Game Over', canvas.width / 2, canvas.height / 2, 'center', 'Copperplate', 100, 'Red');
            CanvasRenderer.writeText(canvas, `Score: ${this.score}`, canvas.width / 2, canvas.height / 2 + 100, 'center', 'Copperplate', 100, 'Red');
            CanvasRenderer.writeText(canvas, 'Press space to restart the game', canvas.width / 2, canvas.height / 2 + 200, 'center', 'Copperplate', 100, 'Red');
            this.isGameOver = true;
        }
        else {
            this.player.render(canvas);
            CanvasRenderer.drawRectangle(canvas, this.playArea.left, this.playArea.top, this.playArea.right - this.playArea.left, this.playArea.bottom - this.playArea.top, GameConfig.BORDER_COLOR);
            CanvasRenderer.writeText(canvas, `Health: ${this.playerHealth}`, 50, 50, 'left', 'Copperplate', 60, 'white');
            CanvasRenderer.writeText(canvas, `Level: ${this.currentLevel}`, 50, 120, 'left', 'Copperplate', 60, 'Chartreuse');
            const scoreGate = this.getCurrentScoreGate();
            if (scoreGate > 0) {
                CanvasRenderer.writeText(canvas, `Objective: ${Math.min(this.score, scoreGate)} / ${scoreGate}`, 50, 190, 'left', 'Copperplate', 40, GameConfig.OBJECTIVE_TEXT_COLOR);
            }
            this.gameItems.forEach((item) => {
                item.render(canvas);
            });
            this.scorePopups.forEach((popup) => {
                CanvasRenderer.writeText(canvas, popup.text, popup.x, popup.y, 'center', 'Copperplate', 30, 'Chartreuse');
            });
            if (this.damageFlashTimer > 0) {
                CanvasRenderer.fillRectangle(canvas, this.playArea.left, this.playArea.top, this.playArea.right - this.playArea.left, this.playArea.bottom - this.playArea.top, GameConfig.DAMAGE_FLASH_COLOR);
            }
        }
    }
    restartGame() {
        if (this.isGameOver && this.restart) {
            return true;
        }
        else if ((this.ifWin && this.restart)) {
            return true;
        }
        else {
            return false;
        }
    }
    shoot() {
        const speed = GameConfig.BULLET_SPEED;
        const playerCenterX = this.player.getPosX() + this.player.getWidth() / 2;
        const playerCenterY = this.player.getPosY() + this.player.getHeight() / 2;
        if (this.currentLevel < 3) {
            if (this.player.getDirection() === 'E') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, speed, 0));
            }
            else if (this.player.getDirection() === 'W') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed, 0));
            }
            else if (this.player.getDirection() === 'N') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, 0, -speed));
            }
            else if (this.player.getDirection() === 'S') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, 0, speed));
            }
            else if (this.player.getDirection() === 'NE') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, speed / Math.sqrt(2), -speed / Math.sqrt(2)));
            }
            else if (this.player.getDirection() === 'SE') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, speed / Math.sqrt(2), speed / Math.sqrt(2)));
            }
            else if (this.player.getDirection() === 'NW') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed / Math.sqrt(2), -speed / Math.sqrt(2)));
            }
            else if (this.player.getDirection() === 'SW') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed / Math.sqrt(2), speed / Math.sqrt(2)));
            }
        }
        else if (this.currentLevel >= 4) {
            if (this.player.getDirection() === 'E') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX + 10, playerCenterY + 10, speed, 1));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX + 10, playerCenterY + 10, speed, -1));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, speed, 0));
            }
            else if (this.player.getDirection() === 'W') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed, 1));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed, -1));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed, 0));
            }
            else if (this.player.getDirection() === 'N') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, 1, -speed));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -1, -speed));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, 0, -speed));
            }
            else if (this.player.getDirection() === 'S') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, 1, speed));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -1, speed));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, 0, speed));
            }
            else if (this.player.getDirection() === 'NE') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, speed / Math.sqrt(2), -speed / Math.sqrt(2)));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, speed / Math.sqrt(2), -speed / Math.sqrt(2) + 1));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, speed / Math.sqrt(2), -speed / Math.sqrt(2) - 1));
            }
            else if (this.player.getDirection() === 'SE') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, speed / Math.sqrt(2), speed / Math.sqrt(2)));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, speed / Math.sqrt(2) - 1, speed / Math.sqrt(2)));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, speed / Math.sqrt(2) + 1, speed / Math.sqrt(2)));
            }
            else if (this.player.getDirection() === 'NW') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed / Math.sqrt(2), -speed / Math.sqrt(2)));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed / Math.sqrt(2) + 1, -speed / Math.sqrt(2)));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed / Math.sqrt(2) - 1, -speed / Math.sqrt(2)));
            }
            else if (this.player.getDirection() === 'SW') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed / Math.sqrt(2), speed / Math.sqrt(2)));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed / Math.sqrt(2) + 1, speed / Math.sqrt(2)));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed / Math.sqrt(2) - 1, speed / Math.sqrt(2)));
            }
        }
        else if (this.currentLevel >= 3 && this.currentLevel < 4) {
            if (this.player.getDirection() === 'E') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX + 10, playerCenterY + 15, speed, 0));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX + 10, playerCenterY - 15, speed, 0));
            }
            else if (this.player.getDirection() === 'W') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY + 15, -speed, 0));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY - 15, -speed, 0));
            }
            else if (this.player.getDirection() === 'N') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX + 15, playerCenterY, 0, -speed));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX - 15, playerCenterY, 0, -speed));
            }
            else if (this.player.getDirection() === 'S') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX + 15, playerCenterY, 0, speed));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX - 15, playerCenterY, 0, speed));
            }
            else if (this.player.getDirection() === 'NE') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, speed / Math.sqrt(2), -speed / Math.sqrt(2)));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY - 30, speed / Math.sqrt(2), -speed / Math.sqrt(2)));
            }
            else if (this.player.getDirection() === 'SE') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, speed / Math.sqrt(2), speed / Math.sqrt(2)));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY - 30, speed / Math.sqrt(2), speed / Math.sqrt(2)));
            }
            else if (this.player.getDirection() === 'NW') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed / Math.sqrt(2), -speed / Math.sqrt(2)));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY - 30, -speed / Math.sqrt(2), -speed / Math.sqrt(2)));
            }
            else if (this.player.getDirection() === 'SW') {
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY, -speed / Math.sqrt(2), speed / Math.sqrt(2)));
                this.gameItems.push(new Bullet(this.canvas, playerCenterX, playerCenterY - 30, -speed / Math.sqrt(2), speed / Math.sqrt(2)));
            }
        }
    }
    update(elapsed) {
        const itemsToRemove = [];
        this.fireCooldownRemaining = Math.max(0, this.fireCooldownRemaining - elapsed);
        this.damageFlashTimer = Math.max(0, this.damageFlashTimer - elapsed);
        this.scorePopups = this.scorePopups
            .map((popup) => ({
            ...popup,
            ttl: popup.ttl - elapsed,
            y: popup.y - GameConfig.SCORE_POPUP_SPEED_PER_MS * elapsed,
        }))
            .filter((popup) => popup.ttl > 0);
        if (!(this.isGameOver || this.isGameWon())) {
            this.multiplier *= Math.pow(GameConfig.MULTIPLIER_DECAY_PER_SECOND * RunManager.getMultiplierDecayMultiplier(), elapsed / 1000);
        }
        this.levelTimer += elapsed;
        this.timeToSpawnEnemyOnMrHacker -= elapsed;
        if (this.currentLevel == 3 && this.levelTimer >= 2000 && this.score < 600) {
            const newWorms = [];
            this.gameItems.forEach((item) => {
                if (item instanceof Worm) {
                    const newWorm = new Worm(this.canvas, item.getPosX(), item.getPosY());
                    newWorms.push(newWorm);
                }
            });
            this.gameItems = [...this.gameItems, ...newWorms];
            this.levelTimer = 0;
            this.duplicateCount += 1;
        }
        if (this.currentLevel == 4 && this.levelTimer >= 3000 && this.score < 1000) {
            const newWorms = [];
            this.gameItems.forEach((item) => {
                if (item instanceof Worm) {
                    const newWorm = new Worm(this.canvas, item.getPosX(), item.getPosY());
                    newWorms.push(newWorm);
                }
            });
            this.gameItems = [...this.gameItems, ...newWorms];
            this.levelTimer = 0;
            this.duplicateCount += 1;
        }
        const deathItemsToAdd = [];
        this.gameItems.forEach((item) => {
            if (this.currentLevel === 5 && item instanceof MrHacker) {
                const images = [
                    './assets/BossBar_Sprite/bossbar_00.png',
                    './assets/BossBar_Sprite/bossbar_01.png',
                    './assets/BossBar_Sprite/bossbar_02.png',
                    './assets/BossBar_Sprite/bossbar_03.png',
                    './assets/BossBar_Sprite/bossbar_04.png',
                    './assets/BossBar_Sprite/bossbar_05.png',
                    './assets/BossBar_Sprite/bossbar_06.png',
                    './assets/BossBar_Sprite/bossbar_07.png',
                    './assets/BossBar_Sprite/bossbar_08.png',
                    './assets/BossBar_Sprite/bossbar_09.png',
                    './assets/BossBar_Sprite/bossbar_10.png',
                    './assets/BossBar_Sprite/bossbar_11.png',
                    './assets/BossBar_Sprite/bossbar_12.png',
                    './assets/BossBar_Sprite/bossbar_13.png',
                    './assets/BossBar_Sprite/bossbar_14.png',
                    './assets/BossBar_Sprite/bossbar_15.png',
                    './assets/BossBar_Sprite/bossbar_16.png',
                    './assets/BossBar_Sprite/bossbar_17.png',
                    './assets/BossBar_Sprite/bossbar_18.png',
                    './assets/BossBar_Sprite/bossbar_19.png',
                    './assets/BossBar_Sprite/bossbar_20.png',
                    './assets/BossBar_Sprite/bossbar_21.png',
                    './assets/BossBar_Sprite/bossbar_22.png',
                    './assets/BossBar_Sprite/bossbar_23.png',
                    './assets/BossBar_Sprite/bossbar_24.png',
                    './assets/BossBar_Sprite/bossbar_25.png',
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
                    const rng = Math.random();
                    if (rng < 0.33) {
                        this.gameItems.push(new FEmail(this.canvas, item.getPosX() + 100, item.getPosY() + 30));
                    }
                    else if (rng < 0.66) {
                        this.gameItems.push(new RVirus(this.canvas, item.getPosX() + 100, item.getPosY() - 30));
                    }
                    else {
                        this.gameItems.push(new Worm(this.canvas, item.getPosX() + 100, item.getPosY() + 30));
                    }
                    this.timeToSpawnEnemyOnMrHacker = this.getBossSummonInterval(item.getHealthPoints());
                }
                if (item.isTimeToShoot()) {
                    const mrHackerCenterX = item.getPosX() + item.getWidth() / 2;
                    const mrHackerCenterY = item.getPosY() + item.getHeight() / 2;
                    const playerCenterX = this.player.getPosX() + this.player.getWidth() / 2;
                    const playerCenterY = this.player.getPosY() + this.player.getHeight() / 2;
                    const deltaX = playerCenterX - mrHackerCenterX;
                    const deltaY = playerCenterY - mrHackerCenterY;
                    let direction;
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        direction = deltaX > 0 ? 'E' : 'W';
                    }
                    else {
                        direction = deltaY > 0 ? 'S' : 'N';
                    }
                    const phaseRange = this.getBossShotPhase(item.getHealthPoints());
                    const angle = phaseRange.min + Math.random() * (phaseRange.max - phaseRange.min);
                    const angleInRadians = (angle * Math.PI) / 180;
                    const speed = phaseRange.speed;
                    const velocityX = Math.cos(angleInRadians) * speed;
                    const velocityY = Math.sin(angleInRadians) * speed;
                    switch (direction) {
                        case 'N':
                            this.gameItems.push(new EnemyBullet(this.canvas, mrHackerCenterX, mrHackerCenterY, 0, -velocityY));
                            this.gameItems.push(new EnemyBullet(this.canvas, mrHackerCenterX, mrHackerCenterY, velocityX, -velocityY));
                            this.gameItems.push(new EnemyBullet(this.canvas, mrHackerCenterX, mrHackerCenterY, -velocityX, -velocityY));
                            break;
                        case 'S':
                            this.gameItems.push(new EnemyBullet(this.canvas, mrHackerCenterX, mrHackerCenterY, 0, velocityY));
                            this.gameItems.push(new EnemyBullet(this.canvas, mrHackerCenterX, mrHackerCenterY, velocityX, velocityY));
                            this.gameItems.push(new EnemyBullet(this.canvas, mrHackerCenterX, mrHackerCenterY, -velocityX, velocityY));
                            break;
                        case 'E':
                            this.gameItems.push(new EnemyBullet(this.canvas, mrHackerCenterX, mrHackerCenterY, velocityX, 0));
                            this.gameItems.push(new EnemyBullet(this.canvas, mrHackerCenterX, mrHackerCenterY, velocityX, velocityY));
                            this.gameItems.push(new EnemyBullet(this.canvas, mrHackerCenterX, mrHackerCenterY, velocityX, -velocityY));
                            break;
                        case 'W':
                            this.gameItems.push(new EnemyBullet(this.canvas, mrHackerCenterX, mrHackerCenterY, -velocityX, 0));
                            this.gameItems.push(new EnemyBullet(this.canvas, mrHackerCenterX, mrHackerCenterY, -velocityX, velocityY));
                            this.gameItems.push(new EnemyBullet(this.canvas, mrHackerCenterX, mrHackerCenterY, -velocityX, -velocityY));
                            break;
                    }
                    item.setTimeToShoot();
                }
            }
            if (this.player.isPlayerColidingWithItem(item) &&
                !(item instanceof Bullet) &&
                !(item instanceof MrHacker) &&
                !(item instanceof RVirus) &&
                !(item instanceof Death)) {
                itemsToRemove.push(item);
                this.damegePlayer(item.getDamage());
            }
            if (this.player.isPlayerColidingWithItem(item) && (item instanceof RVirus)) {
                if (!this.rvirusStuckToPlayer && item.getHealthPoints() > 0) {
                    item.setFollowingPlayer(this.player);
                    this.rvirusStuckToPlayer = true;
                    this.rvirusDamageTimer = 0;
                }
                else {
                    this.rvirusStuckToPlayer = false;
                    this.rvirusDamageTimer += elapsed;
                    if (this.rvirusDamageTimer >= GameConfig.RVIRUS_DOT_INTERVAL_MS) {
                        this.damegePlayer(GameConfig.RVIRUS_DOT_DAMAGE);
                        this.rvirusDamageTimer = 0;
                    }
                }
            }
            if (item instanceof EnemyBullet) {
                if (item.getPosX() < this.minX * GameConfig.BULLET_CULL_MIN_MULTIPLIER
                    || item.getPosX() > this.maxX * GameConfig.BULLET_CULL_MAX_MULTIPLIER
                    || item.getPosY() < this.minY * GameConfig.BULLET_CULL_MIN_MULTIPLIER
                    || item.getPosY() > this.maxY * GameConfig.BULLET_CULL_MAX_MULTIPLIER) {
                    itemsToRemove.push(item);
                }
            }
            if (item instanceof Bullet) {
                if (item.getPosX() < this.minX * GameConfig.BULLET_CULL_MIN_MULTIPLIER
                    || item.getPosX() > this.maxX * GameConfig.BULLET_CULL_MAX_MULTIPLIER
                    || item.getPosY() < this.minY * GameConfig.BULLET_CULL_MIN_MULTIPLIER
                    || item.getPosY() > this.maxY * GameConfig.BULLET_CULL_MAX_MULTIPLIER) {
                    itemsToRemove.push(item);
                }
                for (const otherItem of this.gameItems) {
                    if (otherItem !== item && item.isBulletColidingWithItem(otherItem)
                        && !(otherItem instanceof Death) && !(otherItem instanceof Bullet)) {
                        deathItemsToAdd.push(new Death(this, this.canvas, item.getPosX(), item.getPosY()));
                        if (otherItem instanceof RVirus && otherItem.getHealthPoints() > 5) {
                            otherItem.decreaseHealth();
                            itemsToRemove.push(item);
                        }
                        else if (otherItem instanceof MrHacker && otherItem.getHealthPoints() > 0) {
                            otherItem.decreaseHealth();
                            itemsToRemove.push(item);
                            if (otherItem.getHealthPoints() <= 0) {
                                this.isMrHackerAlive = false;
                            }
                        }
                        else {
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
        this.gameItems = this.gameItems.filter((item) => !itemsToRemove.includes(item));
        this.gameItems.push(...deathItemsToAdd);
        this.gameItems.forEach((item) => {
            item.update(elapsed);
        });
    }
    getCurrentScoreGate() {
        const levelLayout = LEVEL_LAYOUTS[this.currentLevel];
        if (levelLayout === undefined) {
            return 0;
        }
        return levelLayout.scoreGate;
    }
    getBossSummonInterval(healthPoints) {
        if (healthPoints <= 8) {
            return 1800;
        }
        if (healthPoints <= 16) {
            return 2400;
        }
        return GameConfig.BOSS_SUMMON_INTERVAL_MS;
    }
    getBossShotPhase(healthPoints) {
        if (healthPoints <= 8) {
            return {
                min: 20,
                max: 65,
                speed: 1.4,
            };
        }
        if (healthPoints <= 16) {
            return {
                min: 15,
                max: 55,
                speed: 1.2,
            };
        }
        return {
            min: 10,
            max: 45,
            speed: 1,
        };
    }
}
//# sourceMappingURL=Level.js.map