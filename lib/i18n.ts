export type Locale = 'en' | 'rw' | 'fr';

const messages: Record<Locale, Record<string, string>> = {
  en: {
    'app.name': 'MyTools',
    'home.tagline': 'A neutral tools app providing access to helpful services and information.',
    'home.directory': 'Service Directory',
    'home.hub': 'Info Hub',
    'home.emergency': 'Emergency Card',
    'admin.title': 'MyTools Admin',
    'admin.login': 'Admin Login',
  },
  rw: {},
  fr: {},
};

export function getMessage(locale: Locale, key: string): string {
  return messages[locale][key] ?? messages.en[key] ?? key;
}
