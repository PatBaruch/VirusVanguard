import CanvasRenderer from './CanvasRenderer.js';
export default class CanvasItem {
    damage;
    image;
    posX;
    posY;
    getDamage() {
        return this.damage;
    }
    getHeight() {
        return this.image.height;
    }
    getPosX() {
        return this.posX;
    }
    getPosY() {
        return this.posY;
    }
    getWidth() {
        return this.image.width;
    }
    render(canvas) {
        CanvasRenderer.drawImage(canvas, this.image, this.posX, this.posY);
    }
}
//# sourceMappingURL=CanvasItem.js.map