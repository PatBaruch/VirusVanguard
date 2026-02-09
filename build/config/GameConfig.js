export default class GameConfig {
    static VIRTUAL_WIDTH = 1920;
    static VIRTUAL_HEIGHT = 1080;
    static PLAYER_CARDINAL_SPEED = 6;
    static PLAYER_DIAGONAL_SPEED = GameConfig.PLAYER_CARDINAL_SPEED / Math.sqrt(2);
    static BULLET_SPEED = 2;
    static BULLET_CULL_MIN_MULTIPLIER = 0.9;
    static BULLET_CULL_MAX_MULTIPLIER = 1.05;
    static RVIRUS_DOT_INTERVAL_MS = 1500;
    static RVIRUS_DOT_DAMAGE = 5;
    static BOSS_SUMMON_INTERVAL_MS = 3000;
    static BOSS_HEALTHBAR_OFFSET_X = 480;
    static BOSS_HEALTHBAR_OFFSET_Y = 968;
    static DIALOGUE_OFFSET_X = 480;
    static DIALOGUE_OFFSET_Y = 270;
    static BORDER_COLOR = 'rgba(80, 255, 160, 0.65)';
}
//# sourceMappingURL=GameConfig.js.map