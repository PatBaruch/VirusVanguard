import GameItem from '../GameItem.js';
import CanvasRenderer from '../CanvasRenderer.js';


export default class Trojan extends GameItem {
  private canvas: HTMLCanvasElement;
  private currentImageIndex: number = 0;
  private maxX: number;

  private maxY: number;

  private minX: number;

  private minY: number;

  private speedX: number;

  private speedY: number;

  private timeToChangeImage: number;
  public constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.image = CanvasRenderer.loadNewImage('../assets/Trojan-Sprite/Hsprite_0.png');
    this.posX = canvas.width * 0.89;
    this.posY = Math.random() * canvas.height * 0.76 + canvas.height * 0.1;
    this.maxX = canvas.width * 0.94;
    this.maxY = canvas.height * 0.92;
    this.minX = canvas.width * 0.05;
    this.minY = canvas.height * 0.1;
    this.speedX = Math.random() > 0.7 ? -(0.4 / 2): -(0.4 / 2) * 0.7;
    this.timeToChangeImage = 0;
    this.damage = 5;
    this.score = 10;
  }

  /**
   * Gets the score of the Trojan.
   * @returns The score of the Trojan.
   */
  public override getScore(): number {
    return this.score;
  }

  /**
   * Updates the Trojan game item.
   * @param elapsed - The elapsed time.
   */
  public override update(elapsed: number): void {
    const images: string[] = [
      '../assets/Trojan-Sprite/Hsprite_0.png',
      '../assets/Trojan-Sprite/Hsprite_1.png',
    ];
    if (this.timeToChangeImage <= 0) {
      this.timeToChangeImage = 150;
      this.currentImageIndex += 1;
      if (this.currentImageIndex >= images.length) {
        this.currentImageIndex = 0;
      }
      this.image = CanvasRenderer.loadNewImage(images[this.currentImageIndex]);
    }
    this.timeToChangeImage -= elapsed;
    this.posX += this.speedX * elapsed;
  }
}
