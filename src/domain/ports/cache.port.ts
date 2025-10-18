export interface ICachePort<T> {
    get(key: string): Promise<T | null>;
    set(key: string, value: T, ttl?: number): Promise<void>;
  }
  
  export const CACHE_PORT = Symbol('CACHE_PORT');