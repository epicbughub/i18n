import { describe, expect, test } from 'vitest';

import type { Context } from '../../src/types';
import { createDefaultContext } from '../../src/common/context';

describe('', () => {
  test('Creates a context object with default values', () => {
    expect(createDefaultContext()).toEqual<Context>({
      locales: {},
      currentLocale: '',
      defaultLocale: '',
      initialized: false,
    });
  });
});
