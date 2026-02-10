export default class GameConfig {
  public static readonly VIRTUAL_WIDTH: number = 1920;

  public static readonly VIRTUAL_HEIGHT: number = 1080;

  public static readonly PLAYER_CARDINAL_SPEED: number = 6;

  public static readonly PLAYER_DIAGONAL_SPEED: number =
    GameConfig.PLAYER_CARDINAL_SPEED / Math.sqrt(2);

  public static readonly BULLET_SPEED: number = 2;

  public static readonly BULLET_CULL_MIN_MULTIPLIER: number = 0.9;

  public static readonly BULLET_CULL_MAX_MULTIPLIER: number = 1.05;

  public static readonly RVIRUS_DOT_INTERVAL_MS: number = 1500;

  public static readonly RVIRUS_DOT_DAMAGE: number = 5;

  public static readonly PLAYER_FIRE_COOLDOWN_MS: number = 140;

  public static readonly MULTIPLIER_DECAY_PER_SECOND: number = 0.75;

  public static readonly BOSS_SUMMON_INTERVAL_MS: number = 3000;

  public static readonly BOSS_HEALTHBAR_OFFSET_X: number = 480;

  public static readonly BOSS_HEALTHBAR_OFFSET_Y: number = 968;

  public static readonly DIALOGUE_OFFSET_X: number = 480;

  public static readonly DIALOGUE_OFFSET_Y: number = 270;

  public static readonly BORDER_COLOR: string = 'rgba(80, 255, 160, 0.65)';

  public static readonly OBJECTIVE_TEXT_COLOR: string = 'gold';
}
