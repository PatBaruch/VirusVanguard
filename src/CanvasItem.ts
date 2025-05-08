import CanvasRenderer from './CanvasRenderer.js';

export default abstract class CanvasItem {
  protected damage: number;
  protected image: HTMLImageElement;

  protected posX: number;

  protected posY: number;

  /**
   * Returns the damage value of the CanvasItem.
   * @returns The damage value.
   */
  public getDamage(): number {
    return this.damage;
  }

  /**
   * Returns the height of the CanvasItem.
   * @returns The height of the CanvasItem.
   */
  public getHeight(): number {
    return this.image.height;
  }

  /**
   * Returns the X position of the CanvasItem.
   * @returns The X position of the CanvasItem.
   */
  public getPosX(): number {
    return this.posX;
  }

  /**
   * Returns the y-coordinate of the CanvasItem.
   * @returns The y-coordinate of the CanvasItem.
   */
  public getPosY(): number {
    return this.posY;
  }

  /**
   * Returns the width of the CanvasItem.
   * @returns The width of the CanvasItem.
   */
  public getWidth(): number {
    return this.image.width;
  }

  /**
   *
   * @param canvas canvas on which the image will be rendered on
   */
  public render(canvas: HTMLCanvasElement): void {
    CanvasRenderer.drawImage(canvas, this.image, this.posX, this.posY);
  }
}
