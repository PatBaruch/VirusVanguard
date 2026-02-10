export type GameMode = 'campaign' | 'score-attack' | 'endless';
export type Mutator = 'none' | 'rapid-fire' | 'fragile' | 'surge';

export interface RunState {
  seed: number;
  mode: GameMode;
  mutator: Mutator;
  scoreAttackTimeMs: number;
}

export default class RunManager {
  private static readonly SCORE_ATTACK_DEFAULT_MS: number = 180000;

  private static runState: RunState = {
    seed: Date.now(),
    mode: 'campaign',
    mutator: 'none',
    scoreAttackTimeMs: RunManager.SCORE_ATTACK_DEFAULT_MS,
  };

  public static initializeFromUrl(): void {
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    const seedFromUrl: string | null = urlParams.get('seed');
    const modeFromUrl: string | null = urlParams.get('mode');
    const mutatorFromUrl: string | null = urlParams.get('mutator');

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

  public static applySeededRandom(): void {
    const seededRandom: () => number = RunManager.mulberry32(RunManager.runState.seed);
    Math.random = seededRandom;
  }

  public static getRunState(): RunState {
    return RunManager.runState;
  }

  public static getFireCooldownMultiplier(): number {
    if (RunManager.runState.mutator === 'rapid-fire') {
      return 0.65;
    }

    return 1;
  }

  public static getDamageTakenMultiplier(): number {
    if (RunManager.runState.mutator === 'fragile') {
      return 1.5;
    }

    return 1;
  }

  public static getSpawnRateMultiplier(): number {
    if (RunManager.runState.mutator === 'surge') {
      return 0.75;
    }

    return 1;
  }

  public static getMultiplierDecayMultiplier(): number {
    if (RunManager.runState.mutator === 'rapid-fire') {
      return 0.9;
    }

    return 1;
  }

  private static mulberry32(seed: number): () => number {
    let state: number = seed >>> 0;

    return (): number => {
      state += 0x6d2b79f5;
      let t: number = state;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
}
