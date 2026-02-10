const BOSS_HEALTH_BAR_IMAGES = [
    './assets/BossBar_Sprite/bossbar_00.png',
    './assets/BossBar_Sprite/bossbar_01.png',
    './assets/BossBar_Sprite/bossbar_02.png',
    './assets/BossBar_Sprite/bossbar_03.png',
    './assets/BossBar_Sprite/bossbar_04.png',
    './assets/BossBar_Sprite/bossbar_05.png',
    './assets/BossBar_Sprite/bossbar_06.png',
    './assets/BossBar_Sprite/bossbar_07.png',
    './assets/BossBar_Sprite/bossbar_08.png',
    './assets/BossBar_Sprite/bossbar_09.png',
    './assets/BossBar_Sprite/bossbar_10.png',
    './assets/BossBar_Sprite/bossbar_11.png',
    './assets/BossBar_Sprite/bossbar_12.png',
    './assets/BossBar_Sprite/bossbar_13.png',
    './assets/BossBar_Sprite/bossbar_14.png',
    './assets/BossBar_Sprite/bossbar_15.png',
    './assets/BossBar_Sprite/bossbar_16.png',
    './assets/BossBar_Sprite/bossbar_17.png',
    './assets/BossBar_Sprite/bossbar_18.png',
    './assets/BossBar_Sprite/bossbar_19.png',
    './assets/BossBar_Sprite/bossbar_20.png',
    './assets/BossBar_Sprite/bossbar_21.png',
    './assets/BossBar_Sprite/bossbar_22.png',
    './assets/BossBar_Sprite/bossbar_23.png',
    './assets/BossBar_Sprite/bossbar_24.png',
    './assets/BossBar_Sprite/bossbar_25.png',
];
export default class BossPhaseSystem {
    static getHealthBarImage(healthPoints) {
        const clampedHealth = Math.max(0, Math.min(BOSS_HEALTH_BAR_IMAGES.length - 1, healthPoints));
        return BOSS_HEALTH_BAR_IMAGES[clampedHealth];
    }
    static getSummonInterval(healthPoints, defaultInterval) {
        if (healthPoints <= 8) {
            return 1800;
        }
        if (healthPoints <= 16) {
            return 2400;
        }
        return defaultInterval;
    }
    static getShotPhase(healthPoints) {
        if (healthPoints <= 8) {
            return {
                minAngle: 20,
                maxAngle: 65,
                bulletSpeed: 1.4,
            };
        }
        if (healthPoints <= 16) {
            return {
                minAngle: 15,
                maxAngle: 55,
                bulletSpeed: 1.2,
            };
        }
        return {
            minAngle: 10,
            maxAngle: 45,
            bulletSpeed: 1,
        };
    }
    static resolveDirection(sourceX, sourceY, targetX, targetY) {
        const deltaX = targetX - sourceX;
        const deltaY = targetY - sourceY;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            return deltaX > 0 ? 'E' : 'W';
        }
        return deltaY > 0 ? 'S' : 'N';
    }
    static createSpreadVectors(direction, velocityX, velocityY) {
        switch (direction) {
            case 'N':
                return [
                    { velocityX: 0, velocityY: -velocityY },
                    { velocityX, velocityY: -velocityY },
                    { velocityX: -velocityX, velocityY: -velocityY },
                ];
            case 'S':
                return [
                    { velocityX: 0, velocityY },
                    { velocityX, velocityY },
                    { velocityX: -velocityX, velocityY },
                ];
            case 'E':
                return [
                    { velocityX, velocityY: 0 },
                    { velocityX, velocityY },
                    { velocityX, velocityY: -velocityY },
                ];
            case 'W':
                return [
                    { velocityX: -velocityX, velocityY: 0 },
                    { velocityX: -velocityX, velocityY },
                    { velocityX: -velocityX, velocityY: -velocityY },
                ];
            default:
                return [];
        }
    }
}
//# sourceMappingURL=BossPhaseSystem.js.map