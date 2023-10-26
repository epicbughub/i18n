import { describe, expect, it } from 'vitest';

import TestConfig from '../../i18n.config.json';
import {
  loadConfig,
} from '../../src/server/config';

describe('Config Tests', () => {
  it('Throws an error if config file cannot be loaded', async () => {
    await expect(() => loadConfig('missing.config.json')).rejects.toThrowError(
      'Error loading config file',
    );
  });

  it('Reads config file', async () => {
    const config = await loadConfig();

    expect(config).toEqual(TestConfig);
  });
});
