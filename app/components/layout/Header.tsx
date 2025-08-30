import {Suspense, useEffect, useRef, useState} from 'react';
import {Await, Link, NavLink, useAsyncValue, useLocation} from 'react-router';
import {
  type CartViewPayload,
  Image,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {
  CartApiQueryFragment,
  HeaderQuery,
} from '../../../storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {
  ArrowRightLeft,
  ChevronDown,
  Globe,
  Menu, Repeat,
  Search,
  ShoppingCart,
  UserRound,
} from 'lucide-react';
import {I18nLocale} from '~/lib/i18n';
import {
  cutAnyLocalePartFromPathname,
  getAvailableLocaleFromPathname,
  getAvailableLocaleUrlPartFromPathname,
} from '~/common/utils/i18nUtils';
import {APP_STRINGS} from '~/common/constants/appStrings';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  i18n: I18nLocale;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
  i18n,
}: HeaderProps) {
  /* shopify nav */
  const {shop, menu} = header;

  const location = useLocation(); // ✅ gives you current URL info

  const [isAtTop, setIsAtTop] = useState(true);
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');

  const lastScrollY = useRef(0);

  // Detect isAtTop
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // run on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect scrollDir
  useEffect(() => {
    const handleScroll = () => {
      const currentY = Math.max(0, window.scrollY); // prevent negative values

      if (currentY <= 0) {
        setScrollDir('up'); // force show header when at very top
      } else if (currentY > lastScrollY.current) {
        setScrollDir('down');
      } else if (currentY < lastScrollY.current) {
        setScrollDir('up');
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const maxSubHeaderLengthOnMobile = 10;
  const maxSubHeaderItems = 6;
  const validTitlesOnMobile = menu?.items
    .filter((item) => item.title.length <= maxSubHeaderLengthOnMobile)
    .slice(0, 3)
    .map((item) => item.title);

  let countSubHeaderItems = 0;

  return (
    <div className="">
      {/* Main header */}
      <div
        className={`
        flex items-center justify-center w-full h-20 px-6 lg:px-20 fixed top-0 z-40 
        transition-all duration-500 ease-in-out bg-light-bg1
        ${scrollDir === 'down' ? '-translate-y-32' : 'translate-y-0'}
        `}
      >
        <div
          className={'flex items-center justify-between w-full max-w-screen-xl'}
        >
          {/* Left side */}
          <div
            className={'w-[40%] flex justify-start items-center gap-4 sm:gap-6'}
          >
            <HeaderMenuMobileToggle />
            <div className={'hidden sm:flex items-center'}>
              <SwitchLocaleCta useOnHeader={true}/>
            </div>
            <div className={"flex sm:hidden items-center"}>
              <SearchToggle />
            </div>
          </div>

          {/* Center */}
          <div className={'w-[20%] flex justify-center items-center'}>
            <Logo pathname={location.pathname} />
          </div>

          {/* Right side */}
          <div className={'w-[40%] flex justify-end items-center'}>
            <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
          </div>
        </div>
      </div>

      {/* Sub header */}
      <div
        className={`
        flex w-full h-12 px-6 fixed top-20 z-40 
        transition-all duration-500 ease-in-out bg-light-main3 
        ${scrollDir === 'down' ? '-translate-y-32' : 'translate-y-0'}
        `}
      >
        <div
          className={
            'flex items-center w-full justify-center gap-[10vw] md:gap-12'
          }
        >
          {menu?.items.map((item, index) => {
            if (!item.url) return null;

            countSubHeaderItems++;
            if (countSubHeaderItems > maxSubHeaderItems) return null;

            const url = getRealUrlFromMenuUrl(
              item.url,
              publicStoreDomain,
              header.shop.primaryDomain.url,
            );
            const localeUrlPart = getAvailableLocaleUrlPartFromPathname(
              location.pathname,
            );

            const hasDropdown = item.items && item.items.length > 0;

            return (
              <div
                key={item.id}
                className={`group relative flex items-center h-full ${validTitlesOnMobile?.includes(item.title) ? 'flex' : 'hidden md:flex'}`}
              >
                <NavLink
                  to={localeUrlPart + url}
                  prefetch="intent"
                  className={`text-sm font-[600] hover:text-light-main transition-all duration-300`}
                >
                  {item.title.toUpperCase()}
                </NavLink>
                {hasDropdown && (
                  <div className={`
                    absolute top-12 left-0 z-10 h-[2px] bg-light-main 
                    opacity-0 transition-all duration-500 ease-in-out
                    w-0 md:group-hover:w-[180px] md:group-hover:opacity-100
                  `}/>
                )}
                {hasDropdown && (
                  <div
                    className={`
                    opacity-0 pointer-events-none md:group-hover:pointer-events-auto md:group-hover:opacity-100 
                    absolute transition-all duration-300 ease-in-out top-12 bg-light-main3
                    rounded-b-[4px] shadow-md
                    flex flex-col justify-start items-start w-[180px] py-6 px-6 gap-4
                    text-sm font-[600] font-cute
                  `}
                  >
                    <Link
                      to={localeUrlPart + url}
                      prefetch={'intent'}
                      className={
                        'hover:text-light-main transition-all duration-300 ease-in-out'
                      }
                    >
                      {APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].viewAllText}
                    </Link>
                    {item.items.map((subItem, index) => {
                      if (!subItem.url) return null;
                      const subUrl = getRealUrlFromMenuUrl(
                        subItem.url,
                        publicStoreDomain,
                        header.shop.primaryDomain.url,
                      );

                      return (
                        <Link
                          to={localeUrlPart + subUrl}
                          prefetch={'intent'}
                          key={subItem.id}
                          className={
                            'hover:text-light-main transition-all duration-300 ease-in-out'
                          }
                        >
                          {subItem.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Logo({
  width = 62,
  height = 62,
  pathname,
}: {
  width?: number;
  height?: number;
  pathname: string;
}) {
  return (
    <a href={`${getAvailableLocaleUrlPartFromPathname(pathname)}/`}>
      {/*<div className={`font-fancy font-medium text-[40px] ${className}`}>SoCutie</div>*/}

      <Image
        src="/images/logo.png"
        alt="hero-banner"
        width={width}
        height={height}
        className="object-contain"
      />
    </a>
  );
}

export function SwitchLocaleCta({useOnHeader = false}) {
  const location = useLocation();

  const currentLocale = getAvailableLocaleFromPathname(location.pathname);

  const targetLocaleUrlPart = currentLocale === 'vi-vn' ? '/en-us' : '';
  const cutLocalePathname = cutAnyLocalePartFromPathname(location.pathname);

  const iconSize = 22;
  return (
    <a
      className={'flex flex-row items-center gap-2 group'}
      href={`${targetLocaleUrlPart}${cutLocalePathname}`}
    >
      <Image
        src={`${currentLocale === 'vi-vn' ? '/images/vietnam.png' : '/images/united-states.png'}`}
        alt="locale"
        width={iconSize}
        height={iconSize}
        className="object-contain"
      />
      <div className={` flex flex-row items-center font-[600] text-xs`}>
        {`${currentLocale === 'vi-vn' ? 'VND' : 'USD'}`}
      </div>
      <Repeat
        size={13}
        strokeWidth={2.25}
        className={`${useOnHeader ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} transition-all duration-300 ease-in-out`}
      />
      <Image
        src={`${currentLocale === 'vi-vn' ? '/images/united-states.png' : '/images/vietnam.png'}`}
        alt="locale"
        width={iconSize}
        height={iconSize}
        className={`object-contain ${useOnHeader ? 'opacity-0 group-hover:opacity-100' : 'hidden'} transition-all duration-300 ease-in-out`}
      />
      <div className={` flex flex-row items-center font-[600] text-xs ${useOnHeader ? 'opacity-0 group-hover:opacity-100' : 'hidden'} transition-all duration-300 ease-in-out`}>
        {`${currentLocale === 'vi-vn' ? 'USD' : 'VND'}`}
      </div>
    </a>
  );
}

// export function HeaderMenu({
//   menu,
//   primaryDomainUrl,
//   viewport,
//   publicStoreDomain,
// }: {
//   menu: HeaderProps['header']['menu'];
//   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
//   viewport: Viewport;
//   publicStoreDomain: HeaderProps['publicStoreDomain'];
// }) {
//   const {close} = useAside();
//
//   return (
//     <nav className={`h-full flex gap-[3vw] items-center`}>
//       {(menu || CUSTOM_MENU).items.map((item) => {
//         if (!item.url) return null;
//
//         const url = getRealUrlFromMenuUrl(item.url, publicStoreDomain, primaryDomainUrl);
//
//         const hasDropdown = item.items && item.items.length > 0;
//
//         return (
//           <div
//             key={item.id}
//             className="relative group h-full flex items-center"
//           >
//             <NavLink
//               to={url}
//               onClick={close}
//               prefetch="intent"
//               className="h-full font-[400] flex items-center text-sm tracking-wide transition-colors duration-300 ease-in-out group-hover:text-light-main"
//             >
//               {item.title.toUpperCase()}
//               <span className="absolute left-0 bottom-6 h-[1px] w-full origin-left scale-x-0 bg-light-main transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
//             </NavLink>
//
//             {hasDropdown && (
//               <div
//                 className={`
//                 absolute left-0 top-20 w-48 bg-light-bg1
//                 transition-opacity duration-300 ease-in-out
//                 opacity-0 group-hover:opacity-100
//                 pointer-events-none group-hover:pointer-events-auto
//                 z-50 py-4 border border-light-bg2
//               `}
//               >
//                 {item.items.map((subItem) => {
//                   if (!subItem.url) return null;
//
//                   const subUrl = getRealUrlFromMenuUrl(subItem.url, publicStoreDomain, primaryDomainUrl);
//
//                   return (
//                     <Link
//                       key={subItem.id}
//                       to={subUrl}
//                       className="block px-4 py-2 text-sm text-light-text1 transition-colors duration-300 hover:text-light-main"
//                     >
//                       {subItem.title}
//                     </Link>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </nav>
//   );
// }

export function MobileMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  return (
    <nav className={`h-full flex gap-5 flex-col p-6 max-h-[calc(100vh-80px)] overflow-y-auto scrollbar-hidden`}>
      {menu?.items.map((item) => {
        if (!item.url) return null;
        return (
          <div key={item.id}>
            <MobileMenuItem  item={item}></MobileMenuItem>
            <div className={"border-t border-light-bg2 mt-5"}/>
          </div>

        );
      })}
    </nav>
  );

  function MobileMenuItem({item}: {item: any}) {
    const location = useLocation();

    const url = getRealUrlFromMenuUrl(
      item.url,
      publicStoreDomain,
      primaryDomainUrl,
    );
    const localeUrlPart = getAvailableLocaleUrlPartFromPathname(
      location.pathname,
    );

    const hasDropdown = item.items && item.items.length > 0;

    const [isOpenDropdown, setIsOpenDropdown] = useState(false);

    return (
      <div key={item.id}>
        <Link
          prefetch="intent"
          to={localeUrlPart + url}
          onClick={(e) => {
            if (hasDropdown) {
              e.preventDefault();
              setIsOpenDropdown(!isOpenDropdown);
            } else {
              close();
            }
          }}
          className={`w-full flex justify-between items-center gap-4`}
        >
          <div className="text-sm font-[600] transition-all duration-300">
            {item.title.toUpperCase()}
          </div>
          <ChevronDown className={`${hasDropdown ? '' : 'hidden'} ${isOpenDropdown ? "rotate-180" : "rotate-0"} transition-all duration-300 ease-in-out`} size={20} />
        </Link>
        <div
          className={`
            ${hasDropdown ? '' : 'hidden'} overflow-hidden ${isOpenDropdown ? 'opacity-100 max-h-64 mt-4' : 'opacity-0 max-h-0 mt-0'}
            flex flex-col gap-4 text-sm font-cute font-[600] transition-all duration-300 ease-in-out
          `}
        >
          <Link
            to={localeUrlPart + url}
            prefetch={'intent'}
            onClick={close}
          >
            {APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].viewAllText}
          </Link>
          {item.items.map((subItem: any) => {
            if (!subItem.url) return null;
            const subUrl = getRealUrlFromMenuUrl(
              subItem.url,
              publicStoreDomain,
              primaryDomainUrl,
            );

            return (
              <Link
                to={localeUrlPart + subUrl}
                prefetch={'intent'}
                key={subItem.id}
                onClick={close}
              >
                {subItem.title}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex gap-4 sm:gap-6" role="navigation">
      {/*<NavLink className={"hidden sm:flex"} prefetch="intent" to="/account" style={activeLinkStyle}>*/}
      {/*  <Suspense fallback="Sign in">*/}
      {/*    <Await resolve={isLoggedIn} errorElement="Sign in">*/}
      {/*      <UserRound className={"transition-colors duration-200 hover:text-light-main"}/>*/}
      {/*    </Await>*/}
      {/*  </Suspense>*/}
      {/*</NavLink>*/}

      {/* Shopify customer account login */}
      <a
        href={'https://shopify.com/67120103510/account'}
        target="_blank"
        rel="noopener noreferrer"
        className={'flex'}
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            <Image
              src="/images/bow6.png"
              alt="hero-banner"
              width={28}
              height={28}
              className="object-contain"
            />
          </Await>
        </Suspense>
      </a>

      <div className={'hidden sm:flex items-center'}>
        <SearchToggle />
      </div>

      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button onClick={() => open('mobile')}>
      <Menu/>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="" onClick={() => open('search')}>
      <div className="relative group">
        <Search strokeWidth={1.75} />
      </div>
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <div className={'relative'}>
        <div className="relative group">
          <Image
            src={"/images/cart6.png"}
            alt="cart"
            width={24}
            height={24}
            className="object-contain"
          />
          {/*<ShoppingCart className="transition-colors duration-150 ease-in-out hover:text-light-main" />*/}
        </div>
        {count === null ? (
          <span>&nbsp;</span>
        ) : (
          <div
            className={
              'absolute -top-1 -right-2 bg-light-main text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center'
            }
          >
            {count}
          </div>
        )}
      </div>
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function getRealUrlFromMenuUrl(
  menuUrl: string,
  publicStoreDomain: string,
  primaryDomainUrl: string,
): string {
  const cutLocalePathname = cutAnyLocalePartFromPathname(
    new URL(menuUrl).pathname,
  );

  return menuUrl.includes('myshopify.com') ||
    menuUrl.includes(publicStoreDomain) ||
    menuUrl.includes(primaryDomainUrl)
    ? cutLocalePathname || '/'
    : menuUrl;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    //color: isPending ? 'grey' : 'black',
    color: 'text-light-text1',
  };
}
