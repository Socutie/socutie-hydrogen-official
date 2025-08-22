import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/cart/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from '../ProductPrice';
import {useAside} from '../Aside';
import type {CartApiQueryFragment} from '../../../storefrontapi.generated';
import {Minus, Plus, X} from 'lucide-react';
import {formatVnd, getFullPriceString} from '~/utils/stringUtils';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <li key={id} className="cart-line">
      {image && (
        <Image
          alt={title}
          aspectRatio="3/4"
          data={image}
          loading="lazy"
          width={100}
        />
      )}

      <div className={"ml-1 w-full flex justify-between"}>
        {/* Left side */}
        <div className={"flex flex-col justify-between"}>
          <div>
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => {
                if (layout === 'aside') {
                  close();
                }
              }}
            >
              <div className={"font-[600] font-cute text-base"}>{product.title}</div>
            </Link>
            <ul>
              {selectedOptions.map((option) => (
                <li key={option.name}>
                  <div className={"text-sm text-light-text2"}>
                    {option.name}: {option.value}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className={"flex flex-col gap-1"}>
            <div className={`sm:hidden text-sm font-normal text-light-text1`}>{getFullPriceString(line?.cost?.totalAmount.amount, line?.cost?.totalAmount.currencyCode)}</div>
            <CartLineQuantity line={line} />
          </div>
        </div>

        {/* Right side */}
        <div className={"hidden sm:flex flex-col justify-end items-end"}>
          {/*<ProductPrice price={line?.cost?.totalAmount} compareAtPrice={line?.cost?.compareAtAmountPerQuantity}/>*/}
          <div className={`text-base font-normal text-light-text1`}>{getFullPriceString(line?.cost?.totalAmount.amount, line?.cost?.totalAmount.currencyCode)}</div>
        </div>
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className={"flex gap-3 items-center"}>
      <div className="flex gap-4 py-1 px-2 border border-light-bg2 rounded-[4px] justify-center items-center">
        <div className={"mt-1 text-light-text2 hover:text-light-text1 transition-all duration-200"}>
          <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
            <button
              aria-label="Decrease quantity"
              disabled={quantity <= 1 || !!isOptimistic}
              name="decrease-quantity"
              value={prevQuantity}
            >
              <Minus size={16}/>
            </button>
          </CartLineUpdateButton>
        </div>

        <div className={"text-sm"}>{quantity}</div>

        <div className={"mt-1 text-light-text2 hover:text-light-text1 transition-all duration-200"}>
          <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
            <button
              aria-label="Increase quantity"
              name="increase-quantity"
              value={nextQuantity}
              disabled={!!isOptimistic}
            >
              <Plus size={16}/>
            </button>
          </CartLineUpdateButton>
        </div>
      </div>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button disabled={disabled} type="submit">
        <div className={"text-sm text-light-text2 hover:underline transition-all duration-300"}>Xóa</div>
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
