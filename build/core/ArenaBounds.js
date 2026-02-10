export default class ArenaBounds {
    static fromRatioRect(canvas, ratioRect, widthOffset = 0, heightOffset = 0) {
        return {
            left: canvas.width * ratioRect.left,
            top: canvas.height * ratioRect.top,
            right: canvas.width * ratioRect.right - widthOffset,
            bottom: canvas.height * ratioRect.bottom - heightOffset,
        };
    }
}
//# sourceMappingURL=ArenaBounds.js.map