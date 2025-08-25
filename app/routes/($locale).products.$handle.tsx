import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction, useLocation} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/product-page/ProductImage';
import {ProductForm} from '~/components/product-page/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {useState} from "react";
import {RECOMMENDED_PRODUCTS_QUERY} from "~/custom-queries/customQueries";
import {ProductItem} from "~/components/ProductItem";
import {ChevronDown, Earth, Package, Truck, Undo2} from 'lucide-react';
import {motion} from 'framer-motion';
import {FadeInItem, FadeInStagger} from '~/components/framer-motion/FadeInStagger';
import {FadeInDiv} from '~/components/framer-motion/FadeInDiv';
import {APP_STRINGS} from "~/common/constants/appStrings";
import {getAvailableLocaleFromPathname} from "~/common/utils/i18nUtils";

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}, {productRecommendations}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: {handle},
    })
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
    productRecommendations,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}



export default function Product() {
  const location = useLocation();

  const faqsMenu = [
    {
      title: APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].faqQuestion1,
      content: APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].faqAnswer1
    },
    {
      title: APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].faqQuestion2,
      content: APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].faqAnswer2
    },
    {
      title: APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].faqQuestion3,
      content: APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].faqAnswer3
    },
  ];
  
  const {product, productRecommendations } = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  return (
    <div className={'mt-32 lg:mt-40 flex flex-col items-center lg:px-20'}>
      {/* Product detail */}
      <FadeInDiv viewportAmount={0}>
        <div className="grid grid-cols-1 items-start gap-6 lg:gap-3 lg:grid-cols-2 max-w-[1280px] w-full">
          {/* Left side (top on mobile) */}
          <div className="lg:sticky lg:top-8 self-start">
            <ProductImage
              variantImage={selectedVariant?.image}
              images={product.images.nodes}
            />
          </div>

          {/* Right side (bottom on mobile) */}
          <div className="product-form px-6 lg:px-0 lg:ml-12 lg:sticky lg:top-8 self-start">
            {/* Title and price */}
            <div
              className={
                'w-fit font-[400] text-sm text-light-text2 mb-2 transition-all duration-300 hover:cursor-pointer hover:text-light-text1'
              }
            >
              {APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].storeName}
            </div>
            <div className={'font-[700] font-cute text-3xl mb-2 '}>{title}</div>
            <div className={'font-[400] text-base tracking-tight mb-2 '}>
              Item không thể thiếu trong tủ đồ của các nàng
            </div>
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />

            <div className="mt-5 mb-5 border-t border-light-bg2" />

            {/* Variants and Add to cart button */}
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />

            {/* Commitment */}
            <div
              className={
                'grid grid-cols-3 gap-2 px-2 sm:px-6 mt-6 w-full bg-light-main4 rounded-[6px] py-6'
              }
            >
              <div className={'flex flex-col items-center gap-2'}>
                <Truck size={32} strokeWidth={1.5} className={'shrink-0'} />
                <div
                  className={
                    'text-xs sm:text-sm text-center tracking-tight max-w-32'
                  }
                >
                  {APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].commitment1Text}
                </div>
              </div>
              <div className={'flex flex-col items-center gap-2'}>
                <Earth size={32} strokeWidth={1.5} className={'shrink-0'} />
                <div
                  className={
                    'text-xs sm:text-sm text-center tracking-tight max-w-32'
                  }
                >
                  {APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].commitment2Text}
                </div>
              </div>
              <div className={'flex flex-col items-center gap-2'}>
                <Package size={32} strokeWidth={1.5} className={'shrink-0'} />
                <div
                  className={
                    'text-xs sm:text-sm text-center tracking-tight max-w-32'
                  }
                >
                  {APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].commitment3Text}
                </div>
              </div>
            </div>

            <div className={'h-6'}></div>

            {/* Desription */}
            <div className={''}>
              <div className={'font-[600] font-cute text-lg'}>
                {APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].descriptionTitle}
              </div>
              <div
                className={
                  'text-sm font-main text-light-text1 font-[400] tracking-tight mt-4 [&_strong]:text-light-text1 [&_strong]:font-[500] [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6'
                }
                dangerouslySetInnerHTML={{__html: descriptionHtml}}
              />
            </div>

            <div className={'border-t border-t-light-bg2 w-full mt-6'} />

            {/* Details */}
            <ProductDetailDisplay2
              title={APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].careInstructionTitle}
              texts={[
                APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].careInstructionText1,
                APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].careInstructionText2,
                APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].careInstructionText3
              ]}
            />
            <div className={'border-t border-t-light-bg2 w-full'} />
            <ProductDetailDisplay2
              title={APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].shippingPolicyTitle}
              texts={[
                APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].shippingPolicyText1,
                APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].shippingPolicyText2,
              ]}
            />
            <div className={'border-t border-t-light-bg2 w-full'} />
            <ProductDetailDisplay2
              title={APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].warrantyPolicyTitle}
              texts={[
                APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].warrantyPolicyText1,
                APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].warrantyPolicyText2,
              ]}
            />
            <div className={'border-t border-t-light-bg2 w-full'} />
          </div>
          <Analytics.ProductView
            data={{
              products: [
                {
                  id: product.id,
                  title: product.title,
                  price: selectedVariant?.price.amount || '0',
                  vendor: product.vendor,
                  variantId: selectedVariant?.id || '',
                  variantTitle: selectedVariant?.title || '',
                  quantity: 1,
                },
              ],
            }}
          />
        </div>
      </FadeInDiv>

      {/* Recommended products */}
      <FadeInDiv>
        <div
          className={
            'mt-24 text-2xl font-[500] flex justify-center w-full max-w-screen-xl text-center px-6 lg:px-0 mb-8'
          }
        >
          <div>{APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].suggestionText}</div>
        </div>
      </FadeInDiv>

      <FadeInStagger>
        <div className="px-6 lg:px-0 max-w-screen-xl w-full grid gap-6 lg:gap-10 grid-cols-2 lg:grid-cols-4">
          {productRecommendations?.slice(0, 4).map((product) => (
            <FadeInItem key={product.id}>
              <ProductItem product={product} />
            </FadeInItem>
          ))}
        </div>
      </FadeInStagger>

      <div className={'border-t border-t-light-bg2 w-full mt-24'} />

      {/* FAQs */}
      <FadeInDiv>
        <div>
          <div className={"mt-24 text-2xl font-[500] text-center w-full"}>FAQs</div>
          <FaqDisplay />
        </div>
      </FadeInDiv>
    </div>
  );

  function ProductDetailDisplay2({title, texts}: {title: string, texts: string[]}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button
          className={"flex w-full justify-between items-center py-5"}
          onClick={() => {setIsOpen(!isOpen)}}
        >
          <div className={"font-[600] font-cute text-lg"}>
            {title}
          </div>
          <div className={`${isOpen ? "rotate-180" : ""} transition-transform duration-300 ease-in-out`}>
            <ChevronDown size={20} strokeWidth={1.5} />
          </div>
        </button>
        <div
          className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          {texts.map((text, index) => (
            <div key={text} className="text-sm font-main text-light-text1 font-[400] tracking-tight pb-6">
              {text}
            </div>
          ))}
        </div>
      </>
    );
  }

  function FaqDisplay() {
    return (
      <div className={"flex justify-center px-6 lg:px-0"}>
        <div className={"flex flex-col gap-4 mt-10 w-full max-w-screen-md px-4 lg:px-10 bg-light-main4 py-8 rounded-[4px]"}>
          {faqsMenu.map((item, index) => (
            <div key={item.title}>
              <FaqItem item={item} />
            </div>
          ))}
        </div>
      </div>

    );
  }

  function FaqItem({item}: {item: any}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button
          className={"flex w-full justify-between items-center pb-4 border-b border-light-bg2 bg-light-main4 hover:cursor-pointer"}
          onClick={() => {setIsOpen(!isOpen)}}
        >
          <div className={"text-base text-start font-[600] font-cute"}>
            {item.title}
          </div>
          <div className={`${isOpen ? "rotate-180" : ""} transition-transform duration-300 ease-in-out`}>
            <ChevronDown size={20} strokeWidth={1.5} />
          </div>
        </button>
        <div
          className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
             bg-light-main4
          `}
        >
          <div className=" py-4 font-main text-sm tracking-tight">
            {item.content}
          </div>
        </div>
      </>
    )
  }
}





const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    images(first:20) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
