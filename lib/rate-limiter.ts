/**
 * IP 级别的速率限制器
 * 防止 DDoS 攻击和恶意爬虫
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blacklistedUntil?: number;
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // 每 5 分钟清理过期的记录，防止内存泄漏
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * 检查 IP 是否在黑名单中
   */
  isBlacklisted(ip: string): boolean {
    const entry = this.requests.get(ip);
    if (!entry || !entry.blacklistedUntil) {
      return false;
    }

    const now = Date.now();
    if (now < entry.blacklistedUntil) {
      return true;
    }

    // 黑名单已过期，清除标记
    delete entry.blacklistedUntil;
    return false;
  }

  /**
   * 将 IP 加入黑名单
   * @param ip IP 地址
   * @param durationMs 封禁时长（毫秒），默认 1 小时
   */
  blacklist(ip: string, durationMs: number = 60 * 60 * 1000) {
    const entry = this.requests.get(ip) || { count: 0, resetTime: Date.now() };
    entry.blacklistedUntil = Date.now() + durationMs;
    this.requests.set(ip, entry);
    console.warn(`[RateLimiter] IP ${ip} 已被封禁 ${durationMs / 1000 / 60} 分钟`);
  }

  /**
   * 检查请求是否超过速率限制
   * @param ip IP 地址
   * @param limit 限制次数
   * @param windowMs 时间窗口（毫秒）
   * @returns { allowed: boolean, remaining: number, resetTime: number }
   */
  check(
    ip: string,
    limit: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetTime: number; isBlacklisted: boolean } {
    // 检查黑名单
    if (this.isBlacklisted(ip)) {
      const entry = this.requests.get(ip)!;
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.blacklistedUntil!,
        isBlacklisted: true,
      };
    }

    const now = Date.now();
    const entry = this.requests.get(ip);

    // 如果没有记录或时间窗口已过期，重置计数
    if (!entry || now > entry.resetTime) {
      this.requests.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowMs,
        isBlacklisted: false,
      };
    }

    // 增加计数
    entry.count++;

    // 检查是否超限
    if (entry.count > limit) {
      // 超限严重（超过限制 3 倍），自动加入黑名单
      if (entry.count > limit * 3) {
        this.blacklist(ip, 60 * 60 * 1000); // 封禁 1 小时
        return {
          allowed: false,
          remaining: 0,
          resetTime: entry.resetTime,
          isBlacklisted: true,
        };
      }

      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        isBlacklisted: false,
      };
    }

    return {
      allowed: true,
      remaining: limit - entry.count,
      resetTime: entry.resetTime,
      isBlacklisted: false,
    };
  }

  /**
   * 清理过期的记录
   */
  private cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [ip, entry] of this.requests.entries()) {
      // 清理已过期且不在黑名单的记录
      if (now > entry.resetTime && (!entry.blacklistedUntil || now > entry.blacklistedUntil)) {
        this.requests.delete(ip);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[RateLimiter] 已清理 ${cleaned} 条过期记录`);
    }
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      totalIPs: this.requests.size,
      blacklistedIPs: Array.from(this.requests.entries())
        .filter(([, entry]) => entry.blacklistedUntil && Date.now() < entry.blacklistedUntil)
        .map(([ip]) => ip),
    };
  }

  /**
   * 清理资源
   */
  destroy() {
    clearInterval(this.cleanupInterval);
    this.requests.clear();
  }
}

// 创建全局单例
const rateLimiter = new RateLimiter();

// 预设的速率限制配置
export const RATE_LIMITS = {
  // POST 接口：每 IP 每分钟最多 10 次
  POST: {
    limit: 10,
    window: 60 * 1000, // 1 分钟
  },
  // GET 接口：每 IP 每分钟最多 60 次
  GET: {
    limit: 60,
    window: 60 * 1000, // 1 分钟
  },
  // 管理接口：每 IP 每分钟最多 30 次
  ADMIN: {
    limit: 30,
    window: 60 * 1000, // 1 分钟
  },
};

/**
 * 从 NextRequest 中提取 IP 地址
 * 优先使用 X-Forwarded-For（如果使用反向代理）
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // X-Forwarded-For 可能包含多个 IP，取第一个
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // 如果没有代理头，返回一个标识（在 Edge Runtime 中可能无法获取真实 IP）
  return 'unknown';
}

/**
 * 应用速率限制的辅助函数
 * @param request NextRequest 对象
 * @param limitConfig 速率限制配置
 * @returns Response 对象（如果被限制）或 null（如果允许通过）
 */
export function applyRateLimit(
  request: Request,
  limitConfig: { limit: number; window: number }
): Response | null {
  const ip = getClientIP(request);
  const { allowed, remaining, resetTime, isBlacklisted } = rateLimiter.check(
    ip,
    limitConfig.limit,
    limitConfig.window
  );

  if (!allowed) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

    if (isBlacklisted) {
      console.warn(`[RateLimiter] 黑名单 IP 尝试访问: ${ip}`);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'IP 已被封禁，请稍后再试',
          retryAfter,
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': limitConfig.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.toString(),
          },
        }
      );
    }

    console.warn(`[RateLimiter] IP ${ip} 超过速率限制`);
    return new Response(
      JSON.stringify({
        success: false,
        error: '请求过于频繁，请稍后再试',
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': limitConfig.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime.toString(),
        },
      }
    );
  }

  // 请求被允许，但仍返回速率限制头供客户端参考
  // 这里返回 null，调用者需要自己添加这些头到响应中
  return null;
}

/**
 * 获取速率限制响应头（用于添加到正常响应中）
 */
export function getRateLimitHeaders(
  request: Request,
  limitConfig: { limit: number; window: number }
): Record<string, string> {
  const ip = getClientIP(request);
  const { remaining, resetTime } = rateLimiter.check(ip, limitConfig.limit, limitConfig.window);

  return {
    'X-RateLimit-Limit': limitConfig.limit.toString(),
    'X-RateLimit-Remaining': Math.max(0, remaining).toString(),
    'X-RateLimit-Reset': resetTime.toString(),
  };
}

export default rateLimiter;
