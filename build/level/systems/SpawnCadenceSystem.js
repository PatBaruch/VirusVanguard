export default class SpawnCadenceSystem {
    static calculateAdaptiveInterval(baseInterval, progress, acceleration, minimumInterval, multiplier = 1) {
        const normalizedProgress = Math.max(0, Math.min(1, progress));
        const accelerated = baseInterval * (1 - normalizedProgress * acceleration);
        const scaled = Math.round(accelerated * multiplier);
        return Math.max(minimumInterval, scaled);
    }
}
//# sourceMappingURL=SpawnCadenceSystem.js.map