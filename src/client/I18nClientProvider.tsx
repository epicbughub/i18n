import { PropsWithChildren } from 'react';

import { Context } from '../types';
import I18nContext from './context';

export function I18nClientProvider({
  context,
  children,
}: PropsWithChildren<{ context: Context }>) {
  return (
    <I18nContext.Provider value={context}>{children}</I18nContext.Provider>
  );
}
