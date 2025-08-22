import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from '../AddToCartButton';
import {useAside} from '../Aside';
import type {ProductFragment} from '../../../storefrontapi.generated';
import {Minus, Plus, ShoppingBag} from 'lucide-react';
import {useState} from "react";

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  const [addQuantity, setAddQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      {/* Variant selection */}
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1 && option.optionValues.at(0)?.name === "Default Title") return null;

        const currentValueName = option.optionValues.find(value => value.selected)?.name;

        return (
          <div className="" key={option.name}>
            <div className={'mb-2 flex gap-1'}>
              <div className={"text-sm shrink-0"}>{option.name}:</div>
              <div className={"text-sm font-[500] truncate"}>{currentValueName}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      className="product-options-item"
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{
                        border: selected
                          ? '1px solid black'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <button
                      type="button"
                      className={`border rounded-full text-sm py-2 px-4 font-[400] transition-colors duration-200 hover:text-light-text1 hover:border-light-text1 ${selected ? 'text-light-text1 border-light-text2' : 'text-light-text3 border-light-bg2'}`}
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}

      {/* Quantity selection */}
      <div>
        <div className={'mb-2 text-sm'}>Số lượng</div>
        <div
          className={`flex justify-between rounded-[4px] items-center w-fit border text-sm py-3 px-3 text-light-text1 border-light-bg2 font-[500]`}
        >
          <button
            className={
              'text-light-text2 hover:text-light-text1 transition-all duration-200'
            }
            onClick={() => {
              setAddQuantity(addQuantity - 1);
            }}
            disabled={addQuantity <= 1}
          >
            <Minus size={16} />
          </button>
          <div className={'mx-6 text-sm font-[500] w-2 text-center'}>{addQuantity}</div>
          <button
            className={
              'text-light-text2 hover:text-light-text1 transition-all duration-300'
            }
            onClick={() => {
              setAddQuantity(addQuantity + 1);
            }}
            disabled={addQuantity >= 9}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <div className={'mt-2'}>
        <div className={'flex justify-between mb-2'}>
          <div className={"text-sm text-light-text2"}>{selectedVariant?.availableForSale ? "Còn hàng" : "Đã hết hàng"}</div>
          <div className={"text-sm text-light-text2"}>Mã SP: TX-0001-BK</div>
        </div>

        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => {
            //open('cart');
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: addQuantity,
                    selectedVariant,
                  },
                ]
              : []
          }
        >
          <div className={'flex gap-3 align-center items-center'}>
            {/*<ShoppingBag size={20} />*/}
            <div className={''}>
              {selectedVariant?.availableForSale
                ? 'THÊM VÀO GIỎ HÀNG'
                : 'LIÊN HỆ VỚI CHÚNG MÌNH'}
            </div>
          </div>
        </AddToCartButton>
      </div>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  return name;

  /* if the variant has name/color, return it */
  // if (!image && !color) return name;
  //
  // return (
  //   <div
  //     aria-label={name}
  //     className="product-option-label-swatch"
  //     style={{
  //       backgroundColor: color || 'transparent',
  //     }}
  //   >
  //     {!!image && <img src={image} alt={name} />}
  //   </div>
  // );
}
