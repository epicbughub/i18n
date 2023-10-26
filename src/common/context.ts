import type { Context } from "../types";

/**
 * Returns a new context object with default values.
 */
export function createDefaultContext(): Context {
  return {
    locales: {},
    currentLocale: '',
    defaultLocale: '',
    initialized: false,
  };
}
