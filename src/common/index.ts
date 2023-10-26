import type { Context, KeyParts } from '../types';

export function getKeyParts(key: string, context: Context): KeyParts {
  let [locale, namespaceAndKey] = key.split('/', 2);

  if (namespaceAndKey === undefined) {
    locale = context.currentLocale;
    namespaceAndKey = key;
  }

  let [namespace, keyName] = namespaceAndKey.split(':', 2);

  if (keyName === undefined) {
    namespace = 'common';
    keyName = namespaceAndKey;
  }

  return {
    locale,
    namespace,
    key: keyName,
  };
}

export function getTranslation({ locale, namespace, key }: KeyParts, context: Context) {
  let translation = context.locales[locale]?.[namespace]?.[key];

  if (translation !== undefined) {
    return translation;
  }

  translation = context.locales[locale]?.common?.[key];

  if (translation !== undefined) {
    return translation;
  }

  translation = context.locales[context.defaultLocale]?.[namespace]?.[key];

  if (translation !== undefined) {
    return translation;
  }

  translation = context.locales[context.defaultLocale]?.common?.[key];

  if (translation !== undefined) {
    return translation;
  }

  return null;
}

export function translate(key: string, context: Context) {
  const keyParts = getKeyParts(key, context);
  const translation = getTranslation(keyParts, context);

  if (translation !== null) {
    return translation;
  }

  return `${keyParts.locale}/${keyParts.namespace}:${keyParts.key}`;
}
