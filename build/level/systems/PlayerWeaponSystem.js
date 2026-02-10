export default class PlayerWeaponSystem {
    static createBulletVectors(level, direction, speed) {
        if (level < 3) {
            return PlayerWeaponSystem.singleShot(direction, speed);
        }
        if (level < 4) {
            return PlayerWeaponSystem.doubleShot(direction, speed);
        }
        return PlayerWeaponSystem.tripleShot(direction, speed);
    }
    static singleShot(direction, speed) {
        switch (direction) {
            case 'E':
                return [{ offsetX: 0, offsetY: 0, velocityX: speed, velocityY: 0 }];
            case 'W':
                return [{ offsetX: 0, offsetY: 0, velocityX: -speed, velocityY: 0 }];
            case 'N':
                return [{ offsetX: 0, offsetY: 0, velocityX: 0, velocityY: -speed }];
            case 'S':
                return [{ offsetX: 0, offsetY: 0, velocityX: 0, velocityY: speed }];
            case 'NE':
                return [{
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: speed / Math.sqrt(2),
                        velocityY: -speed / Math.sqrt(2),
                    }];
            case 'SE':
                return [{
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: speed / Math.sqrt(2),
                        velocityY: speed / Math.sqrt(2),
                    }];
            case 'NW':
                return [{
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: -speed / Math.sqrt(2),
                        velocityY: -speed / Math.sqrt(2),
                    }];
            case 'SW':
                return [{
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: -speed / Math.sqrt(2),
                        velocityY: speed / Math.sqrt(2),
                    }];
            default:
                return [];
        }
    }
    static doubleShot(direction, speed) {
        switch (direction) {
            case 'E':
                return [
                    { offsetX: 10, offsetY: 15, velocityX: speed, velocityY: 0 },
                    { offsetX: 10, offsetY: -15, velocityX: speed, velocityY: 0 },
                ];
            case 'W':
                return [
                    { offsetX: 0, offsetY: 15, velocityX: -speed, velocityY: 0 },
                    { offsetX: 0, offsetY: -15, velocityX: -speed, velocityY: 0 },
                ];
            case 'N':
                return [
                    { offsetX: 15, offsetY: 0, velocityX: 0, velocityY: -speed },
                    { offsetX: -15, offsetY: 0, velocityX: 0, velocityY: -speed },
                ];
            case 'S':
                return [
                    { offsetX: 15, offsetY: 0, velocityX: 0, velocityY: speed },
                    { offsetX: -15, offsetY: 0, velocityX: 0, velocityY: speed },
                ];
            case 'NE':
                return [
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: speed / Math.sqrt(2),
                        velocityY: -speed / Math.sqrt(2),
                    },
                    {
                        offsetX: 0,
                        offsetY: -30,
                        velocityX: speed / Math.sqrt(2),
                        velocityY: -speed / Math.sqrt(2),
                    },
                ];
            case 'SE':
                return [
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: speed / Math.sqrt(2),
                        velocityY: speed / Math.sqrt(2),
                    },
                    {
                        offsetX: 0,
                        offsetY: -30,
                        velocityX: speed / Math.sqrt(2),
                        velocityY: speed / Math.sqrt(2),
                    },
                ];
            case 'NW':
                return [
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: -speed / Math.sqrt(2),
                        velocityY: -speed / Math.sqrt(2),
                    },
                    {
                        offsetX: 0,
                        offsetY: -30,
                        velocityX: -speed / Math.sqrt(2),
                        velocityY: -speed / Math.sqrt(2),
                    },
                ];
            case 'SW':
                return [
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: -speed / Math.sqrt(2),
                        velocityY: speed / Math.sqrt(2),
                    },
                    {
                        offsetX: 0,
                        offsetY: -30,
                        velocityX: -speed / Math.sqrt(2),
                        velocityY: speed / Math.sqrt(2),
                    },
                ];
            default:
                return [];
        }
    }
    static tripleShot(direction, speed) {
        switch (direction) {
            case 'E':
                return [
                    { offsetX: 10, offsetY: 10, velocityX: speed, velocityY: 1 },
                    { offsetX: 10, offsetY: 10, velocityX: speed, velocityY: -1 },
                    { offsetX: 0, offsetY: 0, velocityX: speed, velocityY: 0 },
                ];
            case 'W':
                return [
                    { offsetX: 0, offsetY: 0, velocityX: -speed, velocityY: 1 },
                    { offsetX: 0, offsetY: 0, velocityX: -speed, velocityY: -1 },
                    { offsetX: 0, offsetY: 0, velocityX: -speed, velocityY: 0 },
                ];
            case 'N':
                return [
                    { offsetX: 0, offsetY: 0, velocityX: 1, velocityY: -speed },
                    { offsetX: 0, offsetY: 0, velocityX: -1, velocityY: -speed },
                    { offsetX: 0, offsetY: 0, velocityX: 0, velocityY: -speed },
                ];
            case 'S':
                return [
                    { offsetX: 0, offsetY: 0, velocityX: 1, velocityY: speed },
                    { offsetX: 0, offsetY: 0, velocityX: -1, velocityY: speed },
                    { offsetX: 0, offsetY: 0, velocityX: 0, velocityY: speed },
                ];
            case 'NE':
                return [
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: speed / Math.sqrt(2),
                        velocityY: -speed / Math.sqrt(2),
                    },
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: speed / Math.sqrt(2),
                        velocityY: -speed / Math.sqrt(2) + 1,
                    },
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: speed / Math.sqrt(2),
                        velocityY: -speed / Math.sqrt(2) - 1,
                    },
                ];
            case 'SE':
                return [
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: speed / Math.sqrt(2),
                        velocityY: speed / Math.sqrt(2),
                    },
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: speed / Math.sqrt(2) - 1,
                        velocityY: speed / Math.sqrt(2),
                    },
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: speed / Math.sqrt(2) + 1,
                        velocityY: speed / Math.sqrt(2),
                    },
                ];
            case 'NW':
                return [
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: -speed / Math.sqrt(2),
                        velocityY: -speed / Math.sqrt(2),
                    },
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: -speed / Math.sqrt(2) + 1,
                        velocityY: -speed / Math.sqrt(2),
                    },
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: -speed / Math.sqrt(2) - 1,
                        velocityY: -speed / Math.sqrt(2),
                    },
                ];
            case 'SW':
                return [
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: -speed / Math.sqrt(2),
                        velocityY: speed / Math.sqrt(2),
                    },
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: -speed / Math.sqrt(2) + 1,
                        velocityY: speed / Math.sqrt(2),
                    },
                    {
                        offsetX: 0,
                        offsetY: 0,
                        velocityX: -speed / Math.sqrt(2) - 1,
                        velocityY: speed / Math.sqrt(2),
                    },
                ];
            default:
                return [];
        }
    }
}
//# sourceMappingURL=PlayerWeaponSystem.js.map