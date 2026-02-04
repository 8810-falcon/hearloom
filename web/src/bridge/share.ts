export const getSharedUrlFromLocation = (): string => {
  const params = new URLSearchParams(window.location.search);
  return params.get('sharedUrl') || params.get('url') || params.get('text') || '';
};
