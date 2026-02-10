import CanvasRenderer from '../CanvasRenderer.js';
import type Renderer from './Renderer.js';

export default class CanvasGameRenderer implements Renderer {
  public clear(canvas: HTMLCanvasElement): void {
    CanvasRenderer.clearCanvas(canvas);
  }

  public drawOverlay(canvas: HTMLCanvasElement, color: string): void {
    CanvasRenderer.fillRectangle(canvas, 0, 0, canvas.width, canvas.height, color);
  }

  public drawText(
    canvas: HTMLCanvasElement,
    text: string,
    x: number,
    y: number,
    align: CanvasTextAlign = 'center',
    fontFamily: string = 'Copperplate',
    fontSize: number = 28,
    color: string = 'white',
  ): void {
    CanvasRenderer.writeText(canvas, text, x, y, align, fontFamily, fontSize, color);
  }
}
