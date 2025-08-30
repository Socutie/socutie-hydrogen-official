import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {formatVnd, getFullPriceString} from '~/common/utils/stringUtils';
import {useLocation} from 'react-router';
import {getAvailableLocaleFromPathname} from '~/common/utils/i18nUtils';

export function ProductPrice({
  price,
  compareAtPrice,
  size = 'normal'
}: {
  price: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  size?: 'normal' | 'small';
}) {
  const location = useLocation();
  return (
    <div>
      {compareAtPrice && Number(compareAtPrice.amount) > Number(price.amount) ? (
        <SalePriceDisplay/>
      ) : price ? (
        <div className={`${size === "normal" ? "text-xl text-light-main" : "text-sm lg:text-base text-light-text2"} font-[500] `}>{getFullPriceString(price.amount, price.currencyCode, getAvailableLocaleFromPathname(location.pathname))}</div>
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );

  function SalePriceDisplay() {
    return (
      <div className={`flex ${size === "normal" ? "gap-3" : "gap-1"} items-center`}>
        <div className={`${size === "normal" ? "text-xl" : "text-sm lg:text-base"} font-[600] text-light-main`}>{getFullPriceString(price.amount, price.currencyCode, getAvailableLocaleFromPathname(location.pathname))}</div>
        <div className={`text-sm font-normal text-light-text2 line-through decoration-light-text2`}>{getFullPriceString(compareAtPrice!.amount, compareAtPrice!.currencyCode, getAvailableLocaleFromPathname(location.pathname))}</div>
      </div>
    )
  }
}
