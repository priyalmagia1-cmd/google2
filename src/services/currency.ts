import { CurrencyCode } from '../types';

export const USD_TO_INR_RATE = 85; // Fixed conversion rate $1 = ₹85

export function convertPrice(amountUSD: number, currency: CurrencyCode): number {
  if (currency === 'INR') {
    return Math.round(amountUSD * USD_TO_INR_RATE);
  }
  return amountUSD;
}

export function formatPrice(amountUSD: number, currency: CurrencyCode): string {
  if (currency === 'INR') {
    const inrValue = Math.round(amountUSD * USD_TO_INR_RATE);
    return `₹${inrValue.toLocaleString('en-IN')}`;
  }
  return `$${amountUSD.toFixed(2)}`;
}

export function formatDirectPrice(amount: number, currency: CurrencyCode): string {
  if (currency === 'INR') {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  }
  return `$${amount.toFixed(2)}`;
}
