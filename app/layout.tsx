import type { Metadata } from 'next';
import './globals.css';
import QuickExitButton from '@/components/QuickExitButton';
import AutoBlurOverlay from '@/components/AutoBlurOverlay';
import PwaInit from '@/components/PwaInit';

export const metadata: Metadata = {
  title: 'MyTools',
  description: 'Neutral tools app providing access to local services and information.',
  manifest: '/manifest.json',
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <PwaInit />
        <AutoBlurOverlay />
        <div className="relative min-h-screen">
          <QuickExitButton />
          <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
