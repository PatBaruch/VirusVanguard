import GameItem from '../GameItem.js';
import CanvasRenderer from '../CanvasRenderer.js';
import Level from '../Level.js';


export default class Death extends GameItem {
  private canvas: HTMLCanvasElement;
  private currentImageIndex: number = 0;
  private images: string[] = [];
  private level: Level;

  private maxX: number;

  private maxY: number;

  private minX: number;

  private minY: number;

  private speedX: number;

  private speedY: number;

  private timeToChangeImage: number;
  public constructor(level: Level, canvas: HTMLCanvasElement, startX: number, startY: number) {
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

  /**
   * Gets the score of the Death game item.
   * @returns The score of the Death game item.
   */
  public override getScore(): number {
    return this.score;
  }

  /**
   * Checks if the animation is done.
   * @returns True if the animation is done, false otherwise.
   */
  public isAnimationDone(): boolean {
    return this.currentImageIndex >= this.images.length;
  }

  /**
   * Updates the FEmail game item.
   * @param elapsed - The elapsed time.
   */
  public override update(elapsed: number): void {
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

