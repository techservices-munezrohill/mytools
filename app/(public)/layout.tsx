import OnboardingOverlay from '@/components/OnboardingOverlay';
import QuickExitButton from '@/components/QuickExitButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import LowDataModeToggle from '@/components/LowDataModeToggle';
import PublicNav from '@/components/PublicNav';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <OnboardingOverlay />
      <QuickExitButton />

      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 pt-2 text-xs">
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <LowDataModeToggle />
        </div>
      </div>

      <PublicNav />

      <main className="mx-auto max-w-3xl px-4 py-4">{children}</main>
      <footer className="mx-auto max-w-3xl px-4 pb-6 pt-2 text-center text-[11px] text-slate-400">
        <Link href="/privacy" className="underline hover:text-brand-600">
          Privacy &amp; trust
        </Link>
      </footer>
    </div>
  );
}
