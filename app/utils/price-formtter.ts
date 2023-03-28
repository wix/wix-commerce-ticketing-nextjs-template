export const formatCurrency = (
  price: number | string = 0,
  currency: string = 'USD'
) =>
  Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(Number(price));
