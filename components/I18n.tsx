"use client";

import { createContext, useContext } from 'react';
import type { Locale } from '@/lib/i18n';
import { getMessage } from '@/lib/i18n';

const I18nContext = createContext<Locale>('en');

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={locale}>{children}</I18nContext.Provider>;
}

export function useT() {
  const locale = useContext(I18nContext);
  return (key: string) => getMessage(locale, key);
}
