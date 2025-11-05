'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // 当菜单打开时，防止页面滚动
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // 清理函数
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
    <header className="sticky top-0 z-50 glass-effect border-b border-neutral-200/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <nav className="flex items-center justify-between">
          {/* Logo - 响应式优化 */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity group">
            <div className="relative">
              <Image
                src="/knowyourself_logo.png"
                alt="KnowYourself Logo"
                width={32}
                height={32}
                className="object-contain transition-transform group-hover:scale-110 md:w-10 md:h-10"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-bold gradient-text">KnowYourself</span>
              {/* 移动端隐藏副标题 */}
              <span className="hidden sm:block text-xs text-neutral-500 font-light">知己——了解更真实的自己</span>
            </div>
          </Link>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="/#scales"
              className="relative text-neutral-700 hover:text-primary transition-colors font-medium text-sm group"
            >
              量表测评
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/history"
              className="relative text-neutral-700 hover:text-primary transition-colors font-medium text-sm group"
            >
              测评历史
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/about"
              className="relative text-neutral-700 hover:text-primary transition-colors font-medium text-sm group"
            >
              关于我们
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* 移动端汉堡菜单按钮 */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden relative w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="菜单"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-neutral-700 transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-neutral-700 transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-neutral-700 transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              ></span>
            </div>
          </button>
        </nav>
      </div>
    </header>

      {/* 移动端抽屉菜单 - 移到 header 外面 */}
      {isMobileMenuOpen && (
        <>
          {/* 遮罩层 */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
            style={{ zIndex: 9998 }}
            onClick={closeMobileMenu}
          ></div>

          {/* 抽屉内容 */}
          <div
            className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl md:hidden animate-slide-in-right"
            style={{ zIndex: 9999 }}
          >
            <div className="flex flex-col h-full">
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <Image
                    src="/knowyourself_logo.png"
                    alt="KnowYourself Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                  <div className="flex flex-col">
                    <span className="text-base font-bold gradient-text">KnowYourself</span>
                    <span className="text-[10px] text-neutral-400 font-light">专业心理测评</span>
                  </div>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="w-9 h-9 flex items-center justify-center hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label="关闭菜单"
                >
                  <span className="text-2xl text-neutral-500 leading-none">×</span>
                </button>
              </div>

              {/* 导航链接 */}
              <nav className="flex-1 overflow-y-auto py-2">
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">导航</p>
                </div>
                <Link
                  href="/#scales"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-5 py-3 mx-2 rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary transition-colors font-medium text-sm"
                >
                  <span className="text-lg">📝</span>
                  <span>量表测评</span>
                </Link>
                <Link
                  href="/history"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-5 py-3 mx-2 rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary transition-colors font-medium text-sm"
                >
                  <span className="text-lg">📜</span>
                  <span>测评历史</span>
                </Link>
                <Link
                  href="/about"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-5 py-3 mx-2 rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary transition-colors font-medium text-sm"
                >
                  <span className="text-lg">ℹ️</span>
                  <span>关于我们</span>
                </Link>

                <div className="my-3 mx-4 border-t border-neutral-200"></div>

                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">其他</p>
                </div>
                <Link
                  href="/terms"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-5 py-3 mx-2 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors text-sm"
                >
                  <span className="text-lg">📄</span>
                  <span>用户协议</span>
                </Link>
                <Link
                  href="/privacy"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-5 py-3 mx-2 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors text-sm"
                >
                  <span className="text-lg">🔒</span>
                  <span>隐私政策</span>
                </Link>
                <Link
                  href="/disclaimer"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-5 py-3 mx-2 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors text-sm"
                >
                  <span className="text-lg">⚠️</span>
                  <span>免责声明</span>
                </Link>
              </nav>

              {/* 底部信息 */}
              <div className="p-4 border-t border-neutral-200 bg-gradient-to-br from-primary-50/50 to-purple-50/50">
                <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
                  © 2025 KnowYourself<br/>
                  了解更真实的自己
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
