import GameItem from '../GameItem.js';
import CanvasRenderer from '../CanvasRenderer.js';
import Player from '../Player.js';


export default class RVirus extends GameItem {
  private canvas: HTMLCanvasElement;
  private currentImageIndex: number = 0;
  private followingPlayer: boolean = false;
  private healthPoints: number = 5;
  private maxX: number;

  private maxY: number;

  private minX: number;

  private minY: number;
  private player: Player | null = null;
  private speedX: number;

  private speedY: number;

  private startspeedX: number;

  private startspeedY: number;

  private timeToChangeImage: number;
  public constructor(canvas: HTMLCanvasElement, startX: number, startY: number) {
    super();
    this.canvas = canvas;
    this.image = CanvasRenderer.loadNewImage('../assets/Resident-Sprite/Rsprite_0.png');
    this.posX = startX;
    this.posY = startY;
    this.maxX = canvas.width * 0.94;
    this.maxY = canvas.height * 0.92;
    this.minX = canvas.width * 0.05;
    this.minY = canvas.height * 0.1;
    this.startspeedX = -(1.2 / 2);
    this.startspeedY = -(0.4 / 2);
    this.speedX = Math.random() > 0.5 ? (1 / 2) : -(1 / 2);
    this.speedY = Math.random() > 0.5 ? (0.3 / 2) : -(0.3 / 2);
    this.timeToChangeImage = 0;
    this.damage = 5;
    this.score = 10;
  }

  /**
   * Decreases the health points of the RVirus game item.
   */
  public decreaseHealth(): void {
    this.healthPoints -= 1;
  }

  /**
   * Retrieves the health points of the RVirus.
   * @returns The health points of the RVirus.
   */
  public getHealthPoints(): number {
    return this.healthPoints;
  }

  public override getPosX(): number {
    return this.posX;
  }

  public override getPosY(): number {
    return this.posY;
  }

  public override getScore(): number {
    return this.score;
  }

  /**
   * Sets the player that the RVirus should follow.
   * @param player The player to follow.
   */
  public setFollowingPlayer(player: Player): void {
    if (!this.followingPlayer) {
      this.followingPlayer = true;
      this.player = player;
      this.healthPoints = 10; // Set health points to 5 when followingPlayer is true
    }
  }

  /**
   * Updates the Resident Virus game item.
   * @param elapsed - The elapsed time.
   */
  public override update(elapsed: number): void {
    const images: string[] = [
      '../assets/Resident-Sprite/Rsprite_0.png',
      '../assets/Resident-Sprite/Rsprite_1.png',
      '../assets/Resident-Sprite/Rsprite_2.png',
    ];
    if (this.timeToChangeImage <= 0) {
      this.timeToChangeImage = 150;
      this.currentImageIndex += 1;
      if (this.currentImageIndex >= images.length) {
        this.currentImageIndex = 0;
      }
      this.image = CanvasRenderer.loadNewImage(images[this.currentImageIndex]);
    }
    if (this.followingPlayer && this.player) {
      // Update position based on the player's position
      this.posX = this.player.getPosX();
      this.posY = this.player.getPosY();
    } else {
      this.timeToChangeImage -= elapsed;
      this.posX += this.speedX * elapsed;
      this.posY += this.speedY * elapsed;
      if (this.posY < this.minY) { // Bounce from top edge
        this.posY = this.minY;
        if (this.speedY < 0) {
          this.speedY = -this.startspeedY;
        } else {
          this.speedY = this.startspeedY;
        }
        if (this.speedX < 0) {
          this.speedX = this.startspeedX;
        } else {
          this.speedX = -this.startspeedX;
        }
      }

      if (this.posY > this.maxY - this.image.height) { // Bounce from bottom edge
        this.posY = this.maxY - this.image.height;
        if (this.speedY < 0) {
          this.speedY = -this.startspeedY;
        } else {
          this.speedY = this.startspeedY;
        }
        if (this.speedX < 0) {
          this.speedX = this.startspeedX;
        } else {
          this.speedX = -this.startspeedX;
        }
      }

      if (this.posX < this.minX) { // Bounce from left edge
        this.posX = this.minX;
        this.speedX *= -1.8;
        this.speedY *= 1.3;
      }

      if (this.posX > this.maxX - this.image.width) { // Bounce from right edge
        this.posX = this.maxX - this.image.height;
        this.speedX *= -1.8;
        this.speedY *= 1.3;
      }
    }
  }
}

