export default class Persistence {
    static STORAGE_KEY = 'virus-vanguard-stats';
    static loadStats() {
        const raw = window.localStorage.getItem(Persistence.STORAGE_KEY);
        if (raw === null) {
            return {
                bestFinalScore: 0,
                unlockedMedals: [],
                lastSeed: Date.now(),
            };
        }
        try {
            const parsed = JSON.parse(raw);
            return {
                bestFinalScore: parsed.bestFinalScore ?? 0,
                unlockedMedals: parsed.unlockedMedals ?? [],
                lastSeed: parsed.lastSeed ?? Date.now(),
            };
        }
        catch {
            return {
                bestFinalScore: 0,
                unlockedMedals: [],
                lastSeed: Date.now(),
            };
        }
    }
    static saveStats(stats) {
        window.localStorage.setItem(Persistence.STORAGE_KEY, JSON.stringify(stats));
    }
}
//# sourceMappingURL=Persistence.js.map