import path from 'node:path';
import {
  it,
  vi,
  expect,
  afterAll,
  describe,
  afterEach,
  beforeAll,
  SpyInstance,
} from 'vitest';

import { i18n } from '../src/index';

import {
  translate,
  getKeyParts,
  setLocalesPath,
  loadTranslations,
  setCurrentLocale,
} from '../src/server';

beforeAll(() => {
  // Use the locales test path.
  setLocalesPath(path.join(__dirname, 'locales'));
});

afterEach(() => {
  // Some tests change the curretLocale value, make sure
  // currentLocale is always restored to defaultLocale.
  i18n.currentLocale = i18n.defaultLocale;
});

describe('i18n', () => {
  describe('setCurrentLocale', () => {
    it('changes current locale', () => {
      const oldLocale = setCurrentLocale('es');

      expect(oldLocale).toBe('us');
      expect(i18n.currentLocale).toBe('es');
    });
  });

  describe('translate', () => {
    let warn: SpyInstance;

    beforeAll(() => {
      // Avoid noise in tests output.
      warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterAll(() => {
      // Restore console.warn()
      warn.mockReset();
    });

    it('returns a translation function', async () => {
      const t = await translate();

      expect(typeof t).toBe('function');
    });

    it('translates using current locale and default namespace', async () => {
      const t = await translate();

      expect(t('key_us_default')).toBe('us default');
    });

    it('translates using given locale and default namespace', async () => {
      const t = await translate(null, 'es');

      expect(t('key_es_default')).toBe('es default');
    });

    it('translates using given locale and given namespace', async () => {
      const t = await translate('test', 'es');

      expect(t('test:key_es_test')).toBe('es test');
    });

    it('translates for multiple namespaces', async () => {
      const t = await translate(['test', 'extra']);

      expect(t('test:key_us_test')).toBe('us test');
      expect(t('extra:key_us_extra')).toBe('us extra');
    });

    it('fallbacks translation to default locale', async () => {
      let t = await translate(null, 'es');

      // key_es_default exists in es/default.json
      expect(t('key_es_default')).toBe('es default');

      // key_us_default does not exist in es/default.json
      // fallback to us/default.json
      expect(t('key_us_default')).toBe('us default');

      t = await translate();
      // key_es_default does not exist in us/default.json
      // fallback to missing key
      expect(t('key_es_default')).toBe('{key_es_default}');
    });

    it('fallbacks translations to default namespace', async () => {
      const t = await translate('test');

      // key_us_test exists in us/test.json
      expect(t('test:key_us_test')).toBe('us test');

      // key_us_default does not exist in us/test.json
      // fallback to us/default.json
      expect(t('test:key_us_default')).toBe('us default');
    });

    it('returns missing key if not found in any namespace', async () => {
      const t = await translate(['test', 'extra']);

      // key_missing does not exist in us/test.json
      // key_missing does not exist in us/default.json
      expect(t('test:key_missing')).toBe('{test:key_missing}');
      // key_missing does not exist in us/extra.json
      // key_missing does not exist in us/default.json
      expect(t('extra:key_missing')).toBe('{extra:key_missing}');
    });

    it('returns missing key if not found in given locale and any namespace', async () => {
      const t = await translate(['test', 'extra'], 'es');

      // key_missing does not exist in es/test.json
      // key_missing does not exist in es/default.json
      // key_missing does not exist in us/test.json
      // key_missing does not exist in us/default.json
      expect(t('test:key_missing')).toBe('{test:key_missing}');
      // key_missing does not exist in es/extra.json
      // key_missing does not exist in es/default.json
      // key_missing does not exist in us/extra.json
      // key_missing does not exist in us/default.json
      expect(t('extra:key_missing')).toBe('{extra:key_missing}');
    });

    it('translates with fallback', async () => {
      const t = await translate('extra', 'es');

      expect(t('extra:key_fallback_default')).toBe('fallback us default');
    });

    it('changes current locale and translate correctly', async () => {
      setCurrentLocale('es');

      const t = await translate();

      expect(t('key_es_default')).toBe('es default');
    });
  });

  describe('getKeyParts', () => {
    it('gets key parts from a key without namespace', () => {
      expect(getKeyParts('key_name', 'default_namespace')).toEqual({
        key: 'key_name',
        namespace: 'default_namespace',
      });
    });

    it('gets key parts from a key with namespace', () => {
      expect(getKeyParts('home:welcome', 'default_namespace')).toEqual({
        key: 'welcome',
        namespace: 'home',
      });
    });
  });

  describe('loadTranslations', () => {
    it('imports translations for US', async () => {
      const translations = await loadTranslations('us', 'default');

      expect(translations).toEqual({
        key_us_default: 'us default',
        key_fallback_default: 'fallback us default',
      });
    });

    it('imports translations for ES', async () => {
      const translations = await loadTranslations('es', 'default');

      expect(translations).toEqual({
        key_es_default: 'es default',
      });
    });

    it('console.warn() and return empty object if translation file is missing', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const translations = await loadTranslations('uk', 'notfound');

      expect(warn).toBeCalledTimes(1);
      expect(translations).toEqual({});

      warn.mockReset();
    });
  });
});
