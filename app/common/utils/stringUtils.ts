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

export function getFullPriceString(amount: string, currency: string): string {
  if(currency === "VND") {
    return formatVnd(amount) + "₫";
  }
  if(currency === "USD") {
    return "$" + formatUsd(amount);
  }
  return amount + " " + currency;
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