import Worm from '../../GameItem/Worm.js';
import GameItem from '../../GameItem.js';

export default class WormDuplicationSystem {
  public static shouldDuplicate(level: number, levelTimer: number, score: number): boolean {
    if (level === 3) {
      return levelTimer >= 2000 && score < 600;
    }

    if (level === 4) {
      return levelTimer >= 3000 && score < 1000;
    }

    return false;
  }

  public static createDuplicates(canvas: HTMLCanvasElement, items: GameItem[]): Worm[] {
    const newWorms: Worm[] = [];

    items.forEach((item) => {
      if (item instanceof Worm) {
        newWorms.push(new Worm(canvas, item.getPosX(), item.getPosY()));
      }
    });

    return newWorms;
  }
}
