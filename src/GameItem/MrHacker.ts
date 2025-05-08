import GameItem from '../GameItem.js';
import CanvasRenderer from '../CanvasRenderer.js';


export default class MrHacker extends GameItem {
  private canvas: HTMLCanvasElement;
  private changeDir: number = 0;
  private currentImageIndex: number = 0;
  private maxX: number;

  private maxY: number;

  private minX: number;

  private minY: number;

  private speedX: number;

  private speedY: number;
  private timeToChangeImage: number;
  private timeToShoot: number = 500 + Math.random() * 500;
  protected healthPoints: number = 25;
  public constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.image = CanvasRenderer.loadNewImage('../assets/Hacker-Sprite/Hacksprite_0.png');
    this.posX = canvas.width * 0.7;
    this.posY = canvas.height * 0.43;
    this.maxX = canvas.width * 0.94;
    this.maxY = canvas.height * 0.92;
    this.minX = canvas.width * 0.05;
    this.minY = canvas.height * 0.1;
    this.speedX = 0;
    this.speedY = -(0.5 / 2);
    this.timeToChangeImage = 0;
    this.damage = 20;
    this.score = 100;
  }

  /**
   * Decreases the health points of the MrHacker game item.
   */
  public decreaseHealth(): void {
    this.healthPoints -= 1;
  }

  /**
   * Returns the health points of the MrHacker game item.
   * @returns The health points of the MrHacker game item.
   */
  public getHealthPoints(): number {
    return this.healthPoints;
  }

  /**
   * Returns the score of the MrHacker object.
   * @returns The score of the MrHacker object.
   */
  public override getScore(): number {
    return this.score;
  }

  /**
   * Checks if it is time for the MrHacker game item to shoot.
   * @returns {boolean} - True if it is time to shoot, false otherwise.
   */
  public isTimeToShoot(): boolean {
    if (this.timeToShoot <= 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * set time to shoot
   */
  public setTimeToShoot(): void {
    this.timeToShoot = 100 + Math.random() * 500;
  }

  /**
   * Updates the MrHacker game item.
   * @param elapsed - The elapsed time.
   */
  public override update(elapsed: number): void {
    const images: string[] = [
      '../assets/Hacker-Sprite/Hacksprite_0.png',
      '../assets/Hacker-Sprite/Hacksprite_1.png',
      '../assets/Hacker-Sprite/Hacksprite_2.png',
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
    this.changeDir += elapsed;
    this.posX += this.speedX * elapsed;
    this.posY += this.speedY * elapsed;
    this.timeToShoot -= elapsed;

    if (Math.random() > 0.99) { // Randomly invert speedY
      this.speedY *= -1;
    }

    if (Math.random() > 0.99) { // Randomly increase or decrease speedX
      this.speedX *= Math.random() > 0.5 ? -1.1 : -0.9;
    }

    if (Math.random() > 0.99) { // Randomly increase or decrease speedY
      this.speedY *= Math.random() > 0.5 ? -1.1 : -0.9;
    }

    if (this.posY < this.minY) { // Bounce from top edge
      this.posY = this.minY;
      this.speedY *= -1;
    }

    if (this.posY > this.maxY - this.image.height) { // Bounce from bottom edge
      this.posY = this.maxY - this.image.height;
      this.speedY *= -1;
    }

    if (this.posX < this.maxX / 1.5) { // Bounce from left edge
      this.posX = this.maxX / 1.5;
      this.speedX *= -1;
    }

    if (this.posX > this.maxX / 1.2 - this.image.width) { // Bounce from right edge
      this.posX = this.maxX / 1.2 - this.image.height;
      this.speedX *= -1;
    }
  }
}
