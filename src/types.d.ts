export type Translations = { [key: string]: string };
export type Namespaces = { [namespace: string]: Translations };
export type Locales = { [locale: string]: Namespaces };

export type Context = {
  locales: Locales;
  currentLocale: string;
  // This value is taken from Config when translations are loaded.
  defaultLocale: string;
};

export type Config = {
  defaultLocale: string;
  localesDirectory: string;
};

export type KeyParts = {
  key: string;
  locale: string;
  namespace: string;
};
