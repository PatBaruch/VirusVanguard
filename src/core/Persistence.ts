interface PersistedStats {
  bestFinalScore: number;
  unlockedMedals: string[];
  lastSeed: number;
}

export default class Persistence {
  private static readonly STORAGE_KEY: string = 'virus-vanguard-stats';

  public static loadStats(): PersistedStats {
    const raw: string | null = window.localStorage.getItem(Persistence.STORAGE_KEY);
    if (raw === null) {
      return {
        bestFinalScore: 0,
        unlockedMedals: [],
        lastSeed: Date.now(),
      };
    }

    try {
      const parsed: PersistedStats = JSON.parse(raw) as PersistedStats;
      return {
        bestFinalScore: parsed.bestFinalScore ?? 0,
        unlockedMedals: parsed.unlockedMedals ?? [],
        lastSeed: parsed.lastSeed ?? Date.now(),
      };
    } catch {
      return {
        bestFinalScore: 0,
        unlockedMedals: [],
        lastSeed: Date.now(),
      };
    }
  }

  public static saveStats(stats: PersistedStats): void {
    window.localStorage.setItem(Persistence.STORAGE_KEY, JSON.stringify(stats));
  }
}

export type { PersistedStats };
