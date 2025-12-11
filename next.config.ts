import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // 安全响应头配置
  async headers() {
    return [
      {
        // 应用于所有路由
        source: '/:path*',
        headers: [
          // 内容安全策略 (CSP) - 防止 XSS 和代码注入
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // 允许来自自身和可信 CDN 的脚本
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net",
              // 样式：允许内联样式（Tailwind CSS 需要）
              "style-src 'self' 'unsafe-inline'",
              // 图片：允许 data: URI 和 blob: (html2canvas 需要)
              "img-src 'self' data: blob: https:",
              // 字体
              "font-src 'self' data:",
              // 连接：允许同源 API 调用
              "connect-src 'self'",
              // 框架：不允许被嵌入到 iframe
              "frame-ancestors 'none'",
              // 对象：禁止 Flash 等插件
              "object-src 'none'",
              // 基础 URI
              "base-uri 'self'",
              // 表单提交：只允许提交到自身
              "form-action 'self'",
              // 升级不安全请求（HTTP -> HTTPS）
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // HTTP Strict Transport Security (HSTS) - 强制 HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // 防止点击劫持
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // 防止 MIME 类型嗅探
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // XSS 保护（旧版浏览器）
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer 策略
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // 权限策略 - 禁用不需要的浏览器功能
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'payment=()',
              'usb=()',
              'magnetometer=()',
              'gyroscope=()',
              'accelerometer=()',
            ].join(', '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
