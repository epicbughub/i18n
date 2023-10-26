import { useTranslator } from '../../src/client/useTranslator';

export default function SomeClientComponent() {
  const t = useTranslator();

  return <div>{t('welcome')}</div>;
}
