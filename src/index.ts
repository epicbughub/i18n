import { Translations } from "./types";

export const i18n = {
  currentLocale: 'us',
  defaultLocale: 'us',
  defaultNamespace: 'default',
  loaded: new Map<string, Map<string, Translations>>(),

  // Will be overriden in server/index.ts
  // Not necessary on client side.
  path: '',
};
