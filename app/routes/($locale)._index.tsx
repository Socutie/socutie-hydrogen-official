import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  useLoaderData,
  Link,
  type MetaFunction,
  useLocation,
} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {
  BestSellersProductsQuery,
  FeaturedCollectionFragment,
  ProductSummaryFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {
  BEST_SELLERS_PRODUCTS_QUERY,
  HOMEPAGE_COLLECTIONS_MENU_QUERY,
} from '~/custom-queries/customQueries';
import {BannerSection} from '~/components/home/BannerSection';
import {
  FadeInItem,
  FadeInStagger,
} from '~/components/framer-motion/FadeInStagger';
import {FadeInDiv} from '~/components/framer-motion/FadeInDiv';
import {Instagram} from 'lucide-react';
import {
  getAvailableLocaleFromPathname,
  getAvailableLocaleUrlPartFromPathname,
} from '~/common/utils/i18nUtils';
import {APP_STRINGS} from '~/common/constants/appStrings';
import {motion} from 'framer-motion';

export const meta: MetaFunction = () => {
  return [{title: 'Socutie | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const i18n = args.context.storefront.i18n;

  // return {...deferredData, ...criticalData};
  return {...criticalData, i18n};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{menu}] = await Promise.all([
    //context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel

    context.storefront.query(HOMEPAGE_COLLECTIONS_MENU_QUERY),
  ]);

  const collections = menu?.items
    .filter((item) => item.type === 'COLLECTION' && item.resource)
    .map((item) => item.resource);

  return {
    homepageCollections: collections ?? [],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  // const recommendedProducts = context.storefront
  //   .query(RECOMMENDED_PRODUCTS_QUERY)
  //   .catch((error) => {
  //     // Log query errors, but don't throw them so the page can still render
  //     console.error(error);
  //     return null;
  //   });
  // const recommendedProducts = context.storefront
  //   .query(BEST_SELLERS_PRODUCTS_QUERY)
  //   .catch((error) => {
  //     // Log query errors, but don't throw them so the page can still render
  //     console.error(error);
  //     return null;
  //   });
  //
  // return {
  //   recommendedProducts,
  // };
}

export default function Homepage() {
  const location = useLocation();
  const data = useLoaderData<typeof loader>();

  const bestSellersCollection = data.homepageCollections.find(
    (c) => c!.handle === 'best-sellers',
  );

  const featuredCollection = data.homepageCollections.find(
    (c) => c!.handle !== 'best-sellers',
  );

  return (
    <div className="flex flex-col items-center">
      {/* Hero Banner */}
      <div className={'w-full'}>
        <BannerSection
          src={featuredCollection?.image ? featuredCollection?.image.url : '/images/hero-banner.jpg'}
          collection={featuredCollection}
          showSectionContent={true}
        />
      </div>

      <div className={'h-16'}></div>

      {/* Best Sellers Display */}
      {bestSellersCollection && (
        <div key={bestSellersCollection.id}>
          <BestSellersDisplay products={bestSellersCollection.products.nodes} />
        </div>
      )}

      <div className={'h-16'}></div>

      {/* Introduction section */}
      <div
        className={
          'w-full py-16 px-10 bg-light-main4 flex items-center justify-center flex-col'
        }
      >
        <FadeInDiv>
          <div
            className={
              'text-3xl lg:text-4xl font-fancy text-center tracking-tight lg:tracking-normal'
            }
          >
            {
              APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)]
                .introduceTitle
            }
          </div>
        </FadeInDiv>
        <FadeInDiv>
          <div
            className={
              'font-main text-sm mt-5 max-w-screen-md text-center tracking-tight'
            }
          >
            {
              APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)]
                .introduceText
            }
          </div>
        </FadeInDiv>
        <FadeInDiv>
          <div
            className={
              'flex gap-4 justify-center items-center mt-6 max-w-screen-md'
            }
          >
            <a
              href={'https://www.instagram.com/socutie.sg'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className={'text-light-text2'} />
            </a>
            <a
              href={'https://www.tiktok.com/@socutie.sg'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/tik-tok.png"
                alt="hero-banner"
                width={20}
                height={20}
                className="w-5 h-5 object-contain grayscale opacity-80"
              />
            </a>
          </div>
        </FadeInDiv>
      </div>

      <div className={'h-16'}></div>

      <FeedbackDisplay />

      <div className={'h-32'}></div>

      {/* Featured Collection section */}
      <div className={`w-full flex justify-center items-center bg-light-main4 px-6 lg:px-20`}>
        <div className={`max-w-screen-xl w-full bg-light-main4`}>
          <div className={`grid grid-cols-1 lg:grid-cols-2 lg:gap-8`}>
            <motion.div
              className={"flex justify-center items-center py-16 px-6 sm:px-16"}
              initial={{rotate: 10, opacity: 0}}
              whileInView={{rotate: -3, opacity: 1}}
              transition={{duration: 0.75, ease: 'easeOut'}}
              viewport={{once: true, amount: 0.3}}
            >
              <Image
              src={'/images/collection-banner.jpg'}
              alt={'collection-image'}
              className={`w-full aspect-[21-9] lg:aspect-[3/4] object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0 opacity-100`}
              loading={"eager"}
              sizes="(min-width: 1024px) 25vw, 50vw"
              />
            </motion.div>
            <FadeInDiv viewportAmount={0.4}>
              <div className={`flex flex-col items-center gap-6 pb-10 lg:py-10 px-6 `}>
                <div className={`font-fancy text-3xl text-center`}>New Arrivals</div>
                <div className={`text-3xl font-[500] text-center`}>{featuredCollection?.title.toUpperCase()}</div>
                <div className={`text-sm font-[400] tracking-tight text-center`}>{featuredCollection?.description}</div>
                <div className="mt-6 grid gap-6 lg:gap-10 grid-cols-2">
                  {featuredCollection?.products.nodes.slice(0, 2).map((product) => (
                    <FadeInItem key={product.id}>
                      <ProductItem  product={product} />
                    </FadeInItem>
                  ))}
                </div>
                <div className={`flex justify-center items-center mt-4`}>
                  <Link
                    className={`
               relative overflow-hidden
               px-6 md:px-8 py-3 flex justify-center items-center rounded-[4px]
               text-sm font-[600] font-main text-light-bg1
               bg-light-main border-2 border-light-main
               transition-all duration-300 ease-in-out
               hover:text-light-main
               before:absolute before:inset-0
               before:bg-light-bg1 before:translate-x-[-110%]
               before:transition-transform before:duration-500 before:ease-in-out
               hover:before:translate-x-0
            `}
                    to={getAvailableLocaleUrlPartFromPathname(location.pathname) + `/collections/${featuredCollection?.handle}`}
                  >
                    <div
                      className={'relative z-10 flex gap-3 items-center justify-center'}
                    >
                      <div className={''}>VIEW ALL</div>
                    </div>
                  </Link>
                </div>
              </div>
            </FadeInDiv>

          </div>
        </div>
      </div>

      {/* Featured Collection section 2 */}
      {/*<div*/}
      {/*  className={`w-full flex flex-col justify-center items-center bg-light-main4 `}*/}
      {/*>*/}
      {/*  <div className={'relative w-full'}>*/}
      {/*    <BannerSection*/}
      {/*      aspectClass={'aspect-[1/1] lg:aspect-[6/1]'}*/}
      {/*      overlayClass={'bg-black/30'}*/}
      {/*      src={'/images/collection-banner.jpg'}*/}
      {/*      collection={featuredCollection}*/}
      {/*    />*/}
      {/*    <div*/}
      {/*      className={`absolute inset-0 flex justify-center items-center top-0 bottom-0 px-6 lg:px-20`}*/}
      {/*    >*/}
      {/*      <div*/}
      {/*        className={`flex flex-col items-center gap-6  text-light-bg1 max-w-screen-xl`}*/}
      {/*      >*/}
      {/*        <div className={`font-fancy text-3xl text-center`}>*/}
      {/*          New Arrivals*/}
      {/*        </div>*/}
      {/*        <div className={`text-3xl font-[500] text-center`}>*/}
      {/*          {featuredCollection?.title.toUpperCase()}*/}
      {/*        </div>*/}
      {/*        <div className={`text-sm font-[400] tracking-tight text-center`}>*/}
      {/*          {featuredCollection?.description}*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}

      {/*  <div className={'py-12 px-6 lg:px-20'}>*/}
      {/*    <div className={`max-w-screen-xl w-full bg-light-main4`}>*/}
      {/*      <div className={`flex flex-col items-center gap-6`}>*/}
      {/*        <div className="grid gap-6 lg:gap-10 grid-cols-2 lg:grid-cols-4">*/}
      {/*          {featuredCollection?.products.nodes*/}
      {/*            .slice(0, 4)*/}
      {/*            .map((product) => (*/}
      {/*              <FadeInItem key={product.id}>*/}
      {/*                <ProductItem product={product} />*/}
      {/*              </FadeInItem>*/}
      {/*            ))}*/}
      {/*        </div>*/}
      {/*        <div className={`flex justify-center items-center mt-4`}>*/}
      {/*          <Link*/}
      {/*            className={`*/}
      {/*         relative overflow-hidden*/}
      {/*         px-6 md:px-8 py-3 flex justify-center items-center rounded-[4px]*/}
      {/*         text-sm font-[600] font-main text-light-bg1*/}
      {/*         bg-light-main border-2 border-light-main*/}
      {/*         transition-all duration-300 ease-in-out*/}
      {/*         hover:text-light-main*/}
      {/*         before:absolute before:inset-0*/}
      {/*         before:bg-light-bg1 before:translate-x-[-110%]*/}
      {/*         before:transition-transform before:duration-500 before:ease-in-out*/}
      {/*         hover:before:translate-x-0*/}
      {/*      `}*/}
      {/*            to={*/}
      {/*              getAvailableLocaleUrlPartFromPathname(location.pathname) +*/}
      {/*              `/collections/${featuredCollection?.handle}`*/}
      {/*            }*/}
      {/*          >*/}
      {/*            <div*/}
      {/*              className={*/}
      {/*                'relative z-10 flex gap-3 items-center justify-center'*/}
      {/*              }*/}
      {/*            >*/}
      {/*              <div className={''}>VIEW ALL</div>*/}
      {/*            </div>*/}
      {/*          </Link>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<FeaturedCollection collection={data.featuredCollection} />*/}
      {/*<RecommendedProducts products={data.recommendedProducts} />*/}
    </div>
  );
}

function FeedbackDisplay() {
  const location = useLocation();
  const imgList = [
    '/images/feedback/feedback1.jpg',
    '/images/feedback/feedback2.jpg',
    '/images/feedback/feedback3.jpg',
    '/images/feedback/feedback4.jpg',
    '/images/feedback/feedback5.jpg',
    '/images/feedback/feedback6.jpg',
    '/images/feedback/feedback7.jpg',
    '/images/feedback/feedback8.jpg',
    '/images/feedback/feedback9.jpg',
    '/images/feedback/feedback10.jpg',
  ];

  const mobileShowingFeedbacks = 9;
  const desktopShowingFeedbacks = 10;

  return (
    <div className={'max-w-screen-sm lg:max-w-screen-lg w-full px-6 lg:px-20'}>
      <FadeInDiv>
        <div
          className={
            'tracking-tight text-2xl lg:text-3xl font-[500] text-light-text1 text-center font-title mb-8'
          }
        >
          {
            APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)]
              .feedback
          }
        </div>
      </FadeInDiv>

      <FadeInStagger>
        <div className={'grid gap-6 lg:gap-8 grid-cols-3 lg:grid-cols-5'}>
          {imgList.slice(0, desktopShowingFeedbacks).map((imgSrc, index) => (
            <FadeInItem key={imgSrc}>
              <div
                className={
                  index === mobileShowingFeedbacks ? 'hidden lg:block' : ''
                }
              >
                <FeedbackImage src={imgSrc} />
              </div>
            </FadeInItem>
          ))}
        </div>
      </FadeInStagger>
    </div>
  );

  function FeedbackImage({src = ''}) {
    return (
      <a
        className={''}
        href={'https://www.instagram.com/socutie.sg'}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={src}
          alt={'feedback-image'}
          className={
            'w-full h-auto object-cover aspect-[3/4] transition-all duration-300 hover:cursor-pointer hover:scale-105'
          }
          sizes="30vw"
        />
      </a>
    );
  }
}

function BestSellersDisplay({products}: {products: ProductSummaryFragment[]}) {
  const url = `/collections/best-sellers`;
  const location = useLocation();

  return (
    <div className="mx-6 lg:mx-20 max-w-screen-xl flex flex-col items-center">
      <FadeInDiv>
        <div
          className={
            'tracking-tight text-2xl lg:text-3xl font-[500] text-light-text1 text-center font-title mb-8'
          }
        >
          {
            APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)]
              .mostPick
          }
        </div>
        {/*<div className={"text-base text-light-text2 font-main mb-10 max-w-md text-center tracking-tight"}>{description}</div>*/}
      </FadeInDiv>
      <FadeInStagger>
        <div className="grid gap-6 lg:gap-10 grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <FadeInItem key={product.id}>
              <ProductItem product={product} />
            </FadeInItem>
          ))}
        </div>
      </FadeInStagger>

      {/*<Link*/}
      {/*  to={url}*/}
      {/*  className={`*/}
      {/*    relative overflow-hidden*/}
      {/*    shadow-md text-sm font-normal text-light-bg1 font-main*/}
      {/*    mt-12 bg-light-main py-4 px-8*/}
      {/*    transition-all duration-300*/}
      {/*    before:absolute before:inset-0*/}
      {/*    before:bg-light-main2 before:translate-x-[-100%]*/}
      {/*    before:transition-transform before:duration-300*/}
      {/*    hover:before:translate-x-0*/}
      {/*  `}*/}
      {/*>*/}
      {/*  <div className="relative z-10">XEM THÊM</div>*/}
      {/*</Link>*/}
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

// const RECOMMENDED_PRODUCTS_QUERY = `#graphql
//   fragment RecommendedProduct on Product {
//     id
//     title
//     handle
//     priceRange {
//       minVariantPrice {
//         amount
//         currencyCode
//       }
//     }
//     featuredImage {
//       id
//       url
//       altText
//       width
//       height
//     }
//     images(first:10) {
//       nodes {
//         id
//         url
//         altText
//         width
//         height
//       }
//     }
//   }
//   query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
//     @inContext(country: $country, language: $language) {
//     products(first: 4, sortKey: UPDATED_AT, reverse: true) {
//       nodes {
//         ...RecommendedProduct
//       }
//     }
//   }
// ` as const;
