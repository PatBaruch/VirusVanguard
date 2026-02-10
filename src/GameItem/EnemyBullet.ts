import CanvasRenderer from "../CanvasRenderer.js";
import GameItem from "../GameItem.js";
import ArenaBounds from '../core/ArenaBounds.js';
import { ENEMY_ARENA_RATIO } from '../config/ArenaConfig.js';

export default class EnemyBullet extends GameItem {

  private canvas: HTMLCanvasElement;
  private currentImageIndex: number = 0;
  private maxX: number;

  private maxY: number;

  private minX: number;

  private minY: number;

  private speedX: number;

  private speedY: number;

  private timeToChangeImage: number;
  /**
   * Updates the FEmail game item.
   * @param canvas - The HTML canvas element.
   * @param startX - The starting x position.
   * @param startY - The starting y position.
   * @param speedX - The speed in the x direction.
   * @param speedY - The speed in the y direction.
   * @param type - The type of bullet.
   */
  public constructor(canvas: HTMLCanvasElement, startX: number,
    startY: number, speedX: number, speedY: number,) {
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

  public override getScore(): number {
    return 0;
  }

  public override update(elapsed: number): void {
    const images: string[] = [
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
