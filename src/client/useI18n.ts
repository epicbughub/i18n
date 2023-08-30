import { useContext } from 'react';

import { NamespaceParam } from '../types';
import { createTranslator } from '../shared';
import { i18nContext } from './I18nClientContextProvider';

export default function useI18n(namespace?: NamespaceParam) {
  return createTranslator(namespace, useContext(i18nContext));
}
