import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryCache } from '../server/services/cache';

describe('MemoryCache & Efficiency Service', () => {
  let cache: MemoryCache<string>;

  beforeEach(() => {
    cache = new MemoryCache<string>(3, 60); // Max 3 items, 60 min TTL
  });

  it('generates consistent, deterministic SHA-256 keys', () => {
    const key1 = MemoryCache.generateKey('test', { text: 'contract A', role: 'Tenant' });
    const key2 = MemoryCache.generateKey('test', { text: 'contract A', role: 'Tenant' });
    const key3 = MemoryCache.generateKey('test', { text: 'contract B', role: 'Tenant' });

    expect(key1).toBe(key2);
    expect(key1).not.toBe(key3);
    expect(key1).toMatch(/^test:[a-f0-9]{64}$/);
  });

  it('stores and retrieves items correctly (Cache HIT)', () => {
    const key = 'test-key-1';
    cache.set(key, 'analysis-result');
    expect(cache.get(key)).toBe('analysis-result');
  });

  it('returns null on cache miss', () => {
    expect(cache.get('non-existent-key')).toBeNull();
  });

  it('enforces LRU eviction when maxEntries is exceeded', () => {
    cache.set('key1', 'val1');
    cache.set('key2', 'val2');
    cache.set('key3', 'val3');

    // Access key1 to make it most recently used
    expect(cache.get('key1')).toBe('val1');

    // Add 4th item, should evict key2 (the least recently used)
    cache.set('key4', 'val4');

    expect(cache.get('key1')).toBe('val1');
    expect(cache.get('key3')).toBe('val3');
    expect(cache.get('key4')).toBe('val4');
    expect(cache.get('key2')).toBeNull(); // evicted!
  });

  it('respects item expiration (TTL)', () => {
    // Set 1ms TTL
    cache.set('short-lived', 'temp-data', 1);

    // Wait 10ms
    const start = Date.now();
    while (Date.now() - start < 10) {
      // spin
    }

    expect(cache.get('short-lived')).toBeNull();
  });

  it('reports accurate cache statistics and clears properly', () => {
    cache.set('itemA', 'dataA');
    cache.set('itemB', 'dataB');

    expect(cache.getStats()).toEqual({ size: 2, maxEntries: 3 });

    cache.clear();
    expect(cache.getStats().size).toBe(0);
    expect(cache.get('itemA')).toBeNull();
  });
});
