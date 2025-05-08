import CanvasRenderer from '../CanvasRenderer.js';
import GameItem from '../GameItem.js';
export default class Bullet extends GameItem {
    canvas;
    currentImageIndex = 0;
    maxX;
    maxY;
    minX;
    minY;
    speedX;
    speedY;
    timeToChangeImage;
    constructor(canvas, startX, startY, speedX, speedY) {
        super();
        this.canvas = canvas;
        this.image = CanvasRenderer.loadNewImage('../assets/Bullet-Sprite/PBsprite_0.png');
        this.posX = startX - this.image.width / 2;
        this.posY = startY - this.image.height / 2;
        this.maxX = canvas.width * 0.94;
        this.maxY = canvas.height * 0.92;
        this.minX = canvas.width * 0.05;
        this.minY = canvas.height * 0.1;
        this.speedX = speedX;
        this.speedY = speedY;
        this.timeToChangeImage = 0;
    }
    getScore() {
        return 0;
    }
    isBulletColidingWithItem(item) {
        const itemX = item.getPosX();
        const itemY = item.getPosY();
        const itemWidth = item.getWidth();
        const itemHeight = item.getHeight();
        const bulletX = this.getPosX();
        const bulletY = this.getPosY();
        const bulletWidth = this.getWidth();
        const bulletHeight = this.getHeight();
        if (bulletX + bulletWidth > itemX && bulletX < itemX + itemWidth
            && bulletY + bulletHeight > itemY && bulletY < itemY + itemHeight) {
            return true;
        }
        return false;
    }
    update(elapsed) {
        const images = [
            '../assets/Bullet-Sprite/PBsprite_0.png',
            '../assets/Bullet-Sprite/PBsprite_1.png',
            '../assets/Bullet-Sprite/PBsprite_2.png',
            '../assets/Bullet-Sprite/PBsprite_3.png',
            '../assets/Bullet-Sprite/PBsprite_4.png',
        ];
        if (this.timeToChangeImage <= 0) {
            this.timeToChangeImage = 75;
            this.currentImageIndex += 1;
            if (this.currentImageIndex >= images.length) {
                this.currentImageIndex = 0;
            }
            this.image = CanvasRenderer.loadNewImage(images[this.currentImageIndex]);
        }
        this.timeToChangeImage -= elapsed;
        this.posX += this.speedX * elapsed;
        this.posY += this.speedY * elapsed;
    }
}
//# sourceMappingURL=Bullet.js.map