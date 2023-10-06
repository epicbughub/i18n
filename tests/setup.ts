import { beforeEach, vi } from 'vitest';

import { Context } from '../src/types';
import { createDefaultContext } from '../src/server/context';

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
