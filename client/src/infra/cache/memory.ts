export type CacheAdapter = {
  name: string;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlMs?: number): Promise<void>;
  delete(key: string): Promise<void>;
  health(): Promise<{ ok: boolean; detail?: string }>;
};

type Entry = { value: unknown; expiresAt?: number };

export class InMemoryCache implements CacheAdapter {
  name = "memory-cache";
  private store = new Map<string, Entry>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async health() {
    return { ok: true, detail: `keys=${this.store.size}` };
  }
}

const globalForCache = globalThis as unknown as {
  cacheAdapter: CacheAdapter | undefined;
};

export const cache: CacheAdapter =
  globalForCache.cacheAdapter ?? new InMemoryCache();

if (process.env.NODE_ENV !== "production") {
  globalForCache.cacheAdapter = cache;
}
