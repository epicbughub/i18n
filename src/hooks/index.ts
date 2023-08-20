export function useTranslate() {
  return (key: string) => {
    return `(client) translate ${key}`;
  };
}
