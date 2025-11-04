import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <Image
            src="/knowyourself_logo.png"
            alt="KnowYourself Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">KnowYourself</span>
            <span className="text-xs text-gray-600">知己——了解更真实的自己</span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/#scales" className="text-gray-700 hover:text-primary transition">
            量表测评
          </Link>
          <Link href="/history" className="text-gray-700 hover:text-primary transition">
            测评历史
          </Link>
        </div>
      </nav>
    </header>
  );
}
