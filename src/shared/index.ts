import { NamespaceParam } from '../types';

function getKeyInfo(
  key: string,
  defaultLocale: string,
  defaultNamespace: string
): {
  key: string;
  locale: string;
  namespace: string;
} {
  const parts = key.split(':');

  // Only key is provided
  if (parts.length === 1) {
    return {
      key: parts.at(0)!,
      locale: defaultLocale,
      namespace: defaultNamespace,
    };
  }

  // Namespace and key are provided
  if (parts.length === 2) {
    return {
      key: parts.at(1)!,
      locale: defaultLocale,
      namespace: parts.at(0)!,
    };
  }

  // Locale, namespace and key are provider
  return {
    key: parts.at(2)!,
    locale: parts.at(0)!,
    namespace: parts.at(1)!,
  };
}

// TODO: Set type for i18nContext parameter.
export function createTranslator(
  namespace: NamespaceParam | undefined,
  i18nContext: any
) {
  const { currentLocale, defaultLocale, translations } = i18nContext;

  // The namespace used for all the calls to the translator function
  // if no namespace is specified within the translation key.
  const currentNamespace =
    namespace && typeof namespace === 'string' ? namespace : 'common';

  return (key: string, values?: Record<string, any>) => {
    const keyInfo = getKeyInfo(key, currentLocale, currentNamespace);

    let text = translations[keyInfo.locale]?.[keyInfo.namespace]?.[keyInfo.key];

    // Key not found in current locale and current namespace.
    // Looking for key in the default namespace.
    if (text === undefined && keyInfo.namespace !== 'common') {
      text = translations[keyInfo.locale]?.['common']?.[keyInfo.key];
    }

    // Key not found in current locale and default namespace.
    // Looking for key in default locale and current namespace.
    if (text === undefined) {
      text = translations[defaultLocale]?.[keyInfo.namespace]?.[keyInfo.key];
    }

    // Key not found in default locale and current namespace.
    // Looking for key in default locale and default namespace.
    if (text === undefined && keyInfo.namespace !== 'common') {
      text = translations[defaultLocale]?.['common']?.[keyInfo.key];
    }

    // Key not found in any available translation files.
    if (text === undefined) {
      text = `{${keyInfo.locale}:${keyInfo.namespace}:${keyInfo.key}}`;
    }

    if (typeof values === 'object') {
      return applyInterpolations(values, text);
    }

    return text;
  };
}

function applyInterpolations(values: Record<string, any>, text: string) {
  let output = text;

  for (const key in values) {
    output = output.replaceAll(`{${key}}`, values[key]);
  }

  return output.replaceAll('\\{', '{').replaceAll('\\}', '}');
}
