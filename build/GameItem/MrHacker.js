import GameItem from '../GameItem.js';
import CanvasRenderer from '../CanvasRenderer.js';
export default class MrHacker extends GameItem {
    canvas;
    changeDir = 0;
    currentImageIndex = 0;
    maxX;
    maxY;
    minX;
    minY;
    speedX;
    speedY;
    timeToChangeImage;
    timeToShoot = 500 + Math.random() * 500;
    healthPoints = 25;
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.image = CanvasRenderer.loadNewImage('../assets/Hacker-Sprite/Hacksprite_0.png');
        this.posX = canvas.width * 0.7;
        this.posY = canvas.height * 0.43;
        this.maxX = canvas.width * 0.94;
        this.maxY = canvas.height * 0.92;
        this.minX = canvas.width * 0.05;
        this.minY = canvas.height * 0.1;
        this.speedX = 0;
        this.speedY = -(0.5 / 2);
        this.timeToChangeImage = 0;
        this.damage = 20;
        this.score = 100;
    }
    decreaseHealth() {
        this.healthPoints -= 1;
    }
    getHealthPoints() {
        return this.healthPoints;
    }
    getScore() {
        return this.score;
    }
    isTimeToShoot() {
        if (this.timeToShoot <= 0) {
            return true;
        }
        else {
            return false;
        }
    }
    setTimeToShoot() {
        this.timeToShoot = 100 + Math.random() * 500;
    }
    update(elapsed) {
        const images = [
            '../assets/Hacker-Sprite/Hacksprite_0.png',
            '../assets/Hacker-Sprite/Hacksprite_1.png',
            '../assets/Hacker-Sprite/Hacksprite_2.png',
        ];
        if (this.timeToChangeImage <= 0) {
            this.timeToChangeImage = 150;
            this.currentImageIndex += 1;
            if (this.currentImageIndex >= images.length) {
                this.currentImageIndex = 0;
            }
            this.image = CanvasRenderer.loadNewImage(images[this.currentImageIndex]);
        }
        this.timeToChangeImage -= elapsed;
        this.changeDir += elapsed;
        this.posX += this.speedX * elapsed;
        this.posY += this.speedY * elapsed;
        this.timeToShoot -= elapsed;
        if (Math.random() > 0.99) {
            this.speedY *= -1;
        }
        if (Math.random() > 0.99) {
            this.speedX *= Math.random() > 0.5 ? -1.1 : -0.9;
        }
        if (Math.random() > 0.99) {
            this.speedY *= Math.random() > 0.5 ? -1.1 : -0.9;
        }
        if (this.posY < this.minY) {
            this.posY = this.minY;
            this.speedY *= -1;
        }
        if (this.posY > this.maxY - this.image.height) {
            this.posY = this.maxY - this.image.height;
            this.speedY *= -1;
        }
        if (this.posX < this.maxX / 1.5) {
            this.posX = this.maxX / 1.5;
            this.speedX *= -1;
        }
        if (this.posX > this.maxX / 1.2 - this.image.width) {
            this.posX = this.maxX / 1.2 - this.image.height;
            this.speedX *= -1;
        }
    }
}
//# sourceMappingURL=MrHacker.js.map