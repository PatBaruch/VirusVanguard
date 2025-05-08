import GameItem from '../GameItem.js';
import CanvasRenderer from '../CanvasRenderer.js';
export default class Worm extends GameItem {
    canvas;
    currentImageIndex = 0;
    maxX;
    maxY;
    minX;
    minY;
    speedX;
    speedY;
    timeToChangeImage;
    constructor(canvas, posX, posY) {
        super();
        this.canvas = canvas;
        this.image = CanvasRenderer.loadNewImage('../assets/Worm-Sprite/Wsprite_0.png');
        this.posX = posX;
        this.posY = posY;
        this.maxX = canvas.width * 0.94;
        this.maxY = canvas.height * 0.92;
        this.minX = canvas.width * 0.05;
        this.minY = canvas.height * 0.1;
        this.speedX = -0.4 * Math.random() - 0.3;
        this.speedY = -0.2 * Math.random() - 0.3;
        this.timeToChangeImage = 0;
        this.damage = 5;
        this.score = 10;
    }
    getScore() {
        return this.score;
    }
    update(elapsed) {
        const images = [
            '../assets/Worm-Sprite/Wsprite_0.png',
            '../assets/Worm-Sprite/Wsprite_1.png',
            '../assets/Worm-Sprite/Wsprite_2.png',
            '../assets/Worm-Sprite/Wsprite_3.png',
            '../assets/Worm-Sprite/Wsprite_4.png',
            '../assets/Worm-Sprite/Wsprite_5.png',
            '../assets/Worm-Sprite/Wsprite_6.png',
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
        this.posX += this.speedX * elapsed;
        this.posY += this.speedY * elapsed;
        if (this.posY < this.minY) {
            this.posY = this.minY;
            this.speedY *= -Math.random() < 0.8 ? -0.8 : -Math.random() * 1.25;
        }
        if (this.posY > this.maxY - this.image.height) {
            this.posY = this.maxY - this.image.height;
            this.speedY *= -Math.random() < 0.8 ? -0.8 : -Math.random() * 1.25;
        }
        if (this.posX < this.minX) {
            this.posX = this.minX;
            this.speedX *= -Math.random() < 0.8 ? -0.8 : -Math.random() * 1.25;
        }
        if (this.posX > this.maxX - this.image.width) {
            this.posX = this.maxX - this.image.height;
            this.speedX *= -Math.random() < 0.8 ? -0.8 : -Math.random() * 1.25;
        }
    }
}
//# sourceMappingURL=Worm.js.map