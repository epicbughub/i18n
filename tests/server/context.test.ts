import { describe, expect, it } from 'vitest';

import type { Context } from '../../src/types';
import { getContext } from '../../src/server/context';

describe('Context Tests', () => {
  it('Gets the context', () => {
    const context = getContext();

    expect(context).toEqual<Context>({
      locales: {},
      initialized: false,
      currentLocale: '',
      defaultLocale: '',
    });
  });
});
