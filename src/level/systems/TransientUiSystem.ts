export interface ScorePopup {
  text: string;
  x: number;
  y: number;
  ttl: number;
}

export default class TransientUiSystem {
  public static updatePopups(popups: ScorePopup[], elapsed: number, risePerMs: number): ScorePopup[] {
    return popups
      .map((popup: ScorePopup) => ({
        ...popup,
        ttl: popup.ttl - elapsed,
        y: popup.y - risePerMs * elapsed,
      }))
      .filter((popup: ScorePopup) => popup.ttl > 0);
  }
}
