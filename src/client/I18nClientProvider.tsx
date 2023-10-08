import { PropsWithChildren } from 'react';

import I18nContext from './context';
import type { Context } from '../types';

export function I18nClientProvider({
  context,
  children,
}: PropsWithChildren<{ context: Context }>) {
  return (
    <I18nContext.Provider value={context}>{children}</I18nContext.Provider>
  );
}
