/**
 * 输入验证和 JSON 消毒工具
 * 防止代码注入、XSS、过大 payload 等攻击
 */

/**
 * 验证配置
 */
export const VALIDATION_LIMITS = {
  // JSON payload 最大 100KB
  MAX_PAYLOAD_SIZE: 100 * 1024, // 100KB in bytes
  // JSON 最大嵌套深度
  MAX_JSON_DEPTH: 5,
  // 字符串字段最大长度
  MAX_STRING_LENGTH: 10000,
  // 数组最大元素数量
  MAX_ARRAY_LENGTH: 1000,
};

/**
 * 危险字符和模式（可能用于代码注入）
 */
const DANGEROUS_PATTERNS = [
  // JavaScript 代码执行
  /eval\s*\(/i,
  /Function\s*\(/i,
  /setTimeout\s*\(/i,
  /setInterval\s*\(/i,
  // HTML/Script 标签
  /<script[^>]*>/i,
  /<iframe[^>]*>/i,
  /<object[^>]*>/i,
  /<embed[^>]*>/i,
  // 事件处理器
  /on\w+\s*=/i, // onclick=, onerror=, etc.
  // 协议注入
  /javascript:/i,
  /data:text\/html/i,
  /vbscript:/i,
  // SQL 注入特征（虽然 Prisma 已防护，但额外检查）
  /union\s+select/i,
  /drop\s+table/i,
  /exec\s*\(/i,
  // 命令注入
  /[;&|`$]/,
  // 路径遍历
  /\.\.[\/\\]/,
];

/**
 * 检查字符串中是否包含危险模式
 */
export function containsDangerousPattern(str: string): boolean {
  if (typeof str !== 'string') return false;

  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(str)) {
      console.warn(`[InputValidator] 检测到危险模式: ${pattern.toString()} in "${str.substring(0, 50)}..."`);
      return true;
    }
  }
  return false;
}

/**
 * 清理字符串，移除潜在的危险字符
 */
export function sanitizeString(str: string, maxLength: number = VALIDATION_LIMITS.MAX_STRING_LENGTH): string {
  if (typeof str !== 'string') {
    throw new Error('输入必须是字符串');
  }

  // 截断过长字符串
  let cleaned = str.substring(0, maxLength);

  // 移除控制字符（保留换行和制表符）
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // HTML 实体编码（防止 XSS）
  cleaned = cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return cleaned;
}

/**
 * 计算 JSON 对象的嵌套深度
 */
function getJSONDepth(obj: unknown, currentDepth = 1): number {
  if (obj === null || typeof obj !== 'object') {
    return currentDepth;
  }

  let maxDepth = currentDepth;

  for (const value of Object.values(obj)) {
    const depth = getJSONDepth(value, currentDepth + 1);
    maxDepth = Math.max(maxDepth, depth);
  }

  return maxDepth;
}

/**
 * 验证 JSON 对象是否安全
 */
export function validateJSONSafety(obj: unknown): { valid: boolean; error?: string } {
  // 检查嵌套深度
  const depth = getJSONDepth(obj);
  if (depth > VALIDATION_LIMITS.MAX_JSON_DEPTH) {
    return {
      valid: false,
      error: `JSON 嵌套深度超过限制（最大 ${VALIDATION_LIMITS.MAX_JSON_DEPTH} 层）`,
    };
  }

  // 递归检查所有字符串字段
  function checkObject(item: unknown): { valid: boolean; error?: string } {
    if (item === null || item === undefined) {
      return { valid: true };
    }

    if (typeof item === 'string') {
      // 检查长度
      if (item.length > VALIDATION_LIMITS.MAX_STRING_LENGTH) {
        return {
          valid: false,
          error: `字符串长度超过限制（最大 ${VALIDATION_LIMITS.MAX_STRING_LENGTH} 字符）`,
        };
      }
      // 检查危险模式
      if (containsDangerousPattern(item)) {
        return {
          valid: false,
          error: '检测到潜在的危险内容',
        };
      }
      return { valid: true };
    }

    if (Array.isArray(item)) {
      // 检查数组长度
      if (item.length > VALIDATION_LIMITS.MAX_ARRAY_LENGTH) {
        return {
          valid: false,
          error: `数组长度超过限制（最大 ${VALIDATION_LIMITS.MAX_ARRAY_LENGTH} 个元素）`,
        };
      }
      // 递归检查数组元素
      for (const element of item) {
        const result = checkObject(element);
        if (!result.valid) {
          return result;
        }
      }
      return { valid: true };
    }

    if (typeof item === 'object') {
      // 检查对象键数量
      const keys = Object.keys(item);
      if (keys.length > VALIDATION_LIMITS.MAX_ARRAY_LENGTH) {
        return {
          valid: false,
          error: `对象键数量超过限制（最大 ${VALIDATION_LIMITS.MAX_ARRAY_LENGTH} 个键）`,
        };
      }
      // 递归检查对象值
      for (const value of Object.values(item)) {
        const result = checkObject(value);
        if (!result.valid) {
          return result;
        }
      }
      return { valid: true };
    }

    // 其他类型（number, boolean）默认安全
    return { valid: true };
  }

  return checkObject(obj);
}

/**
 * 验证并解析请求体
 * @param request NextRequest 对象
 * @returns 解析后的 JSON 数据，如果失败则抛出错误
 */
export async function validateRequestBody(request: Request): Promise<unknown> {
  // 检查 Content-Type
  const contentType = request.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Content-Type 必须是 application/json');
  }

  // 读取原始 body（仅一次）
  const bodyText = await request.text();

  // 检查 payload 大小
  const bodySize = new Blob([bodyText]).size;
  if (bodySize > VALIDATION_LIMITS.MAX_PAYLOAD_SIZE) {
    throw new Error(
      `Payload 大小超过限制（最大 ${VALIDATION_LIMITS.MAX_PAYLOAD_SIZE / 1024}KB）`
    );
  }

  // 解析 JSON
  let data: unknown;
  try {
    data = JSON.parse(bodyText);
  } catch (error) {
    throw new Error('无效的 JSON 格式');
  }

  // 验证 JSON 安全性
  const validation = validateJSONSafety(data);
  if (!validation.valid) {
    throw new Error(validation.error || '数据验证失败');
  }

  return data;
}

/**
 * 验证年龄范围
 */
export function validateAge(age: unknown): boolean {
  if (typeof age !== 'number') return false;
  if (!Number.isInteger(age)) return false;
  if (age < 1 || age > 120) return false;
  return true;
}

/**
 * 验证性别
 */
export function validateGender(gender: unknown): boolean {
  if (typeof gender !== 'string') return false;
  const validGenders = ['male', 'female', 'other', 'prefer_not_to_say'];
  return validGenders.includes(gender);
}

/**
 * 验证分数
 */
export function validateScore(score: unknown): boolean {
  if (typeof score !== 'number') return false;
  if (!Number.isFinite(score)) return false;
  if (score < 0 || score > 10000) return false; // 假设最高分不会超过 10000
  return true;
}

/**
 * 验证 ID 格式（防止注入）
 */
export function validateId(id: unknown): boolean {
  if (typeof id !== 'string') return false;
  // 只允许字母、数字、下划线、连字符
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return false;
  // 长度限制
  if (id.length > 100) return false;
  return true;
}

/**
 * 验证 URL（如果需要存储外部 URL）
 */
export function validateURL(url: unknown): boolean {
  if (typeof url !== 'string') return false;

  try {
    const parsed = new URL(url);
    // 只允许 https 协议
    if (parsed.protocol !== 'https:') return false;
    // 不允许本地地址
    if (parsed.hostname === 'localhost' || parsed.hostname.startsWith('127.')) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * 创建安全的错误响应
 */
export function createValidationErrorResponse(error: string): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: '数据验证失败',
      details: error,
    }),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * 深度清理对象（递归清理所有字符串字段）
 * 注意：这会修改原对象
 */
export function deepSanitize(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepSanitize(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // 也清理键名
      const cleanKey = sanitizeString(key, 100);
      sanitized[cleanKey] = deepSanitize(value);
    }
    return sanitized;
  }

  return obj;
}
