export interface ViewportResult {
  scale: number;
  renderWidth: number;
  renderHeight: number;
  offsetX: number;
  offsetY: number;
}

export default class Viewport {
  public static calculate(
    windowWidth: number,
    windowHeight: number,
    virtualWidth: number,
    virtualHeight: number,
  ): ViewportResult {
    const scale: number = Math.min(windowWidth / virtualWidth, windowHeight / virtualHeight);
    const renderWidth: number = Math.floor(virtualWidth * scale);
    const renderHeight: number = Math.floor(virtualHeight * scale);
    const offsetX: number = Math.floor((windowWidth - renderWidth) / 2);
    const offsetY: number = Math.floor((windowHeight - renderHeight) / 2);

    return {
      scale,
      renderWidth,
      renderHeight,
      offsetX,
      offsetY,
    };
  }
}
