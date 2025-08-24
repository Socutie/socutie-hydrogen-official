import {Link, useLocation} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {
  ProductItemFragment,
  CollectionItemFragment,
  ProductSummaryFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {discountPercentage, formatVnd} from '~/common/utils/stringUtils';
import {useState} from "react";
import {Handbag, Plus, Search} from 'lucide-react';
import convert from 'color-convert';
import {ProductPrice} from '~/components/ProductPrice';
import {cutLocalePartFromPathname, getAvailableLocaleUrlPartFromPathname} from '~/common/utils/i18nUtils';

export function ProductItem({
  product,
  loading = 'eager',
}: {
  product: ProductSummaryFragment;
  loading?: 'eager' | 'lazy';
}) {
  const location = useLocation();

  const variantUrl = useVariantUrl(product.handle);

  const targetUrl = getAvailableLocaleUrlPartFromPathname(location.pathname) + cutLocalePartFromPathname(variantUrl);

  const imgUrlsList = product.images.nodes.map(image => image.url);
  const emptyImgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";
  const initImgUrl = imgUrlsList.length >= 1 ? imgUrlsList[0] : emptyImgUrl;
  const hoverImgUrl = imgUrlsList.length === 0 ? emptyImgUrl : (imgUrlsList.length >= 2 ? imgUrlsList[1] : initImgUrl);

  // //list of all color options
  // const colorOptions = product.options
  //   .filter(option => option.name === "Color")
  //   .flatMap(option => option.optionValues.map(v => v.name));
  //
  // const colorHexs = colorOptions.map(color =>
  //   '#' + convert.keyword.hex(color.trim().toLowerCase()) || '#000000'
  // );

  const [isHoveredOnce, setIsHoveredOnce] = useState(false)

  return (
      <Link
        onMouseEnter={() => setIsHoveredOnce(true)}
        onTouchStart={() => setIsHoveredOnce(true)}
        className="group"
        key={product.id}
        prefetch="intent"
        to={targetUrl}
      >
        <div className="relative">
          {/* Initial image */}
          <Image
            src={initImgUrl}
            alt={product.title}
            className={`z-20 relative w-full h-auto aspect-[3/4] object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0 opacity-100`}
            loading={loading}
            sizes="(min-width: 1024px) 25vw, 50vw"
          />

          {/* Hover image */}
          <Image
            src={hoverImgUrl}
            alt={product.title}
            className={`z-10 absolute top-0 left-0 w-full h-auto aspect-[3/4] object-cover ${isHoveredOnce ? "opacity-100" : "opacity-0"}`}
            loading={"lazy"}
            sizes="(min-width: 1024px) 25vw, 50vw"
          />


          {/* 🔍 Search icon at bottom */}
          <div className={`z-30 absolute bottom-2 right-2 flex justify-center items-center w-8 h-8 bg-light-main text-light-bg1 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:shadow-sm opacity-0 translate-y-2`}>
            <Search size={20} />
          </div>

          {/* Sold out badge on top */}
          {!product.availableForSale && (
            <div className={`z-30 py-[2px] px-[6px] absolute top-2 left-2 flex justify-center font-main items-center bg-light-main text-xs text-light-bg1`}>
              <div>{"SOLD OUT"}</div>
            </div>
          )}

          {/* Sales off badge on top */}
          {(product.availableForSale && product.priceRange.minVariantPrice.amount < product.compareAtPriceRange.maxVariantPrice.amount) && (
            <div className={`z-30 py-[2px] px-[6px] absolute top-2 left-2 flex justify-center font-main items-center bg-light-main text-xs text-light-bg1`}>
              <div>{(`${discountPercentage(product.priceRange.minVariantPrice.amount, product.compareAtPriceRange.maxVariantPrice.amount)} OFF`)}</div>
            </div>
          )}

        </div>

        {/* Title and price */}
        <div className={"pt-3 flex flex-col justify-center items-center"}>
          <div className={"font-[600] font-cute text-center text-sm lg:text-base font-title mb-1"}>{product.title}</div>

          <ProductPrice size={"small"} price={product.priceRange.minVariantPrice} compareAtPrice={product.compareAtPriceRange.maxVariantPrice}/>
          {/*<div className={"text-sm font-normal text-light-text2"}>{formatVnd(product.priceRange.minVariantPrice.amount)}₫</div>*/}
          {/*<Money data={product.priceRange.minVariantPrice}/>*/}

          {/*<ColorOptions/>*/}
        </div>
      </Link>
  );

  // function ColorOptions() {
  //   return colorHexs.length >= 1 ? (
  //     <div className={"flex gap-1 mt-3"}>
  //       {colorHexs.map((color, index) => (
  //         <div
  //           key={index}
  //           className={`h-[18px] w-[18px] rounded-full border border-light-bg2`}
  //           style={{ backgroundColor: color }}>
  //         </div>
  //       ))}
  //     </div>
  //   ) : null;
  // }
}
