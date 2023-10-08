import path from 'node:path';

import { loadConfig } from './config';
import { translate } from '../common';
import { getContext } from './context';
import { loadJSONFile } from './utils';
import type { Translations } from '../types';

/**
 * Initialize the context by specifying the `currentLocale` value which
 * will be used by other translation functions.
 */
export function initialize(locale: string) {
  getContext().currentLocale = locale;
}

/**
 * Load the translations file for the given `locale` and `namespace` and
 * returns an object containing the keys and translation texts. If the
 * translations file cannot be loaded it returns an empty object.
 */
export async function loadTranslationsFile(locale: string, namespace: string) {
  const config = await loadConfig();
  const filePath = path.resolve(
    config.localesDirectory,
    locale,
    `${namespace}.json`,
  );

  try {
    const translationsModule: Translations = await loadJSONFile(filePath);

    return translationsModule;
  } catch (e) {
    console.warn(
      `Fail to load translations file for locale: "${locale}", namespace: "${namespace}": ${(e as Error).message}`,
    );

    return {};
  }
}

export async function loadTranslations(
  locales: string[],
  namespaces: string[],
) {
  const context = getContext();
  const config = await loadConfig();

  // Update context.defaultLocale now that the value is loaded.
  // This helps to avoid calling loadConfig() in initialize() and keep it as a synchronious function.
  context.defaultLocale = config.defaultLocale;

  if (!locales.includes(config.defaultLocale)) {
    locales.push(config.defaultLocale);
  }

  if (!namespaces.includes('common')) {
    namespaces.push('common');
  }

  for (const locale of locales) {
    if (context.locales[locale] === undefined) {
      context.locales[locale] = {};
    }

    for (const namespace of namespaces) {
      if (context.locales[locale][namespace] === undefined) {
        context.locales[locale][namespace] = await loadTranslationsFile(
          locale,
          namespace,
        );
      }
    }
  }
}

export async function translator(
  namespace: string | string[] = [],
  locale: string | string[] = [],
) {
  const locales = ([] as string[]).concat(locale);
  const namespaces = ([] as string[]).concat(namespace);

  await loadTranslations(locales, namespaces);

  return (key: string) => translate(key, getContext());
}
