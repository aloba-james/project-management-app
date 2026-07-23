export type StoredObject = {
  key: string;
  contentType?: string;
  size: number;
  url: string;
};

export type StorageAdapter = {
  name: string;
  put(
    key: string,
    data: Buffer | string,
    contentType?: string,
  ): Promise<StoredObject>;
  get(key: string): Promise<StoredObject | null>;
  getBody(key: string): Promise<Buffer | null>;
  delete(key: string): Promise<void>;
  health(): Promise<{ ok: boolean; detail?: string }>;
};

export class LocalStubStorage implements StorageAdapter {
  name = "local-stub-storage";
  private store = new Map<string, StoredObject & { body: Buffer }>();

  async put(
    key: string,
    data: Buffer | string,
    contentType = "application/octet-stream",
  ): Promise<StoredObject> {
    const body = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const stored = {
      key,
      contentType,
      size: body.length,
      url: `stub://local/${key}`,
      body,
    };
    this.store.set(key, stored);
    return { key, contentType, size: stored.size, url: stored.url };
  }

  async get(key: string): Promise<StoredObject | null> {
    const stored = this.store.get(key);
    if (!stored) return null;
    return {
      key: stored.key,
      contentType: stored.contentType,
      size: stored.size,
      url: stored.url,
    };
  }

  async getBody(key: string): Promise<Buffer | null> {
    return this.store.get(key)?.body ?? null;
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async health() {
    return { ok: true, detail: `objects=${this.store.size} (in-memory stub)` };
  }
}

const globalForStorage = globalThis as unknown as {
  storageAdapter: StorageAdapter | undefined;
};

export const storage: StorageAdapter =
  globalForStorage.storageAdapter ?? new LocalStubStorage();

if (process.env.NODE_ENV !== "production") {
  globalForStorage.storageAdapter = storage;
}
