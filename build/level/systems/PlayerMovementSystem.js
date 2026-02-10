import KeyListener from '../../KeyListener.js';
export default class PlayerMovementSystem {
    static processMovement(player, keyListener, bounds) {
        if (keyListener.isKeyDown(KeyListener.KEY_W)
            && keyListener.isKeyDown(KeyListener.KEY_D)
            && player.getPosY() > bounds.minY
            && player.getPosX() < bounds.maxX) {
            player.moveDiagonallyRightUp();
        }
        else if (keyListener.isKeyDown(KeyListener.KEY_S)
            && keyListener.isKeyDown(KeyListener.KEY_D)
            && player.getPosY() < bounds.maxY
            && player.getPosX() < bounds.maxX) {
            player.moveDiagonallyRightDown();
        }
        else if (keyListener.isKeyDown(KeyListener.KEY_W)
            && keyListener.isKeyDown(KeyListener.KEY_A)
            && player.getPosY() > bounds.minY
            && player.getPosX() > bounds.minX) {
            player.moveDiagonallyLefttUp();
        }
        else if (keyListener.isKeyDown(KeyListener.KEY_S)
            && keyListener.isKeyDown(KeyListener.KEY_A)
            && player.getPosY() < bounds.maxY
            && player.getPosX() > bounds.minX) {
            player.moveDiagonallyLeftDown();
        }
        else if (keyListener.isKeyDown(KeyListener.KEY_W) && player.getPosY() > bounds.minY) {
            player.moveUp();
        }
        else if (keyListener.isKeyDown(KeyListener.KEY_A) && player.getPosX() > bounds.minX) {
            player.moveLeft();
        }
        else if (keyListener.isKeyDown(KeyListener.KEY_S) && player.getPosY() < bounds.maxY) {
            player.moveDown();
        }
        else if (keyListener.isKeyDown(KeyListener.KEY_D) && player.getPosX() < bounds.maxX) {
            player.moveRight();
        }
    }
}
//# sourceMappingURL=PlayerMovementSystem.js.map