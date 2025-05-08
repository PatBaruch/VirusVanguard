import GameItem from '../GameItem.js';
import CanvasRenderer from '../CanvasRenderer.js';


export default class FEmail extends GameItem {
  private canvas: HTMLCanvasElement;
  private currentImageIndex: number = 0;
  private maxX: number;

  private maxY: number;

  private minX: number;

  private minY: number;

  private speedX: number;

  private speedY: number;

  private timeToChangeImage: number;
  public constructor(canvas: HTMLCanvasElement, startX: number, startY: number) {
    super();
    this.canvas = canvas;
    this.image = CanvasRenderer.loadNewImage('../assets/FishingMail-Sprite/FMsprite_00.png');
    this.posX = startX;
    this.posY = startY;
    this.maxX = canvas.width * 0.94;
    this.maxY = canvas.height * 0.92;
    this.minX = canvas.width * 0.05;
    this.minY = canvas.height * 0.1;
    this.speedX = Math.random() > 0.5 ? -(0.75 / 2): (0.75 / 2);
    this.speedY = Math.random() > 0.5 ? -(0.25 / 2): (0.25 / 2);
    this.timeToChangeImage = 0;
    this.damage = 5;
    this.score = 10;
  }

  public override getScore(): number {
    return this.score;
  }

  /**
   * Updates the FEmail game item.
   * @param elapsed - The elapsed time.
   */
  public override update(elapsed: number): void {
    const images: string[] = [
      '../assets/FishingMail-Sprite/FMsprite_00.png',
      '../assets/FishingMail-Sprite/FMsprite_01.png',
      '../assets/FishingMail-Sprite/FMsprite_02.png',
      '../assets/FishingMail-Sprite/FMsprite_03.png',
      '../assets/FishingMail-Sprite/FMsprite_04.png',
      '../assets/FishingMail-Sprite/FMsprite_05.png',
      '../assets/FishingMail-Sprite/FMsprite_06.png',
      '../assets/FishingMail-Sprite/FMsprite_07.png',
      '../assets/FishingMail-Sprite/FMsprite_08.png',
      '../assets/FishingMail-Sprite/FMsprite_09.png',
      '../assets/FishingMail-Sprite/FMsprite_10.png',
      '../assets/FishingMail-Sprite/FMsprite_11.png',
      '../assets/FishingMail-Sprite/FMsprite_12.png',
      '../assets/FishingMail-Sprite/FMsprite_13.png',
    ];
    if (this.timeToChangeImage <= 0) {
      if (this.currentImageIndex >= images.length) {
        this.currentImageIndex = 0;
      }
      this.image = CanvasRenderer.loadNewImage(images[this.currentImageIndex]);
      this.timeToChangeImage = 150;
      this.currentImageIndex += 1;
    }
    this.timeToChangeImage -= elapsed;
    this.posX += this.speedX * elapsed;
    this.posY += this.speedY * elapsed;
    if (this.posY < this.minY) { // Bounce from top edge
      this.posY = this.minY;
      this.speedY *= -1;
    }

    if (this.posY > this.maxY - this.image.height) { // Bounce from bottom edge
      this.posY = this.maxY - this.image.height;
      this.speedY *= -1;
    }

    if (this.posX < this.minX) { // Bounce from left edge
      this.posX = this.minX;
      this.speedX *= -1;
    }

    if (this.posX > this.maxX - this.image.width) { // Bounce from right edge
      this.posX = this.maxX - this.image.height;
      this.speedX *= -1;
    }
  }
}

