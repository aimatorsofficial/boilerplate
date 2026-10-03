export const formatDate = (isoDate: string, language: string) =>
  new Intl.DateTimeFormat(language, { dateStyle: 'medium' }).format(new Date(isoDate));

export const formatNumber = (value: number, language: string) =>
  new Intl.NumberFormat(language).format(value);
