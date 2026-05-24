'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  MapPin,
  BookOpen,
  HeartPulse,
  Bookmark,
  User,
  ArrowLeft,
} from 'lucide-react';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/directory', label: 'Directory', icon: MapPin },
  { href: '/hub', label: 'Info hub', icon: BookOpen },
  { href: '/emergency', label: 'Emergency', icon: HeartPulse },
  { href: '/bookmarks', label: 'Saved', icon: Bookmark },
  { href: '/account', label: 'Account', icon: User },
];

export default function PublicNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 pt-3 text-xs">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
      >
        <ArrowLeft className="h-3 w-3" />
        Back
      </button>

      <div className="flex flex-wrap justify-end gap-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] ${
                active
                  ? 'bg-brand-700 text-white'
                  : 'bg-white/80 text-slate-700 border border-slate-200 hover:border-brand-300'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
