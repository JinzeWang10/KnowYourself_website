import Link from 'next/link';

export default function Header() {
  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <span className="text-2xl font-bold text-primary">心理量表</span>
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
