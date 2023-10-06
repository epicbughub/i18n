import { describe, expect, it } from 'vitest';

import { Context } from '../../src/types';
import { getContext } from '../../src/server/context';

describe('Context Tests', () => {
  it('Gets the context', () => {
    const context = getContext();

    expect(context).toEqual<Context>({
      currentLocale: '',
      locales: {},
    });
  });
});
