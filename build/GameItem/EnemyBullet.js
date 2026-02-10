import CanvasRenderer from "../CanvasRenderer.js";
import GameItem from "../GameItem.js";
import ArenaBounds from '../core/ArenaBounds.js';
import { ENEMY_ARENA_RATIO } from '../config/ArenaConfig.js';
export default class EnemyBullet extends GameItem {
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
        this.image = CanvasRenderer.loadNewImage('./assets/HBullet_Sprite/HBsprite_1.png');
        this.posX = startX - this.image.width / 2;
        this.posY = startY - this.image.height / 2;
        const bounds = ArenaBounds.fromRatioRect(canvas, ENEMY_ARENA_RATIO);
        this.maxX = bounds.right;
        this.maxY = bounds.bottom;
        this.minX = bounds.left;
        this.minY = bounds.top;
        this.speedX = speedX;
        this.speedY = speedY;
        this.timeToChangeImage = 0;
        this.damage = 5;
    }
    getScore() {
        return 0;
    }
    update(elapsed) {
        const images = [
            './assets/HBullet_Sprite/HBsprite_1.png',
            './assets/HBullet_Sprite/HBsprite_2.png',
            './assets/HBullet_Sprite/HBsprite_3.png',
            './assets/HBullet_Sprite/HBsprite_4.png',
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
//# sourceMappingURL=EnemyBullet.js.map