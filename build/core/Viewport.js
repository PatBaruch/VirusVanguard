export default class Viewport {
    static calculate(windowWidth, windowHeight, virtualWidth, virtualHeight) {
        const scale = Math.min(windowWidth / virtualWidth, windowHeight / virtualHeight);
        const renderWidth = Math.floor(virtualWidth * scale);
        const renderHeight = Math.floor(virtualHeight * scale);
        const offsetX = Math.floor((windowWidth - renderWidth) / 2);
        const offsetY = Math.floor((windowHeight - renderHeight) / 2);
        return {
            scale,
            renderWidth,
            renderHeight,
            offsetX,
            offsetY,
        };
    }
}
//# sourceMappingURL=Viewport.js.map