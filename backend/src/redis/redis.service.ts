import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    // Detect Docker environment
    const isDockerEnv = process.env.DOCKER_NETWORK_NAME !== undefined;
    
    // Use Docker Redis host/port if in Docker, otherwise use configured server
    const host = isDockerEnv
      ? this.configService.get('DOCKER_REDIS_HOST', 'redis')
      : this.configService.get('REDIS_HOST', '116.118.49.243');
    
    // Always use configured port from .env
    const portConfig = isDockerEnv
      ? this.configService.get('DOCKER_REDIS_PORT', '6379')
      : this.configService.get('REDIS_PORT', '12004');
    
    const port = typeof portConfig === 'string' ? parseInt(portConfig, 10) : portConfig;
    const password = this.configService.get('REDIS_PASSWORD');
    const db = this.configService.get('REDIS_DB', 0);
    
    console.log(`[RedisService] Connecting to Redis: host=${host}, port=${port}, dockerEnv=${isDockerEnv}`);
    
    this.client = new Redis({
      host,
      port,
      password,
      db,
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        // Stop retrying after 3 attempts
        if (times > 3) {
          console.warn('[RedisService] Max retry attempts reached, giving up');
          return null; // Stop retrying
        }
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      lazyConnect: true,
      enableOfflineQueue: false, // Don't queue commands when offline
      connectTimeout: 5000,
      commandTimeout: 3000,
      enableReadyCheck: true,
      autoResubscribe: false, // Don't auto resubscribe
      autoResendUnfulfilledCommands: false, // Don't resend commands
    });

    // Set up error handlers BEFORE connecting
    this.client.on('error', (err: any) => {
      // Silently handle connection errors
      if (err.code === 'ECONNREFUSED') {
        console.warn(`[RedisService] ⚠️ Cannot connect to Redis (${host}:${port}) - running without cache`);
      } else {
        console.warn(`[RedisService] Connection error: ${err.message}`);
      }
    });

    this.client.on('connect', () => {
      console.log('[RedisService] ✅ Connected successfully');
    });

    this.client.on('close', () => {
      console.log('[RedisService] Connection closed');
    });

    try {
      await this.client.connect();
      console.log('✅ Redis connected successfully');
    } catch (error) {
      console.warn('⚠️ Redis connection failed, running without cache');
      // Disconnect and set client to null to prevent further errors
      try {
        await this.client.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  /**
   * Get value by key
   */
  async get(key: string): Promise<string | null> {
    if (!this.client || this.client.status !== 'ready') {
      return null;
    }
    
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  /**
   * Set value with optional TTL
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.client || this.client.status !== 'ready') {
      return;
    }

    try {
      if (ttl) {
        await this.client.setex(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  }

  /**
   * Set value with TTL in seconds
   */
  async setex(key: string, seconds: number, value: string): Promise<void> {
    return this.set(key, value, seconds);
  }

  /**
   * Delete key
   */
  async del(key: string): Promise<void> {
    if (!this.client || this.client.status !== 'ready') {
      return;
    }

    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  }

  /**
   * Delete multiple keys
   */
  async delMultiple(keys: string[]): Promise<void> {
    if (!this.client || this.client.status !== 'ready' || keys.length === 0) {
      return;
    }

    try {
      await this.client.del(...keys);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.client || this.client.status !== 'ready') {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }

  /**
   * Get TTL of key
   */
  async ttl(key: string): Promise<number> {
    if (!this.client || this.client.status !== 'ready') {
      return -1;
    }

    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error('Redis TTL error:', error);
      return -1;
    }
  }

  /**
   * Increment value
   */
  async incr(key: string): Promise<number> {
    if (!this.client || this.client.status !== 'ready') {
      return 0;
    }

    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error('Redis INCR error:', error);
      return 0;
    }
  }

  /**
   * Increment by value
   */
  async incrby(key: string, increment: number): Promise<number> {
    if (!this.client || this.client.status !== 'ready') {
      return 0;
    }

    try {
      return await this.client.incrby(key, increment);
    } catch (error) {
      console.error('Redis INCRBY error:', error);
      return 0;
    }
  }

  /**
   * Get all keys matching pattern
   */
  async keys(pattern: string): Promise<string[]> {
    if (!this.client || this.client.status !== 'ready') {
      return [];
    }

    try {
      return await this.client.keys(pattern);
    } catch (error) {
      console.error('Redis KEYS error:', error);
      return [];
    }
  }

  /**
   * Flush all keys (use with caution!)
   */
  async flushall(): Promise<void> {
    if (!this.client || this.client.status !== 'ready') {
      return;
    }

    try {
      await this.client.flushall();
    } catch (error) {
      console.error('Redis FLUSHALL error:', error);
    }
  }

  /**
   * Get raw Redis client for advanced operations
   */
  getClient(): Redis | null {
    return this.client?.status === 'ready' ? this.client : null;
  }

  /**
   * Check if Redis is connected
   */
  isConnected(): boolean {
    return this.client?.status === 'ready';
  }
}
