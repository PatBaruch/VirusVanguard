import Worm from '../../GameItem/Worm.js';
export default class WormDuplicationSystem {
    static shouldDuplicate(level, levelTimer, score) {
        if (level === 3) {
            return levelTimer >= 2000 && score < 600;
        }
        if (level === 4) {
            return levelTimer >= 3000 && score < 1000;
        }
        return false;
    }
    static createDuplicates(canvas, items) {
        const newWorms = [];
        items.forEach((item) => {
            if (item instanceof Worm) {
                newWorms.push(new Worm(canvas, item.getPosX(), item.getPosY()));
            }
        });
        return newWorms;
    }
}
//# sourceMappingURL=WormDuplicationSystem.js.map