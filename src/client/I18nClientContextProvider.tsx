'use client';

import { PropsWithChildren, createContext } from 'react';

import { I18nContext } from '../types';

export const i18nContext = createContext<I18nContext>({
  translations: {},
  currentLocale: '',
  defaultLocale: '',
});

type Props = PropsWithChildren & {
  context: I18nContext;
};

export default function I18nClientContextProvider({
  context,
  children,
}: Props) {
  return (
    <i18nContext.Provider value={context}>{children}</i18nContext.Provider>
  );
}
