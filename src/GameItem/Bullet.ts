import CanvasRenderer from '../CanvasRenderer.js';
import GameItem from '../GameItem.js';

export default class Bullet extends GameItem {
  private canvas: HTMLCanvasElement;
  private currentImageIndex: number = 0;
  private maxX: number;
  private maxY: number;
  private minX: number;
  private minY: number;
  private speedX: number;
  private speedY: number;
  private timeToChangeImage: number;

  public constructor(canvas: HTMLCanvasElement, startX: number,
    startY: number, speedX: number, speedY: number) {
    super();
    this.canvas = canvas;
    this.image = CanvasRenderer.loadNewImage( '../assets/Bullet-Sprite/PBsprite_0.png');
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

  /**
   * Retrieves the score value of the bullet.
   * @returns The score value of the bullet.
   */
  public override getScore(): number {
    return 0;
  }

  /**
   * Checks if the bullet is colliding with the given game item.
   * @param item - The game item to check collision with.
   * @returns True if the bullet is colliding with the item, false otherwise.
   */
  public isBulletColidingWithItem(item: GameItem): boolean {
    const itemX: number = item.getPosX();
    const itemY: number = item.getPosY();
    const itemWidth: number = item.getWidth();
    const itemHeight: number = item.getHeight();

    const bulletX: number = this.getPosX();
    const bulletY: number = this.getPosY();
    const bulletWidth: number = this.getWidth();
    const bulletHeight: number = this.getHeight();

    if (bulletX + bulletWidth > itemX && bulletX < itemX + itemWidth
      && bulletY + bulletHeight > itemY && bulletY < itemY + itemHeight) {
      return true;
    }
    return false;
  }

  /**
   * Updates the FEmail game item.
   * @param elapsed - The elapsed time.
   */
  public override update(elapsed: number): void {
    const images: string[] = [
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
