export type Translations = { [key: string]: string };
export type Namespaces = { [namespace: string]: Translations };
export type Locales = { [locale: string]: Namespaces };

export type Context = {
  locales: Locales;
  currentLocale: string;
};

export type Config = {
  defaultLocale: string;
  localesDirectory: string;
};
