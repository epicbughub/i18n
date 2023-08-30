import path from 'node:path';
import fs from 'node:fs/promises';

import { createTranslator } from '../shared';
import { I18nContext, LocaleParam, NamespaceParam } from '../types';

export const i18nContext: I18nContext = {
  translations: {},
  currentLocale: '',
  defaultLocale: 'us',
};

/**
 * Initializes i18n features, this function must be called in every
 * page where you need localization.
 */
export async function i18nInit(locale: string) {
  // TODO: Load config file, this function should be async.
  i18nContext.currentLocale = locale;

  return translator;
}

async function loadFile(locale: string, namespace: string) {
  const filepath = path.join(
    process.cwd(),
    'public',
    'locales',
    locale,
    `${namespace}.json`
  );
  try {
    return JSON.parse(await fs.readFile(filepath, 'utf8'));
  } catch (e) {
    console.warn(
      `[i18n] Failed to load "${filepath}": ${(e as Error).message}`
    );
    return {};
  }
}

export async function loadTranslations(
  namespace?: NamespaceParam,
  locale?: LocaleParam
) {
  const { currentLocale, defaultLocale, translations } = i18nContext;

  let namespacesToLoad = ['common'];

  if (namespace) {
    namespacesToLoad = namespacesToLoad.concat(namespace);
  }

  let localesToLoad = [defaultLocale, currentLocale];

  if (locale) {
    localesToLoad = localesToLoad.concat(locale);
  }

  for (const loc of localesToLoad) {
    if (!translations[loc]) {
      translations[loc] = {};
    }

    for (const ns of namespacesToLoad) {
      if (!translations[loc]![ns]) {
        translations[loc]![ns] = await loadFile(loc, ns);
      }
    }
  }
}

/**
 * Returns a translator function tied to the given namespace.
 * If no namespace is provided the default namespace is used.
 * If locale is provided, those additional locales will be
 * available to use if it is specified in the translation
 * keys.
 */
export async function translator(namespace?: NamespaceParam, locale?: LocaleParam) {
  // Load translations for the necessary locales and namespaces.
  await loadTranslations(namespace, locale);

  // Return a fresh translator function.
  return createTranslator(namespace, i18nContext);
}
