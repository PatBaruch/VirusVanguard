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
import PlayerMovementSystem from './level/systems/PlayerMovementSystem.js';
import PlayerWeaponSystem from './level/systems/PlayerWeaponSystem.js';
import BossPhaseSystem from './level/systems/BossPhaseSystem.js';
import TransientUiSystem from './level/systems/TransientUiSystem.js';
import WormDuplicationSystem from './level/systems/WormDuplicationSystem.js';
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
        const exitGateBounds = ArenaBounds.fromRatioRect(this.canvas, layout.exitGate);
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
        const bulletVectors = PlayerWeaponSystem.createBulletVectors(this.currentLevel, this.player.getDirection(), speed);
        bulletVectors.forEach((vector) => {
            this.gameItems.push(new Bullet(this.canvas, playerCenterX + vector.offsetX, playerCenterY + vector.offsetY, vector.velocityX, vector.velocityY));
        });
    }
    update(elapsed) {
        const itemsToRemove = [];
        const deathItemsToAdd = [];
        this.updateFrameState(elapsed);
        this.updateTimers(elapsed);
        this.processWormDuplication();
        this.gameItems.forEach((item) => {
            this.processBossBehavior(item);
            this.processPlayerCollisions(item, itemsToRemove, elapsed);
            this.processProjectileCulling(item, itemsToRemove);
            this.processBulletCollisions(item, itemsToRemove, deathItemsToAdd);
            this.processTrojanBreach(item, itemsToRemove);
        });
        this.finalizeFrame(elapsed, itemsToRemove, deathItemsToAdd);
    }
    updateFrameState(elapsed) {
        this.fireCooldownRemaining = Math.max(0, this.fireCooldownRemaining - elapsed);
        this.damageFlashTimer = Math.max(0, this.damageFlashTimer - elapsed);
        this.scorePopups = TransientUiSystem.updatePopups(this.scorePopups, elapsed, GameConfig.SCORE_POPUP_SPEED_PER_MS);
        if (!(this.isGameOver || this.isGameWon())) {
            this.multiplier *= Math.pow(GameConfig.MULTIPLIER_DECAY_PER_SECOND * RunManager.getMultiplierDecayMultiplier(), elapsed / 1000);
        }
    }
    updateTimers(elapsed) {
        this.levelTimer += elapsed;
        this.timeToSpawnEnemyOnMrHacker -= elapsed;
    }
    processWormDuplication() {
        if (WormDuplicationSystem.shouldDuplicate(this.currentLevel, this.levelTimer, this.score)) {
            const newWorms = WormDuplicationSystem.createDuplicates(this.canvas, this.gameItems);
            this.gameItems = [...this.gameItems, ...newWorms];
            this.levelTimer = 0;
            this.duplicateCount += 1;
        }
    }
    processBossBehavior(item) {
        if (!(item instanceof MrHacker)) {
            return;
        }
        if (this.currentLevel === 5) {
            this.mrHackerHealthBarImage = CanvasRenderer.loadNewImage(BossPhaseSystem.getHealthBarImage(item.getHealthPoints()));
            this.isLoaded = true;
            if (item.getHealthPoints() <= 0) {
                this.isMrHackerAlive = false;
            }
        }
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
            this.timeToSpawnEnemyOnMrHacker = BossPhaseSystem.getSummonInterval(item.getHealthPoints(), GameConfig.BOSS_SUMMON_INTERVAL_MS);
        }
        if (!item.isTimeToShoot()) {
            return;
        }
        const mrHackerCenterX = item.getPosX() + item.getWidth() / 2;
        const mrHackerCenterY = item.getPosY() + item.getHeight() / 2;
        const playerCenterX = this.player.getPosX() + this.player.getWidth() / 2;
        const playerCenterY = this.player.getPosY() + this.player.getHeight() / 2;
        const direction = BossPhaseSystem.resolveDirection(mrHackerCenterX, mrHackerCenterY, playerCenterX, playerCenterY);
        const phaseRange = BossPhaseSystem.getShotPhase(item.getHealthPoints());
        const angle = phaseRange.minAngle + Math.random() * (phaseRange.maxAngle - phaseRange.minAngle);
        const angleInRadians = (angle * Math.PI) / 180;
        const velocityX = Math.cos(angleInRadians) * phaseRange.bulletSpeed;
        const velocityY = Math.sin(angleInRadians) * phaseRange.bulletSpeed;
        const spreadVectors = BossPhaseSystem.createSpreadVectors(direction, velocityX, velocityY);
        spreadVectors.forEach((vector) => {
            this.gameItems.push(new EnemyBullet(this.canvas, mrHackerCenterX, mrHackerCenterY, vector.velocityX, vector.velocityY));
        });
        item.setTimeToShoot();
    }
    processPlayerCollisions(item, itemsToRemove, elapsed) {
        if (this.player.isPlayerColidingWithItem(item)
            && !(item instanceof Bullet)
            && !(item instanceof MrHacker)
            && !(item instanceof RVirus)
            && !(item instanceof Death)) {
            itemsToRemove.push(item);
            this.damegePlayer(item.getDamage());
        }
        if (this.player.isPlayerColidingWithItem(item) && item instanceof RVirus) {
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
    }
    processProjectileCulling(item, itemsToRemove) {
        if (item instanceof EnemyBullet || item instanceof Bullet) {
            if (item.getPosX() < this.minX * GameConfig.BULLET_CULL_MIN_MULTIPLIER
                || item.getPosX() > this.maxX * GameConfig.BULLET_CULL_MAX_MULTIPLIER
                || item.getPosY() < this.minY * GameConfig.BULLET_CULL_MIN_MULTIPLIER
                || item.getPosY() > this.maxY * GameConfig.BULLET_CULL_MAX_MULTIPLIER) {
                itemsToRemove.push(item);
            }
        }
    }
    processBulletCollisions(item, itemsToRemove, deathItemsToAdd) {
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
                this.addTrojanSpawnPack(item.getPosX(), item.getPosY());
            }
        }
    }
    processTrojanBreach(item, itemsToRemove) {
        if (item instanceof Trojan && item.getPosX() < this.minX) {
            itemsToRemove.push(item);
            this.damegePlayer(item.getDamage());
            this.addTrojanSpawnPack(item.getPosX(), item.getPosY());
        }
    }
    addTrojanSpawnPack(posX, posY) {
        this.gameItems.push(new FEmail(this.canvas, posX + 100, posY + 30));
        this.gameItems.push(new RVirus(this.canvas, posX + 100, posY - 30));
        this.gameItems.push(new Worm(this.canvas, posX + 100, posY + 30));
    }
    finalizeFrame(elapsed, itemsToRemove, deathItemsToAdd) {
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
}
//# sourceMappingURL=Level.js.map