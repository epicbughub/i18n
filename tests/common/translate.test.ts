import { beforeEach, describe, expect, test } from 'vitest';

import { getContext } from '../../src/server/context';
import { getKeyParts, getTranslation, translate } from '../../src/common';
import { initialize, loadTranslations } from '../../src/server/translator';

describe('Translate Tests', () => {
  beforeEach(async () => {
    initialize('us');
    await loadTranslations(['es'], ['test']);
  });

  test('Get key parts from a full key', () => {
    expect(getKeyParts('locale/namespace:key', getContext())).toEqual({
      key: 'key',
      locale: 'locale',
      namespace: 'namespace',
    });
  });

  test('Get key parts from a key with only namespace and key', () => {
    expect(getKeyParts('namespace:key', getContext())).toEqual({
      key: 'key',
      locale: 'us',
      namespace: 'namespace',
    });
  });

  test('Get key parts from a key with locale and key', () => {
    expect(getKeyParts('locale/key', getContext())).toEqual({
      key: 'key',
      locale: 'locale',
      namespace: 'common',
    });
  });

  test('Get key parts from a single key', () => {
    expect(getKeyParts('key', getContext())).toEqual({
      key: 'key',
      locale: 'us',
      namespace: 'common',
    });
  });

  test('Get translated text from loaded translations', () => {
    expect(
      getTranslation(
        { locale: 'us', key: 'common_key', namespace: 'common' },
        getContext(),
      ),
    ).toBe('US Common Key');

    expect(
      getTranslation(
        { locale: 'us', key: 'test_key', namespace: 'test' },
        getContext(),
      ),
    ).toBe('US Test Key');

    expect(
      getTranslation(
        { locale: 'es', key: 'common_key', namespace: 'common' },
        getContext(),
      ),
    ).toBe('ES Common Key');

    expect(
      getTranslation(
        { locale: 'es', key: 'test_key', namespace: 'test' },
        getContext(),
      ),
    ).toBe('ES Test Key');
  });

  test('Fallback to common namespace if the translation is missing in the specified namespace', () => {
    expect(
      getTranslation(
        {
          locale: 'es',
          namespace: 'test',
          key: 'missing_key_in_test_namespace',
        },
        getContext(),
      ),
    ).toBe('ES Common Missing Key In Test Namespace');
  });

  test('Fallback to default locale if the translation is missing in the specified locale', () => {
    expect(
      getTranslation(
        {
          locale: 'es',
          namespace: 'test',
          key: 'missing_key_in_es_locale',
        },
        getContext(),
      ),
    ).toBe('US Test Missing Key In ES Locale');
  });

  test('Fallback to default locale and common namespace if the translation is missing in the specified locale and namespace', () => {
    expect(
      getTranslation(
        {
          locale: 'es',
          namespace: 'test',
          key: 'missing_key_in_es_locale_test_namespace',
        },
        getContext(),
      ),
    ).toBe('US Common Missing Key In ES Locale Test Namespace');
  });

  test('Fallback to default locale and common namespace if they key is missing in the specified locale and namespace', () => {
    expect(
      getTranslation(
        {
          locale: 'es',
          namespace: 'test',
          key: 'missing_key_in_es_locale_test_namespace',
        },
        getContext(),
      ),
    ).toBe('US Common Missing Key In ES Locale Test Namespace');
  });

  test('Returns null if the translation is not found anywhere', () => {
    expect(
      getTranslation(
        {
          locale: 'es',
          namespace: 'test',
          key: 'not_found_anywhere',
        },
        getContext(),
      ),
    ).toBeNull();
  });

  test('Translate the given key', () => {
    const translation = translate('welcome', getContext());

    expect(translation).toBe('Welcome!');
  });

  test('Returns the full key name if translation is not found', () => {
    expect(translate('missing_key', getContext())).toBe(
      'us/common:missing_key',
    );

    expect(translate('namespace:missing_key', getContext())).toBe(
      'us/namespace:missing_key',
    );

    expect(translate('locale/namespace:missing_key', getContext())).toBe(
      'locale/namespace:missing_key',
    );
  });
});
