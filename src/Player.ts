import CanvasItem from './CanvasItem.js';
import CanvasRenderer from './CanvasRenderer.js';
import GameItem from './GameItem.js';

/**
 * Represents a player on the canvas.
 */
export default class Player extends CanvasItem {
  private playerDirection: string;

  /**
   * Initializes a new instance of the Player class.
   * @param {number} health - The initial health of the player.
   */
  public constructor() {
    super();
    this.image = CanvasRenderer.loadNewImage('/assets/player-E.png');
    this.posX = 180;
    this.posY = 490;
    this.playerDirection = 'E';
  }

  public getDirection(): string {
    return this.playerDirection;
  }

  public isPlayerColidingWithItem(item: GameItem): boolean {
    const itemX: number = item.getPosX();
    const itemY: number = item.getPosY();
    const itemWidth: number = item.getWidth();
    const itemHeight: number = item.getHeight();

    const playerX: number = this.posX;
    const playerY: number = this.posY;
    const playerWidth: number = this.getWidth();
    const playerHeight: number = this.getHeight();

    if(itemX < playerX + playerWidth && itemX + itemWidth > playerX) {
      if(itemY < playerY + playerHeight && itemY + itemHeight > playerY) {
        return true;
      }
    }
    return false;
  }

  public moveDiagonallyLeftDown(): void {
    this.posX -= 6 / Math.sqrt(2);
    this.posY += 6 / Math.sqrt(2);
    this.image = CanvasRenderer.loadNewImage('./assets/player-SW.png');
    this.playerDirection = 'SW';
  }

  public moveDiagonallyLefttUp(): void {
    this.posX -= 6 / Math.sqrt(2);
    this.posY -= 6 / Math.sqrt(2);
    this.image = CanvasRenderer.loadNewImage('./assets/player-NW.png');
    this.playerDirection = 'NW';
  }

  public moveDiagonallyRightDown(): void {
    this.posX += 6 / Math.sqrt(2);
    this.posY += 6 / Math.sqrt(2);
    this.image = CanvasRenderer.loadNewImage('./assets/player-SE.png');
    this.playerDirection = 'SE';
  }

  public moveDiagonallyRightUp(): void {
    this.posX += 6 / Math.sqrt(2);
    this.posY -= 6 / Math.sqrt(2);
    this.image = CanvasRenderer.loadNewImage('./assets/player-NE.png');
    this.playerDirection = 'NE';
  }

  /**
   * Moves the player downward and updates the direction.
   */
  public moveDown(): void {
    this.posY += 6;
    this.image = CanvasRenderer.loadNewImage('./assets/player-S.png');
    this.playerDirection = 'S';
  }

  /**
   * Moves the player to the left and updates the direction.
   */
  public moveLeft(): void {
    this.posX -= 6;
    this.image = CanvasRenderer.loadNewImage('./assets/player-W.png');
    this.playerDirection = 'W';
  }

  /**
   * Moves the player to the right and updates the direction.
   */
  public moveRight(): void {
    this.posX += 6;
    this.image = CanvasRenderer.loadNewImage('./assets/player-E.png');
    this.playerDirection = 'E';
  }

  /**
   * Moves the player upward and updates the direction.
   */
  public moveUp(): void {
    this.posY -= 6;
    this.image = CanvasRenderer.loadNewImage('./assets/player-N.png');
    this.playerDirection = 'N';
  }
}
