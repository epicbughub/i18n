// @ts-ignore
import { cache } from 'react';

import type { Context } from '../types';

/**
 * Returns the i18n context for the current request.
 */
export const getContext: () => Context = cache(() => createDefaultContext());

/**
 * Returns a new context object with default values.
 */
export function createDefaultContext(): Context {
  return {
    locales: {},
    currentLocale: '',
  };
}
