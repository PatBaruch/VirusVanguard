import CanvasItem from './CanvasItem.js';
import CanvasRenderer from './CanvasRenderer.js';
export default class Player extends CanvasItem {
    playerDirection;
    constructor() {
        super();
        this.image = CanvasRenderer.loadNewImage('/assets/player-E.png');
        this.posX = 180;
        this.posY = 490;
        this.playerDirection = 'E';
    }
    getDirection() {
        return this.playerDirection;
    }
    isPlayerColidingWithItem(item) {
        const itemX = item.getPosX();
        const itemY = item.getPosY();
        const itemWidth = item.getWidth();
        const itemHeight = item.getHeight();
        const playerX = this.posX;
        const playerY = this.posY;
        const playerWidth = this.getWidth();
        const playerHeight = this.getHeight();
        if (itemX < playerX + playerWidth && itemX + itemWidth > playerX) {
            if (itemY < playerY + playerHeight && itemY + itemHeight > playerY) {
                return true;
            }
        }
        return false;
    }
    moveDiagonallyLeftDown() {
        this.posX -= 6 / Math.sqrt(2);
        this.posY += 6 / Math.sqrt(2);
        this.image = CanvasRenderer.loadNewImage('./assets/player-SW.png');
        this.playerDirection = 'SW';
    }
    moveDiagonallyLefttUp() {
        this.posX -= 6 / Math.sqrt(2);
        this.posY -= 6 / Math.sqrt(2);
        this.image = CanvasRenderer.loadNewImage('./assets/player-NW.png');
        this.playerDirection = 'NW';
    }
    moveDiagonallyRightDown() {
        this.posX += 6 / Math.sqrt(2);
        this.posY += 6 / Math.sqrt(2);
        this.image = CanvasRenderer.loadNewImage('./assets/player-SE.png');
        this.playerDirection = 'SE';
    }
    moveDiagonallyRightUp() {
        this.posX += 6 / Math.sqrt(2);
        this.posY -= 6 / Math.sqrt(2);
        this.image = CanvasRenderer.loadNewImage('./assets/player-NE.png');
        this.playerDirection = 'NE';
    }
    moveDown() {
        this.posY += 6;
        this.image = CanvasRenderer.loadNewImage('./assets/player-S.png');
        this.playerDirection = 'S';
    }
    moveLeft() {
        this.posX -= 6;
        this.image = CanvasRenderer.loadNewImage('./assets/player-W.png');
        this.playerDirection = 'W';
    }
    moveRight() {
        this.posX += 6;
        this.image = CanvasRenderer.loadNewImage('./assets/player-E.png');
        this.playerDirection = 'E';
    }
    moveUp() {
        this.posY -= 6;
        this.image = CanvasRenderer.loadNewImage('./assets/player-N.png');
        this.playerDirection = 'N';
    }
}
//# sourceMappingURL=Player.js.map