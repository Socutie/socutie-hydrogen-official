import {useOptimisticCart} from '@shopify/hydrogen';
import {Link, useLocation} from 'react-router';
import type {CartApiQueryFragment} from '../../../storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/cart/CartLineItem';
import {CartSummary} from '~/components/cart/CartSummary';
import {ArrowRight, ShoppingBag, ShoppingCart} from 'lucide-react';
import {APP_STRINGS} from '~/common/constants/appStrings';
import {getAvailableLocaleFromPathname, getAvailableLocaleUrlPartFromPathname} from '~/common/utils/i18nUtils';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = cart?.lines?.nodes?.length || 0;
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={`relative h-full w-full ${layout === 'page' ? " bg-red-500" : ""}`}>
      <div className={`flex flex-col px-6 h-[calc(100vh-250px)] ${layout === 'page' ? "max-w-screen-xl" : ""}`}>
        <CartEmpty hidden={linesCount !== 0} layout={layout} />
        <div aria-labelledby="cart-lines" className="max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-hidden">
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
      </div>

      {cartHasItems && (
        <CartSummary cart={cart} layout={layout} />
      )}

    </div>

  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const location = useLocation();

  const {close} = useAside();
  return (
    <div className={"h-full"} hidden={hidden}>
    <div className={"h-full w-full flex gap-6 flex-col justify-center items-center"}>
      <div className={"rounded-full bg-light-bg3 p-5"}>
        <ShoppingBag size={32} strokeWidth={1.75}/>
      </div>
      <div className={"text-2xl text-center font-[600] font-cute"}>{APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].cartEmptyText}</div>
      <div className={"font-main tracking-tight text-base text-light-text2 text-center max-w-[350px]"}>{APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].exploreBestSellersText}</div>
      <Link className={`
         relative overflow-hidden flex gap-2 justify-center items-center
          text-sm font-[600] rounded-[4px] text-light-bg1 font-main
          bg-light-main py-3 px-10 border-2 border-light-main
          transition-all duration-300 ease-in-out
          hover:text-light-main
          before:absolute before:inset-0
          before:bg-light-bg1 before:translate-x-[-110%]
          before:transition-transform before:duration-500 before:ease-in-out
          hover:before:translate-x-0
       `} to={getAvailableLocaleUrlPartFromPathname(location.pathname) + `/collections/best-sellers`} onClick={close} prefetch="viewport">
        <div className="relative z-10">OUR BEST SELLERS</div>
        <ArrowRight size={20} className="relative z-10"/>
      </Link>
    </div>
    </div>
  );
}
