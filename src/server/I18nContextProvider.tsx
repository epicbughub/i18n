import 'server-only';

import { i18nContext, loadTranslations } from '.';
import { LocaleParam, NamespaceParam } from '../types';
import I18nClientContextProvider from '../client/I18nClientContextProvider';

export default async function I18nContextProvider({
  locale,
  children,
  namespace,
}: {
  children: any;
  locale?: LocaleParam;
  namespace?: NamespaceParam;
}) {
  if (namespace) {
    await loadTranslations(namespace, locale);
  }

  return (
    <I18nClientContextProvider children={children} context={i18nContext} />
  );
}
