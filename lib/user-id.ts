/**
 * 匿名用户 ID 管理工具
 * 用于生成和管理用户的匿名标识
 */

const USER_ID_KEY = 'anonymous_user_id'

/**
 * 生成唯一的匿名用户 ID
 */
export function generateUserId(): string {
  // 使用时间戳 + UUID 确保唯一性
  const timestamp = Date.now().toString(36)
  const randomStr = crypto.randomUUID()
  return `user-${timestamp}-${randomStr}`
}

/**
 * 获取或创建用户 ID
 * 如果本地已存在则返回，否则生成新的
 */
export function getOrCreateUserId(): string {
  if (typeof window === 'undefined') {
    // 服务端渲染时返回临时 ID
    return generateUserId()
  }

  try {
    // 尝试从 localStorage 获取现有 ID
    let userId = localStorage.getItem(USER_ID_KEY)

    if (!userId) {
      // 不存在则生成新 ID
      userId = generateUserId()
      localStorage.setItem(USER_ID_KEY, userId)
      console.log('[UserID] 生成新的匿名用户 ID:', userId)
    } else {
      console.log('[UserID] 使用现有用户 ID:', userId)
    }

    return userId
  } catch (error) {
    console.error('[UserID] localStorage 访问失败，使用临时 ID:', error)
    return generateUserId()
  }
}

/**
 * 获取当前用户 ID（不创建新的）
 */
export function getUserId(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return localStorage.getItem(USER_ID_KEY)
  } catch (error) {
    console.error('[UserID] 无法获取用户 ID:', error)
    return null
  }
}

/**
 * 清除用户 ID（用于测试或用户主动清除数据）
 */
export function clearUserId(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(USER_ID_KEY)
    console.log('[UserID] 用户 ID 已清除')
  } catch (error) {
    console.error('[UserID] 无法清除用户 ID:', error)
  }
}

/**
 * 设置用户 ID（用于数据迁移或恢复）
 */
export function setUserId(userId: string): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(USER_ID_KEY, userId)
    console.log('[UserID] 用户 ID 已设置:', userId)
  } catch (error) {
    console.error('[UserID] 无法设置用户 ID:', error)
  }
}
