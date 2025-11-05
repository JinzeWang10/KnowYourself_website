import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-neutral-200/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
            <div className="relative">
              <Image
                src="/knowyourself_logo.png"
                alt="KnowYourself Logo"
                width={40}
                height={40}
                className="object-contain transition-transform group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold gradient-text">KnowYourself</span>
              <span className="text-xs text-neutral-500 font-light">知己——了解更真实的自己</span>
            </div>
          </Link>

          <div className="flex items-center gap-8">
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
        </nav>
      </div>
    </header>
  );
}
