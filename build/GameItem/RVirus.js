import GameItem from '../GameItem.js';
import CanvasRenderer from '../CanvasRenderer.js';
export default class RVirus extends GameItem {
    canvas;
    currentImageIndex = 0;
    followingPlayer = false;
    healthPoints = 5;
    maxX;
    maxY;
    minX;
    minY;
    player = null;
    speedX;
    speedY;
    startspeedX;
    startspeedY;
    timeToChangeImage;
    constructor(canvas, startX, startY) {
        super();
        this.canvas = canvas;
        this.image = CanvasRenderer.loadNewImage('../assets/Resident-Sprite/Rsprite_0.png');
        this.posX = startX;
        this.posY = startY;
        this.maxX = canvas.width * 0.94;
        this.maxY = canvas.height * 0.92;
        this.minX = canvas.width * 0.05;
        this.minY = canvas.height * 0.1;
        this.startspeedX = -(1.2 / 2);
        this.startspeedY = -(0.4 / 2);
        this.speedX = Math.random() > 0.5 ? (1 / 2) : -(1 / 2);
        this.speedY = Math.random() > 0.5 ? (0.3 / 2) : -(0.3 / 2);
        this.timeToChangeImage = 0;
        this.damage = 5;
        this.score = 10;
    }
    decreaseHealth() {
        this.healthPoints -= 1;
    }
    getHealthPoints() {
        return this.healthPoints;
    }
    getPosX() {
        return this.posX;
    }
    getPosY() {
        return this.posY;
    }
    getScore() {
        return this.score;
    }
    setFollowingPlayer(player) {
        if (!this.followingPlayer) {
            this.followingPlayer = true;
            this.player = player;
            this.healthPoints = 10;
        }
    }
    update(elapsed) {
        const images = [
            '../assets/Resident-Sprite/Rsprite_0.png',
            '../assets/Resident-Sprite/Rsprite_1.png',
            '../assets/Resident-Sprite/Rsprite_2.png',
        ];
        if (this.timeToChangeImage <= 0) {
            this.timeToChangeImage = 150;
            this.currentImageIndex += 1;
            if (this.currentImageIndex >= images.length) {
                this.currentImageIndex = 0;
            }
            this.image = CanvasRenderer.loadNewImage(images[this.currentImageIndex]);
        }
        if (this.followingPlayer && this.player) {
            this.posX = this.player.getPosX();
            this.posY = this.player.getPosY();
        }
        else {
            this.timeToChangeImage -= elapsed;
            this.posX += this.speedX * elapsed;
            this.posY += this.speedY * elapsed;
            if (this.posY < this.minY) {
                this.posY = this.minY;
                if (this.speedY < 0) {
                    this.speedY = -this.startspeedY;
                }
                else {
                    this.speedY = this.startspeedY;
                }
                if (this.speedX < 0) {
                    this.speedX = this.startspeedX;
                }
                else {
                    this.speedX = -this.startspeedX;
                }
            }
            if (this.posY > this.maxY - this.image.height) {
                this.posY = this.maxY - this.image.height;
                if (this.speedY < 0) {
                    this.speedY = -this.startspeedY;
                }
                else {
                    this.speedY = this.startspeedY;
                }
                if (this.speedX < 0) {
                    this.speedX = this.startspeedX;
                }
                else {
                    this.speedX = -this.startspeedX;
                }
            }
            if (this.posX < this.minX) {
                this.posX = this.minX;
                this.speedX *= -1.8;
                this.speedY *= 1.3;
            }
            if (this.posX > this.maxX - this.image.width) {
                this.posX = this.maxX - this.image.height;
                this.speedX *= -1.8;
                this.speedY *= 1.3;
            }
        }
    }
}
//# sourceMappingURL=RVirus.js.map