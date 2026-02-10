export default class SpawnCadenceSystem {
  public static calculateAdaptiveInterval(
    baseInterval: number,
    progress: number,
    acceleration: number,
    minimumInterval: number,
    multiplier: number = 1,
  ): number {
    const normalizedProgress: number = Math.max(0, Math.min(1, progress));
    const accelerated: number = baseInterval * (1 - normalizedProgress * acceleration);
    const scaled: number = Math.round(accelerated * multiplier);
    return Math.max(minimumInterval, scaled);
  }
}
