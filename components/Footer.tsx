import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <p className="text-neutral-300 font-medium">&copy; 2025 KnowYourself 知己. All rights reserved.</p>
          <p className="mt-3 text-sm font-light">了解更真实的自己 · 专注于心理健康与自我认知</p>
        </div>
        <div className="flex justify-center gap-8 text-sm mb-4">
          <Link href="/terms" className="hover:text-white transition-colors font-medium">
            用户协议
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors font-medium">
            隐私政策
          </Link>
          <Link href="/disclaimer" className="hover:text-white transition-colors font-medium">
            免责声明
          </Link>
        </div>
        <div className="text-center text-xs">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            京ICP备2025151219号-1
          </a>
        </div>
      </div>
    </footer>
  );
}
