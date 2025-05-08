export default class Game {
    static NORMAL_MODE = 0;
    static PLAY_CATCH_UP = 1;
    static STATE_IDLE = 0;
    static STATE_RUNNING = 2;
    static STATE_STARTING = 1;
    static STATE_STOPPING = 3;
    frameEnd;
    gameStart;
    mode;
    previousElapsed;
    state;
    fps;
    frameCount;
    gameTime;
    load;
    constructor(mode = Game.NORMAL_MODE) {
        this.state = Game.STATE_IDLE;
        this.mode = mode;
    }
    step(timestamp) {
        if (this.isInState(Game.STATE_STARTING)) {
            this.state = Game.STATE_RUNNING;
        }
        this.processInput();
        let shouldStop = false;
        if (this.mode === Game.PLAY_CATCH_UP) {
            const step = 1;
            while (this.previousElapsed < timestamp && !shouldStop) {
                shouldStop = !this.update(step);
                this.previousElapsed += step;
            }
        }
        else {
            const elapsed = timestamp - this.previousElapsed;
            shouldStop = !this.update(elapsed);
            this.previousElapsed = timestamp;
        }
        this.render();
        if (!shouldStop || this.isInState(Game.STATE_STOPPING)) {
            requestAnimationFrame(this.step.bind(this));
        }
        else {
            this.state = Game.STATE_IDLE;
        }
        const now = performance.now();
        const stepTime = timestamp - now;
        const frameTime = now - this.frameEnd;
        this.fps = Math.round(1000 / frameTime);
        this.load = stepTime / frameTime;
        this.frameEnd = now;
        this.gameTime = now - this.gameStart;
        this.frameCount += 1;
    }
    isInState(state) {
        return this.state === state;
    }
    start() {
        if (this.state === Game.STATE_IDLE) {
            this.state = Game.STATE_STARTING;
            this.gameStart = performance.now();
            this.frameEnd = this.gameStart;
            this.previousElapsed = this.gameStart;
            this.gameTime = 0;
            this.frameCount = 0;
            requestAnimationFrame(this.step.bind(this));
        }
    }
    stop() {
        this.state = Game.STATE_STOPPING;
    }
}
//# sourceMappingURL=Game.js.map