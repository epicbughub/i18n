import { Context } from '../types';

export function translate(key: string, context: Context) {
  return `${context.currentLocale}:${key}`;
}
