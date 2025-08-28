import type {CartApiQueryFragment} from '../../../storefrontapi.generated';
import type {CartLayout} from '~/components/cart/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useRef} from 'react';
import {FetcherWithComponents, Link, useLocation} from 'react-router';
import {formatVnd, getFullPriceString} from '~/common/utils/stringUtils';
import {ArrowRight, BadgePercent, TicketPercent} from 'lucide-react';
import {getAvailableLocaleFromPathname} from '~/common/utils/i18nUtils';
import {APP_STRINGS} from '~/common/constants/appStrings';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const location = useLocation();
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div
      aria-labelledby="cart-summary"
      className={`flex flex-col gap-2 w-full px-6 bg-light-bg1 border-t border-t-light-bg2 h-[170px] ${layout !== 'page' ? "absolute bottom-20 justify-end" : ""}`}
    >
      <div className="mb-1 flex justify-between items-center">
        <div className={"font-cute text-xl font-[600]"}>{APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].totalText}</div>
        <div className={"text-xl font-[500]"}>
          {cart.cost?.subtotalAmount?.amount ? (
            <div>{getFullPriceString(cart.cost?.subtotalAmount.amount, cart.cost?.subtotalAmount.currencyCode ?? "", getAvailableLocaleFromPathname(location.pathname))}</div>
          ) : (
            '-'
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TicketPercent size={24} className={"text-light-text3"}/>
        <div className={"text-sm text-light-text2 font-[500] tracking-tight truncate"}>{APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].discountText}</div>
      </div>
      {/*<CartDiscounts discountCodes={cart.discountCodes} />*/}
      {/*<CartGiftCard giftCardCodes={cart.appliedGiftCards} />*/}
      <div className={"mt-2"}>
        <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
      </div>

    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  const location = useLocation();

  if (!checkoutUrl) return null;
  return (
    <div>
      <a href={checkoutUrl} target="_self">
        <div className={`
          relative overflow-hidden flex gap-2 justify-center items-center
          text-sm font-[600] rounded-[6px] text-light-bg1 font-main
          bg-light-main py-3 border-2 border-light-main
          transition-all duration-300 ease-in-out
          hover:text-light-main
          before:absolute before:inset-0
          before:bg-light-bg1 before:translate-x-[-110%]
          before:transition-transform before:duration-500 before:ease-in-out
          hover:before:translate-x-0
        `}>
          <div className="relative z-10">{APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].checkoutText}</div>
          <ArrowRight size={20} className="relative z-10"/>
        </div>
      </a>
      <br />
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <input type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const codes: string[] =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current!.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div>
      {/* Have existing gift card applied, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Applied Gift Card(s)</dt>
          <UpdateGiftCardForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button onSubmit={() => removeAppliedCode}>Remove</button>
            </div>
          </UpdateGiftCardForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div>
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}
