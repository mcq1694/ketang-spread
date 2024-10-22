export const phoneFormat = (value: string) => {
  return value.replace(/^(\d{3})(\d{4})(\d+)$/, '$1****$3');
};
