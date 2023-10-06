import { PropsWithChildren } from 'react';

import { getContext } from './context';
import { I18nClientProvider } from '../client';

/**
 * Wraps the children inside a `I18nClientProvider` so the client-side children
 * can access the current i18n context.
 */
export function I18nProvider({ children }: PropsWithChildren) {
  return (
    <>
      <I18nClientProvider context={getContext()}>{children}</I18nClientProvider>
    </>
  );
}
