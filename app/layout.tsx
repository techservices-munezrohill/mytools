import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import './globals.css';
import AutoBlurOverlay from '@/components/AutoBlurOverlay';
import PwaInit from '@/components/PwaInit';
import UmamiLoader from '@/components/UmamiLoader';
import CaptureReferral from '@/components/CaptureReferral';

export const metadata: Metadata = {


  title: 'MyTools',
  description: 'A neutral tools app providing access to local services and information.',
  manifest: '/manifest.json',
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <PwaInit />
          <AutoBlurOverlay />
          <UmamiLoader />
          <CaptureReferral />
          {children}
        </NextIntlClientProvider>


      </body>
    </html>
  );
}
