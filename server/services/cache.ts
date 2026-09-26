import crypto from 'crypto';

interface CacheEntry<T> {
  data: T;
  createdAt: number;
  expiresAt: number;
}

/**
 * High-performance, memory-bounded LRU Cache with TTL.
 * Prevents redundant calls to Gemini API, saves quota, and delivers sub-millisecond responses for identical analyses.
 */
export class MemoryCache<T = unknown> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private maxEntries: number;
  private defaultTtlMs: number;

  constructor(maxEntries: number = 200, defaultTtlMinutes: number = 60) {
    this.maxEntries = maxEntries;
    this.defaultTtlMs = defaultTtlMinutes * 60 * 1000;
  }

  /**
   * Generates a deterministic SHA-256 cache key from arbitrary parameters.
   */
  public static generateKey(namespace: string, payload: unknown): string {
    const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const hash = crypto.createHash('sha256').update(serialized).digest('hex');
    return `${namespace}:${hash}`;
  }

  /**
   * Retrieves an item from cache if not expired.
   */
  public get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Refresh access order (LRU)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data;
  }

  /**
   * Stores an item with optional custom TTL.
   */
  public set(key: string, data: T, ttlMs?: number): void {
    if (this.cache.size >= this.maxEntries) {
      // Evict oldest entry (first item in Map iterator)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const ttl = ttlMs ?? this.defaultTtlMs;
    this.cache.set(key, {
      data,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Returns current cache statistics.
   */
  public getStats(): { size: number; maxEntries: number } {
    return {
      size: this.cache.size,
      maxEntries: this.maxEntries,
    };
  }

  /**
   * Clears the cache.
   */
  public clear(): void {
    this.cache.clear();
  }
}

// Global server-side singleton cache
export const serverCache = new MemoryCache(250, 60);
