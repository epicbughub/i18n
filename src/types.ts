export type Translations = {
  [locale: string]:
  | {
    [namespace: string]:
    | {
      [key: string]: string | undefined;
    }
    | undefined;
  }
  | undefined;
};

export type I18nContext = {
  currentLocale: string;
  defaultLocale: string;
  translations: Translations;
};

export type LocaleParam = string | string[];
export type NamespaceParam = string | string[];
