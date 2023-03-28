import { formatCurrency } from '../utils/price-formtter';

function formatVariantPrice({
  amount,
  baseAmount,
  currencyCode,
  locale,
}: {
  baseAmount: number;
  amount: number;
  currencyCode: string;
  locale: string;
}) {
  const hasDiscount = baseAmount > amount;
  const formatDiscount = new Intl.NumberFormat(locale, { style: 'percent' });
  const discount = hasDiscount
    ? formatDiscount.format((baseAmount - amount) / baseAmount)
    : null;

  const price = formatCurrency(amount, currencyCode);
  const basePrice = hasDiscount
    ? formatCurrency(baseAmount, currencyCode)
    : null;

  return price;
}

export function usePrice(
  data?: {
    amount: number;
    baseAmount?: number;
    currencyCode: string;
  } | null
): string {
  const { amount, baseAmount, currencyCode } = data ?? {};
  if (typeof amount !== 'number' || !currencyCode) return '';

  return baseAmount
    ? formatVariantPrice({ amount, baseAmount, currencyCode, locale: 'en' })
    : formatCurrency(amount, currencyCode);
}
