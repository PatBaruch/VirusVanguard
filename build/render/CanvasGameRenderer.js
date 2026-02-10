import CanvasRenderer from '../CanvasRenderer.js';
export default class CanvasGameRenderer {
    clear(canvas) {
        CanvasRenderer.clearCanvas(canvas);
    }
    drawOverlay(canvas, color) {
        CanvasRenderer.fillRectangle(canvas, 0, 0, canvas.width, canvas.height, color);
    }
    drawText(canvas, text, x, y, align = 'center', fontFamily = 'Copperplate', fontSize = 28, color = 'white') {
        CanvasRenderer.writeText(canvas, text, x, y, align, fontFamily, fontSize, color);
    }
}
//# sourceMappingURL=CanvasGameRenderer.js.map