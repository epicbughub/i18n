import { useContext } from 'react';

import I18nContext from './context';
import { translate } from '../common';

export function useTranslator() {
  const context = useContext(I18nContext);

  return (key: string) => translate(key, context);
}
