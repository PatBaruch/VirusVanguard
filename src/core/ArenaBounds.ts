import type { RatioRect, Rect } from '../types/Geometry.js';

export default class ArenaBounds {
  public static fromRatioRect(
    canvas: HTMLCanvasElement,
    ratioRect: RatioRect,
    widthOffset: number = 0,
    heightOffset: number = 0,
  ): Rect {
    return {
      left: canvas.width * ratioRect.left,
      top: canvas.height * ratioRect.top,
      right: canvas.width * ratioRect.right - widthOffset,
      bottom: canvas.height * ratioRect.bottom - heightOffset,
    };
  }
}
