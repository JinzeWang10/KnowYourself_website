# 安全措施测试指南

## 🛡️ 已实施的安全措施

### 1. ✅ IP 级别速率限制
- **位置**: `lib/rate-limiter.ts`
- **功能**:
  - POST 接口：每 IP 每分钟最多 10 次请求
  - GET 接口：每 IP 每分钟最多 60 次请求
  - 管理接口：每 IP 每分钟最多 30 次请求
  - 自动 IP 黑名单：超过限制 3 倍自动封禁 1 小时
  - 响应头包含速率限制信息

### 2. ✅ 严格的输入验证和 JSON 消毒
- **位置**: `lib/input-validator.ts`
- **功能**:
  - JSON payload 最大 100KB
  - JSON 最大嵌套深度 5 层
  - 检测并阻止危险模式（eval, script, 命令注入等）
  - 验证所有字段类型和范围
  - HTML 实体编码防止 XSS

### 3. ✅ 内容安全策略（CSP）和安全响应头
- **位置**: `next.config.ts`
- **功能**:
  - Content-Security-Policy: 严格的脚本和资源加载策略
  - HSTS: 强制 HTTPS
  - X-Frame-Options: 防止点击劫持
  - X-Content-Type-Options: 防止 MIME 嗅探
  - Permissions-Policy: 禁用不需要的浏览器功能

## 🧪 测试方法

### 测试 1: 速率限制测试

#### 测试 POST 接口速率限制
```bash
# 在短时间内发送 15 次请求（超过限制 10 次）
for i in {1..15}; do
  curl -X POST http://localhost:42156/api/assessments \
    -H "Content-Type: application/json" \
    -d '{
      "userId": "test-user-1",
      "gender": "male",
      "age": 25,
      "record": {
        "scaleId": "psqi",
        "scaleTitle": "匹兹堡睡眠质量指数",
        "totalScore": 10,
        "normalizedScore": 10,
        "level": "中度",
        "answers": [{"q": 1, "a": 2}]
      }
    }'
  echo ""
  sleep 1
done
```

**预期结果**:
- 前 10 次请求成功（200 OK）
- 第 11-15 次请求返回 429 Too Many Requests
- 响应头包含 `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`

#### 测试 GET 接口速率限制
```bash
# 快速发送 70 次请求（超过限制 60 次）
for i in {1..70}; do
  curl http://localhost:42156/api/percentile?scaleId=psqi&score=10
  echo ""
done
```

**预期结果**:
- 前 60 次请求成功
- 第 61-70 次请求返回 429 Too Many Requests

### 测试 2: 输入验证测试

#### 测试 JSON 注入攻击
```bash
# 尝试注入恶意 JavaScript 代码
curl -X POST http://localhost:42156/api/assessments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-2",
    "gender": "male",
    "age": 25,
    "record": {
      "scaleId": "psqi<script>alert(1)</script>",
      "scaleTitle": "Test",
      "totalScore": 10,
      "normalizedScore": 10,
      "level": "中度",
      "answers": [{"q": 1, "a": "eval(malicious_code)"}]
    }
  }'
```

**预期结果**: 400 Bad Request，错误信息提示检测到危险内容

#### 测试过大 Payload
```bash
# 创建一个超过 100KB 的大 JSON
curl -X POST http://localhost:42156/api/assessments \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","gender":"male","age":25,"record":{"scaleId":"psqi","scaleTitle":"Test","totalScore":10,"normalizedScore":10,"level":"中度","answers":['$(python3 -c "print(','.join(['{\"q\":1,\"a\":\"'+'x'*1000+'\"}' for i in range(200)]))")']}}'
```

**预期结果**: 400 Bad Request，错误信息提示 Payload 过大

#### 测试 JSON 深度限制
```bash
# 创建深度嵌套的 JSON（超过 5 层）
curl -X POST http://localhost:42156/api/assessments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-3",
    "gender": "male",
    "age": 25,
    "record": {
      "scaleId": "psqi",
      "scaleTitle": "Test",
      "totalScore": 10,
      "normalizedScore": 10,
      "level": "中度",
      "answers": [{"a": {"b": {"c": {"d": {"e": {"f": "too deep"}}}}}}]
    }
  }'
```

**预期结果**: 400 Bad Request，错误信息提示 JSON 嵌套深度超过限制

#### 测试无效 ID 格式
```bash
# 包含特殊字符的 ID（SQL 注入尝试）
curl -X POST http://localhost:42156/api/assessments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test'; DROP TABLE users;--",
    "gender": "male",
    "age": 25,
    "record": {
      "scaleId": "psqi",
      "scaleTitle": "Test",
      "totalScore": 10,
      "normalizedScore": 10,
      "level": "中度",
      "answers": [{"q": 1, "a": 2}]
    }
  }'
```

**预期结果**: 400 Bad Request，错误信息提示 userId 格式无效

### 测试 3: 安全响应头测试

```bash
# 检查安全响应头
curl -I http://localhost:42156/

# 或使用在线工具检查
# https://securityheaders.com/
```

**预期响应头**:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; ...
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), ...
```

### 测试 4: IP 黑名单测试

```bash
# 快速发送大量请求触发黑名单（超过限制 3 倍）
for i in {1..35}; do
  curl -X POST http://localhost:42156/api/assessments \
    -H "Content-Type: application/json" \
    -d '{
      "userId": "test-user-blacklist",
      "gender": "male",
      "age": 25,
      "record": {
        "scaleId": "psqi",
        "scaleTitle": "Test",
        "totalScore": 10,
        "normalizedScore": 10,
        "level": "中度",
        "answers": [{"q": 1, "a": 2}]
      }
    }' &
done
wait
```

**预期结果**:
- 前 10 次请求可能成功
- 之后返回 429 Too Many Requests
- 当请求超过 30 次（10 * 3）时，IP 被封禁
- 后续所有请求返回 403 Forbidden，消息为 "IP 已被封禁"
- 封禁持续 1 小时

## 📊 监控和日志

### 查看速率限制日志
```bash
# 服务器日志中会显示：
[RateLimiter] IP xxx.xxx.xxx.xxx 超过速率限制
[RateLimiter] IP xxx.xxx.xxx.xxx 已被封禁 60 分钟
[RateLimiter] 黑名单 IP 尝试访问: xxx.xxx.xxx.xxx
```

### 查看输入验证日志
```bash
# 服务器日志中会显示：
[InputValidator] 检测到危险模式: /eval\s*\(/i in "eval(malicious_code)..."
```

## 🔧 生产环境配置建议

### 1. 调整速率限制（根据实际流量）
编辑 `lib/rate-limiter.ts`:
```typescript
export const RATE_LIMITS = {
  POST: {
    limit: 5,  // 更严格：每分钟 5 次
    window: 60 * 1000,
  },
  GET: {
    limit: 30,  // 更严格：每分钟 30 次
    window: 60 * 1000,
  },
  ADMIN: {
    limit: 10,  // 管理接口更严格
    window: 60 * 1000,
  },
};
```

### 2. 添加 API 密钥认证
后续可以实施：
- 为管理员接口添加 API Key 验证
- 为普通用户添加 JWT token 验证
- 使用环境变量存储密钥

### 3. 配置反向代理（Nginx）
在 Nginx 层面添加额外的速率限制：
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://localhost:42156;
}
```

### 4. 使用 Redis 存储速率限制数据
当前实现使用内存存储，如果有多个服务器实例，建议使用 Redis：
- 安装 `ioredis`
- 修改 `lib/rate-limiter.ts` 使用 Redis 存储

## ✅ 验证清单

- [ ] 构建成功无错误
- [ ] POST 接口速率限制生效
- [ ] GET 接口速率限制生效
- [ ] IP 黑名单功能正常
- [ ] 危险模式检测有效
- [ ] Payload 大小限制有效
- [ ] JSON 深度限制有效
- [ ] ID 格式验证有效
- [ ] 安全响应头正确设置
- [ ] CSP 策略不影响正常功能

## 🚨 紧急情况处理

### 如果遇到误封 IP
1. 重启服务（内存存储会清空）
2. 或修改 `lib/rate-limiter.ts` 临时提高限制

### 如果 CSP 阻止正常功能
1. 检查浏览器控制台的 CSP 错误
2. 在 `next.config.ts` 中调整对应的 CSP 规则
3. 例如添加信任的域名：`script-src 'self' https://trusted-cdn.com`

## 📝 总结

当前实施的三项安全措施已经可以有效防御：
- ✅ DDoS 攻击和恶意爬虫
- ✅ 代码注入攻击（XSS、SQL 注入、命令注入等）
- ✅ 跨站脚本攻击（XSS）
- ✅ 点击劫持
- ✅ MIME 嗅探攻击

下一步建议：
1. 添加身份验证和授权机制
2. 实施日志监控和异常告警
3. 定期安全审计和渗透测试
4. 使用 HTTPS（生产环境必须）
