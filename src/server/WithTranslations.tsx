import { initialize } from './translator';

export function WithTranslations(Component: any) {
  return async (props: { params: { locale: string } }) => {
    initialize(props.params.locale);

    return <Component {...props} />;
  };
}
