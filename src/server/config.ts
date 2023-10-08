import path from 'node:path';

import type { Config } from '../types';
import { loadJSONFile } from './utils';

let CONFIG: Config;

const DEFAULT_CONFIG: Config = {
  defaultLocale: 'us',
  localesDirectory: path.join('public', 'locales'),
};

/**
 * Load config file and returns and object containing the loaded configuration.
 * Throws an error if config file cannot be loaded.
 */
export async function loadConfig(filepath: string = 'i18n.config.json') {
  if (CONFIG === undefined) {
    try {
      const config: Config = await loadJSONFile(path.resolve(filepath));

      CONFIG = { ...DEFAULT_CONFIG, ...config };
    } catch (e) {
      throw new Error(
        `@epicbug/i18n: Error loading config file: ${(e as Error).message}`,
      );
    }
  }

  return CONFIG;
}
