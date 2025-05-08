import CanvasItem from './CanvasItem.js';

export default abstract class GameItem extends CanvasItem {
  protected score: number;
  protected speed: number;
  public constructor() {
    super();
    this.score = 0;
  }

  public abstract getScore(): number;

  /**
   *
   * @param elapsed time between ticks
   */
  public update(elapsed: number): void {
    this.posY += this.speed * elapsed;
  }
}
