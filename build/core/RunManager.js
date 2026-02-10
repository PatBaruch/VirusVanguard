export default class RunManager {
    static SCORE_ATTACK_DEFAULT_MS = 180000;
    static runState = {
        seed: Date.now(),
        mode: 'campaign',
        mutator: 'none',
        scoreAttackTimeMs: RunManager.SCORE_ATTACK_DEFAULT_MS,
    };
    static initializeFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const seedFromUrl = urlParams.get('seed');
        const modeFromUrl = urlParams.get('mode');
        const mutatorFromUrl = urlParams.get('mutator');
        if (seedFromUrl !== null && !Number.isNaN(Number(seedFromUrl))) {
            RunManager.runState.seed = Number(seedFromUrl);
        }
        if (modeFromUrl === 'score-attack' || modeFromUrl === 'endless' || modeFromUrl === 'campaign') {
            RunManager.runState.mode = modeFromUrl;
        }
        if (mutatorFromUrl === 'rapid-fire'
            || mutatorFromUrl === 'fragile'
            || mutatorFromUrl === 'surge'
            || mutatorFromUrl === 'none') {
            RunManager.runState.mutator = mutatorFromUrl;
        }
    }
    static applySeededRandom() {
        const seededRandom = RunManager.mulberry32(RunManager.runState.seed);
        Math.random = seededRandom;
    }
    static getRunState() {
        return RunManager.runState;
    }
    static getFireCooldownMultiplier() {
        if (RunManager.runState.mutator === 'rapid-fire') {
            return 0.65;
        }
        return 1;
    }
    static getDamageTakenMultiplier() {
        if (RunManager.runState.mutator === 'fragile') {
            return 1.5;
        }
        return 1;
    }
    static getSpawnRateMultiplier() {
        if (RunManager.runState.mutator === 'surge') {
            return 0.75;
        }
        return 1;
    }
    static getMultiplierDecayMultiplier() {
        if (RunManager.runState.mutator === 'rapid-fire') {
            return 0.9;
        }
        return 1;
    }
    static mulberry32(seed) {
        let state = seed >>> 0;
        return () => {
            state += 0x6d2b79f5;
            let t = state;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }
}
//# sourceMappingURL=RunManager.js.map