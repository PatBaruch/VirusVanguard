import CanvasItem from './CanvasItem.js';
import CanvasRenderer from './CanvasRenderer.js';
import GameConfig from './config/GameConfig.js';
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
        this.posX -= GameConfig.PLAYER_DIAGONAL_SPEED;
        this.posY += GameConfig.PLAYER_DIAGONAL_SPEED;
        this.image = CanvasRenderer.loadNewImage('./assets/player-SW.png');
        this.playerDirection = 'SW';
    }
    moveDiagonallyLefttUp() {
        this.posX -= GameConfig.PLAYER_DIAGONAL_SPEED;
        this.posY -= GameConfig.PLAYER_DIAGONAL_SPEED;
        this.image = CanvasRenderer.loadNewImage('./assets/player-NW.png');
        this.playerDirection = 'NW';
    }
    moveDiagonallyRightDown() {
        this.posX += GameConfig.PLAYER_DIAGONAL_SPEED;
        this.posY += GameConfig.PLAYER_DIAGONAL_SPEED;
        this.image = CanvasRenderer.loadNewImage('./assets/player-SE.png');
        this.playerDirection = 'SE';
    }
    moveDiagonallyRightUp() {
        this.posX += GameConfig.PLAYER_DIAGONAL_SPEED;
        this.posY -= GameConfig.PLAYER_DIAGONAL_SPEED;
        this.image = CanvasRenderer.loadNewImage('./assets/player-NE.png');
        this.playerDirection = 'NE';
    }
    moveDown() {
        this.posY += GameConfig.PLAYER_CARDINAL_SPEED;
        this.image = CanvasRenderer.loadNewImage('./assets/player-S.png');
        this.playerDirection = 'S';
    }
    moveLeft() {
        this.posX -= GameConfig.PLAYER_CARDINAL_SPEED;
        this.image = CanvasRenderer.loadNewImage('./assets/player-W.png');
        this.playerDirection = 'W';
    }
    moveRight() {
        this.posX += GameConfig.PLAYER_CARDINAL_SPEED;
        this.image = CanvasRenderer.loadNewImage('./assets/player-E.png');
        this.playerDirection = 'E';
    }
    moveUp() {
        this.posY -= GameConfig.PLAYER_CARDINAL_SPEED;
        this.image = CanvasRenderer.loadNewImage('./assets/player-N.png');
        this.playerDirection = 'N';
    }
}
//# sourceMappingURL=Player.js.map