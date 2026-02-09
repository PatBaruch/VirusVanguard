import GameItem from '../GameItem.js';
import CanvasRenderer from '../CanvasRenderer.js';
import ArenaBounds from '../core/ArenaBounds.js';
import { ENEMY_ARENA_RATIO } from '../config/ArenaConfig.js';
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
        const bounds = ArenaBounds.fromRatioRect(canvas, ENEMY_ARENA_RATIO);
        this.maxX = bounds.right;
        this.maxY = bounds.bottom;
        this.minX = bounds.left;
        this.minY = bounds.top;
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