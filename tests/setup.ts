import { beforeEach, vi } from 'vitest';

import type { Context } from '../src/types';
import { createDefaultContext } from '../src/common/context';

let context: Context;

// Mock React's cache function.
vi.mock('react', () => {
  return {
    cache: () => {
      return () => context;
    },
  };
});

beforeEach(() => {
  // Get a fresh context for the mocked `React.cache()`
  // function for each test.
  context = createDefaultContext();
});
