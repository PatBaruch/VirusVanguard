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
export default class Level {
    duplicateCount = 0;
    enemyCount = 0;
    hpDecreaseTimer = 0;
    isGameOver = false;
    isLoaded = false;
    isMrHackerAlive = true;
    mrHackerHealthBarImage;
    restart = false;
    rvirusStuckToPlayer = false;
    timeSinceStart = 0;
    timeToSpawnEnemyOnMrHacker = 3000;
    canvas;
    currentLevel;
    gameItems = [];
    hasStarted = false;
    ifWin = false;
    maxX;
    maxY;
    minX;
    minY;
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
    }
    startLevel() {
        this.spawnNextItem();
    }
    damegePlayer(damage) {
        this.playerHealth -= damage;
    }
    getPlayerHealth() {
        return this.playerHealth;
    }
    isGameWon() {
        return false;
    }
    processInput(keyListener) {
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
            if (keyListener.keyPressed(KeyListener.KEY_SPACE) && this.currentLevel !== 0) {
                this.shoot();
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
            CanvasRenderer.drawImage(canvas, this.mrHackerHealthBarImage, this.canvas.width / 2 - 480, this.canvas.height / 2 - 968);
        }
        if (this.playerHealth <= 0) {
            CanvasRenderer.writeText(canvas, 'Game Over', canvas.width / 2, canvas.height / 2, 'center', 'Copperplate', 100, 'Red');
            CanvasRenderer.writeText(canvas, `Score: ${this.score}`, canvas.width / 2, canvas.height / 2 + 100, 'center', 'Copperplate', 100, 'Red');
            CanvasRenderer.writeText(canvas, 'Press space to restart the game', canvas.width / 2, canvas.height / 2 + 200, 'center', 'Copperplate', 100, 'Red');
            this.isGameOver = true;
        }
        else {
            this.player.render(canvas);
            CanvasRenderer.writeText(canvas, `Health: ${this.playerHealth}`, 50, 50, 'left', 'Copperplate', 60, 'white');
            CanvasRenderer.writeText(canvas, `Level: ${this.currentLevel}`, 50, 120, 'left', 'Copperplate', 60, 'Chartreuse');
            this.gameItems.forEach((item) => {
                item.render(canvas);
            });
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
        const speed = 2;
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
        if (!(this.isGameOver || this.isGameWon())) {
            this.multiplier *= 0.9999;
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
                    this.timeToSpawnEnemyOnMrHacker = 3000;
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
                    const angle = 10 + Math.random() * 45;
                    const angleInRadians = (angle * Math.PI) / 180;
                    const speed = 1;
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
                }
                else {
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
}
//# sourceMappingURL=Level.js.map