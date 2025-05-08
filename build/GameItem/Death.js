import GameItem from '../GameItem.js';
import CanvasRenderer from '../CanvasRenderer.js';
export default class Death extends GameItem {
    canvas;
    currentImageIndex = 0;
    images = [];
    level;
    maxX;
    maxY;
    minX;
    minY;
    speedX;
    speedY;
    timeToChangeImage;
    constructor(level, canvas, startX, startY) {
        super();
        this.level = level;
        this.canvas = canvas;
        this.image = CanvasRenderer.loadNewImage('../assets/Death-Sprite/DeathSprite_0.png');
        this.posX = startX;
        this.posY = startY;
        this.maxX = canvas.width * 0.94;
        this.maxY = canvas.height * 0.92;
        this.minX = canvas.width * 0.05;
        this.minY = canvas.height * 0.1;
        this.timeToChangeImage = 0;
    }
    getScore() {
        return this.score;
    }
    isAnimationDone() {
        return this.currentImageIndex >= this.images.length;
    }
    update(elapsed) {
        this.images = [
            '../assets/Death-Sprite/DeathSprite_0.png',
            '../assets/Death-Sprite/DeathSprite_1.png',
            '../assets/Death-Sprite/DeathSprite_2.png',
            '../assets/Death-Sprite/DeathSprite_3.png',
        ];
        if (this.timeToChangeImage <= 0) {
            if (this.currentImageIndex >= this.images.length) {
                this.currentImageIndex = 0;
            }
            this.image = CanvasRenderer.loadNewImage(this.images[this.currentImageIndex]);
            this.timeToChangeImage = 150;
            this.currentImageIndex += 1;
        }
        this.timeToChangeImage -= elapsed;
        if (this.currentImageIndex >= this.images.length) {
            this.level.removeGameItem(this);
        }
    }
}
//# sourceMappingURL=Death.js.map