import path from 'node:path';
import fs from 'node:fs/promises';

import { i18n } from '../index';
import { Translations } from '../types';

setLocalesPath(path.join(process.cwd(), 'public', 'locales'));

export function setLocalesPath(path: string) {
  const oldPath = i18n.path;

  i18n.path = path;

  return oldPath;
}

export function setCurrentLocale(locale: string) {
  const oldLocale = i18n.currentLocale;

  i18n.currentLocale = locale;

  return oldLocale;
}

export async function loadTranslations(
  locale: string,
  namespace: string
): Promise<Translations> {
  const filepath = `${path.join(i18n.path, locale, namespace)}.json`;

  try {
    const json = await fs.readFile(filepath, 'utf8');

    return JSON.parse(json);
  } catch (e) {
    console.warn(`i18n failed to load ${filepath}: ${(e as Error).message}`);
  }

  return {};
}

export async function translate(
  namespace?: string | string[] | null,
  locale?: string
) {
  if (!locale) {
    locale = i18n.currentLocale;
  }

  if (!namespace) {
    namespace = i18n.defaultNamespace;
  }

  let namespaces: string[] = [];
  namespaces = namespaces.concat(namespace);

  for (const loc of [i18n.defaultLocale, locale]) {
    if (!i18n.loaded.has(loc)) {
      i18n.loaded.set(loc, new Map());
    }

    for (const ns of namespaces.concat(i18n.defaultNamespace)) {
      if (!i18n.loaded.get(loc)!.has(ns)) {
        i18n.loaded.get(loc)!.set(ns, await loadTranslations(loc, ns));
      }
    }
  }

  return function t(key: string): string {
    const { key: k, namespace } = getKeyParts(key, i18n.defaultNamespace);

    let translation: string | undefined;

    // Search on current locale and namespace
    translation = i18n.loaded.get(locale!)?.get(namespace)?.[k];

    if (translation === undefined) {
      // Search on given locale and default namespace
      translation = i18n.loaded.get(locale!)?.get(i18n.defaultNamespace)?.[k];
    }

    if (translation === undefined) {
      // Search on default locale and namespace
      translation = i18n.loaded.get(i18n.defaultLocale)?.get(namespace)?.[k];
    }

    if (translation === undefined) {
      // Search on default locale and default namespace
      translation = i18n.loaded
        .get(i18n.defaultLocale)
        ?.get(i18n.defaultNamespace)?.[k];
    }

    if (translation === undefined) {
      // Return missing key
      return `{${key}}`;
    }

    return translation;
  };
}

export function getKeyParts(
  key: string,
  fallbackNamespace: string
): { namespace: string; key: string } {
  const [part0, part1] = key.split(':');

  return {
    key: part1 || part0,
    namespace: part1 ? part0 : fallbackNamespace,
  };
}

export function serialize() {
  const output: { [key: string]: { [key: string]: Translations } } = {};

  i18n.loaded.forEach((namespaces, locale) => {
    if (!output[locale]) {
      output[locale] = {};
    }

    namespaces.forEach((translations, namespace) => {
      output[locale][namespace] = translations;
    });
  });

  return JSON.stringify(output, null, 2);
}
