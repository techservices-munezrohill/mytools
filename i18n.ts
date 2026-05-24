import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = ['en', 'rw', 'fr'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export default getRequestConfig(async () => {
  // Sprint 3: read locale from cookie set by LanguageSwitcher. Fall back to EN.
  const cookieStore = cookies();
  const raw = cookieStore.get('locale')?.value;
  const locale: Locale = SUPPORTED_LOCALES.includes(raw as Locale)
    ? (raw as Locale)
    : DEFAULT_LOCALE;

  const messages = (await import(`./messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
