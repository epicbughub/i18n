import { describe, expect, test, vi } from 'vitest';

import { getContext } from '../../src/server/context';
import esTestTranslations from '../locales/es/test.json';
import usTestTranslations from '../locales/us/test.json';
import esCommonTranslations from '../locales/es/common.json';
import usCommonTranslations from '../locales/us/common.json';
import { createDefaultContext } from '../../src/common/context';
import {
  initialize,
  translator,
  loadTranslations,
  loadTranslationsFile,
} from '../../src/server/translator';

describe('Translator Tests', () => {
  test('Set the current locale on initialization', () => {
    const context = getContext();

    expect(context).toEqual(createDefaultContext());

    initialize('us');
    expect(context.currentLocale).toBe('us');

    initialize('es');
    expect(context.currentLocale).toBe('es');
  });

  test('Function translator() returns a translation function', async () => {
    const t = await translator();

    expect(t).toBeTypeOf('function');
  });

  test('Return an empty object if translations file cannot be loaded', async () => {
    const consoleSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    const emptyTranslations = await loadTranslationsFile(
      'unknown_locale',
      'unknown_namespace',
    );

    expect(emptyTranslations).toEqual({});
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockReset();
  });

  test('Load translations file for the specified locale and namespace', async () => {
    const usCommon = await loadTranslationsFile(
      'us',
      'common',
    );

    expect(usCommon).toEqual(usCommonTranslations);
  });

  test('Load translations into the context object', async () => {
    const context = getContext();

    await loadTranslations(['us', 'es'], ['common', 'test']);

    expect(context.locales).toEqual({
      us: {
        common: usCommonTranslations,
        test: usTestTranslations,
      },
      es: {
        common: esCommonTranslations,
        test: esTestTranslations,
      },
    });
  });

  test('Load default locale and common namespace even if not specified', async () => {
    const context = getContext();

    await loadTranslations(['es'], ['test']);

    expect(context.locales).toEqual({
      us: {
        common: usCommonTranslations,
        test: usTestTranslations,
      },
      es: {
        common: esCommonTranslations,
        test: esTestTranslations,
      },
    });
  });

  test('Load default translations when the translator() function is called', async () => {
    const context = getContext();

    await translator();

    expect(context.locales).toEqual({
      us: {
        common: usCommonTranslations,
      },
    });
  });
});
