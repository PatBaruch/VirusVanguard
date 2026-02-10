export default class TransientUiSystem {
    static updatePopups(popups, elapsed, risePerMs) {
        return popups
            .map((popup) => ({
            ...popup,
            ttl: popup.ttl - elapsed,
            y: popup.y - risePerMs * elapsed,
        }))
            .filter((popup) => popup.ttl > 0);
    }
}
//# sourceMappingURL=TransientUiSystem.js.map