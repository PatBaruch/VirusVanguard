export default interface Renderer {
  clear(canvas: HTMLCanvasElement): void;

  drawOverlay(canvas: HTMLCanvasElement, color: string): void;

  drawText(
    canvas: HTMLCanvasElement,
    text: string,
    x: number,
    y: number,
    align?: CanvasTextAlign,
    fontFamily?: string,
    fontSize?: number,
    color?: string,
  ): void;
}
