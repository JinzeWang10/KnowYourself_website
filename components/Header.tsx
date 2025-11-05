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

      {/* 移动端抽屉菜单 */}
      {isMobileMenuOpen && (
        <>
          {/* 遮罩层 */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMobileMenu}
          ></div>

          {/* 抽屉内容 */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 md:hidden animate-slide-in-right">
            <div className="flex flex-col h-full">
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <Image
                    src="/knowyourself_logo.png"
                    alt="KnowYourself Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  <span className="text-lg font-bold gradient-text">KnowYourself</span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label="关闭菜单"
                >
                  <span className="text-xl text-neutral-600">×</span>
                </button>
              </div>

              {/* 导航链接 */}
              <nav className="flex-1 overflow-y-auto py-6">
                <Link
                  href="/#scales"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-6 py-4 text-neutral-700 hover:bg-primary-50 hover:text-primary transition-colors font-medium"
                >
                  <span className="text-xl">📝</span>
                  量表测评
                </Link>
                <Link
                  href="/history"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-6 py-4 text-neutral-700 hover:bg-primary-50 hover:text-primary transition-colors font-medium"
                >
                  <span className="text-xl">📜</span>
                  测评历史
                </Link>
                <Link
                  href="/about"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-6 py-4 text-neutral-700 hover:bg-primary-50 hover:text-primary transition-colors font-medium"
                >
                  <span className="text-xl">ℹ️</span>
                  关于我们
                </Link>
              </nav>

              {/* 底部装饰 */}
              <div className="p-6 border-t border-neutral-200 bg-gradient-to-br from-primary-50 to-purple-50">
                <p className="text-xs text-neutral-500 text-center font-light">
                  知己——了解更真实的自己
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
