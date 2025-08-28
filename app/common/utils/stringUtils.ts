import {AvailableLocale} from '~/common/utils/i18nUtils';

export function formatVnd(vnd: string): string {
  const vndNum = parseFloat(vnd);
  return vndNum.toLocaleString("vi-VN"); // formats with dots as thousand separators
}

export function formatUsd(usd: string): string {
  const usdNum = parseFloat(usd);
  return usdNum.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const USD_TO_VND_RATE = 26000;

function usdToVnd(usd: number): number {
  return usd * USD_TO_VND_RATE;
}

function vndToUsd(vnd: number): number {
  return vnd / USD_TO_VND_RATE;
}

function roundUsdTo99(price: number): number {
  return Math.round(price) - 0.01; // e.g. 16.15 → 15.99, 16.75 → 16.99
}

function roundUsdTo50(price: number): number {
  return Math.round(price * 2) / 2; // e.g. 16.15 → 16.00, 16.70 → 16.50
}

export function getFullPriceString(
  amount: string,
  currency: string,
  locale: AvailableLocale
): string {
  const numericAmount = parseFloat(amount);

  if (locale === "vi-vn") {
    if (currency === "VND") {
      return formatVnd(numericAmount.toString()) + "₫";
    }
    if (currency === "USD") {
      const exchanged = usdToVnd(numericAmount);
      return formatVnd(exchanged.toString()) + "₫";
    }
  }

  if (locale === "en-us") {
    if (currency === "USD") {
      return "$" + formatUsd(roundUsdTo99(numericAmount).toString());
    }
    if (currency === "VND") {
      const exchanged = vndToUsd(numericAmount);
      return "$" + formatUsd(roundUsdTo99(exchanged).toString());
    }
  }

  return amount + " " + currency; // fallback
}

export function discountPercentage(price: string, compareAt: string): string {
  const priceNum = Number(price);
  const compareAtNum = Number(compareAt);

  if (compareAtNum <= priceNum || compareAtNum === 0) return "0%";

  const discount = ((compareAtNum - priceNum) / compareAtNum) * 100;
  return `${Math.round(discount)}%`;
}

export function discountAmount(price: string, compareAt: string): string {
  const priceNum = Number(price);
  const compareAtNum = Number(compareAt);

  return `${Math.round(compareAtNum - priceNum)}`;
}