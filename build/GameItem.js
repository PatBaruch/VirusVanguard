import CanvasItem from './CanvasItem.js';
export default class GameItem extends CanvasItem {
    score;
    speed;
    constructor() {
        super();
        this.score = 0;
    }
    update(elapsed) {
        this.posY += this.speed * elapsed;
    }
}
//# sourceMappingURL=GameItem.js.map