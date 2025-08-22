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
import {Globe, Menu, Search, ShoppingCart, UserRound} from 'lucide-react';
import {I18nLocale} from '~/lib/i18n';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  i18n: I18nLocale
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
  i18n
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const validTitlesOnMobile = menu?.items
    .filter((item) => item.title.length <= 10)
    .slice(0, 3)
    .map((item) => item.title);

  const maxSubHeaderItems = 5;
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
        <div className={'flex items-center justify-between w-full max-w-screen-xl'}>
          <div  className={'w-[40%] flex justify-start items-center gap-4 md:gap-6'}>
            <HeaderMenuMobileToggle />
            <ChangeLocaleCta i18n={i18n}/>
          </div>
          <div className={'w-[20%] flex justify-center items-center'}>
            <Logo />
          </div>
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
            if(countSubHeaderItems > maxSubHeaderItems) return null;

            const url = getRealUrlFromMenuUrl(item.url, publicStoreDomain, header.shop.primaryDomain.url);

            return (
              <NavLink
                key={item.id}
                to={url}
                prefetch="intent"
                className={`${validTitlesOnMobile?.includes(item.title) ? "block" : "hidden md:block"} text-sm font-[600] hover:text-light-main transition-all duration-300`}
              >
                {item.title.toUpperCase()}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ChangeLocaleCta({i18n}: {i18n: I18nLocale}) {
  const currentLocale = i18n.pathPrefix;
  const isVn = currentLocale.toLowerCase() === "/vi-vn" || currentLocale === "";
  const targetLocale = isVn ? "/en-us" : "/";

  return (
    <a href={targetLocale} className="relative inline-block group">
      {/* Globe icon */}
      <Globe
        strokeWidth={1.75}
        className="transition-colors duration-200 group-hover:text-light-main"
      />

      {/* Locale label */}
      <div className="absolute -top-[4px] -right-[4px] w-5 h-3 flex items-center justify-center text-[10px] font-bold bg-light-bg1 text-light-text1 rounded transition-colors duration-200 group-hover:text-light-main">
        {isVn ? "EN" : "VN"}
      </div>
    </a>
  );

}

export function Logo({width = 62, height = 62}) {
  return (
    <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
      {/*<div className={`font-fancy font-medium text-[40px] ${className}`}>SoCutie</div>*/}

      <Image
        src="/images/logo.png"
        alt="hero-banner"
        width={width}
        height={height}
        className="object-contain "
      />
    </NavLink>
  );
}

const CUSTOM_MENU = {
  items: [
    {
      id: 'all_products',
      resourceId: null,
      tags: [],
      title: 'SẢN PHẨM',
      type: 'HTTP',
      url: '/collections/all',
      items: [],
    },
    {
      id: 'all_collections',
      resourceId: null,
      tags: [],
      title: 'BỘ SƯU TẬP',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'about',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'GIỚI THIỆU',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

export function HeaderMenu({
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
    <nav className={`h-full flex gap-[3vw] items-center`}>
      {(menu || CUSTOM_MENU).items.map((item) => {
        if (!item.url) return null;

        const url = getRealUrlFromMenuUrl(item.url, publicStoreDomain, primaryDomainUrl);

        const hasDropdown = item.items && item.items.length > 0;

        return (
          <div
            key={item.id}
            className="relative group h-full flex items-center"
          >
            <NavLink
              to={url}
              onClick={close}
              prefetch="intent"
              className="h-full font-[400] flex items-center text-sm tracking-wide transition-colors duration-300 ease-in-out group-hover:text-light-main"
            >
              {item.title.toUpperCase()}
              <span className="absolute left-0 bottom-6 h-[1px] w-full origin-left scale-x-0 bg-light-main transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
            </NavLink>

            {hasDropdown && (
              <div
                className={`
                absolute left-0 top-20 w-48 bg-light-bg1 
                transition-opacity duration-300 ease-in-out
                opacity-0 group-hover:opacity-100
                pointer-events-none group-hover:pointer-events-auto 
                z-50 py-4 border border-light-bg2
              `}
              >
                {item.items.map((subItem) => {
                  if (!subItem.url) return null;

                  const subUrl = getRealUrlFromMenuUrl(subItem.url, publicStoreDomain, primaryDomainUrl);

                  return (
                    <Link
                      key={subItem.id}
                      to={subUrl}
                      className="block px-4 py-2 text-sm text-light-text1 transition-colors duration-300 hover:text-light-main"
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
    </nav>
  );
}

export function HeaderMenuMobile({
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
    <nav className={`h-full flex gap-6 flex-col p-6`}>
      {(menu || CUSTOM_MENU).items.map((item) => {
        if (!item.url) return null;

        const url = getRealUrlFromMenuUrl(item.url, publicStoreDomain, primaryDomainUrl);

        const hasDropdown = item.items && item.items.length > 0;

        return (
          <div key={item.id} className="relative group">
            <NavLink
              to={url}
              onClick={close}
              prefetch="intent"
              className="text-sm font-[600] hover:text-light-main transition-all duration-300"
            >
              {item.title.toUpperCase()}
              <span className="absolute left-0 -bottom-2 h-[1px] w-full origin-left scale-x-0 bg-light-main transition-transform duration-500 ease-in-out group-hover:scale-x-100"></span>
            </NavLink>
          </div>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex gap-4 md:gap-6" role="navigation">
      <a
        className={"hidden md:flex"}
        href={"https://www.instagram.com/socutie.sg"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/images/tie-icon.png"
          alt="hero-banner"
          width={26}
          height={26}
          className="object-contain"
        />
      </a>


      <SearchToggle />

      {/*<a*/}
      {/*  className={"hidden md:flex"}*/}
      {/*  href={"https://www.instagram.com/socutie.sg"}*/}
      {/*  target="_blank"*/}
      {/*  rel="noopener noreferrer"*/}
      {/*>*/}
      {/*  <div className="relative group">*/}
      {/*    <Instagram className="transition-colors duration-150 ease-in-out hover:text-light-main" />*/}
      {/*    <span*/}
      {/*      className="absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-light-main transition-transform duration-300 ease-in-out group-hover:scale-x-100"*/}
      {/*    ></span>*/}
      {/*  </div>*/}
      {/*</a>*/}

      {/*<NavLink className={"hidden md:flex"} prefetch="intent" to="/account" style={activeLinkStyle}>*/}
      {/*  <Suspense fallback="Sign in">*/}
      {/*    <Await resolve={isLoggedIn} errorElement="Sign in">*/}
      {/*      <UserRound className={"transition-colors duration-200 hover:text-light-main"}/>*/}
      {/*    </Await>*/}
      {/*  </Suspense>*/}
      {/*</NavLink>*/}

      {/*<NavLink className={"hidden md:flex"} prefetch="intent" to="https://shopify.com/75618549982/account" style={activeLinkStyle}>*/}
      {/*  <Suspense fallback="Sign in">*/}
      {/*    <Await resolve={isLoggedIn} errorElement="Sign in">*/}
      {/*      <UserRound className={"transition-colors duration-200 hover:text-light-main"}/>*/}
      {/*    </Await>*/}
      {/*  </Suspense>*/}
      {/*</NavLink>*/}

      {/* Shopify customer account login */}
      <a
        href={'https://shopify.com/75618549982/account'}
        target="_blank"
        rel="noopener noreferrer"
        className={'hidden md:flex'}
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            <UserRound
              className={'transition-colors duration-200 hover:text-light-main'}
            />
          </Await>
        </Suspense>
      </a>

      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button onClick={() => open('mobile')}>
      <Menu className={'transition-colors duration-200 hover:text-light-main'}/>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="" onClick={() => open('search')}>
      <div className="relative group">
        <Search className="transition-colors duration-150 ease-in-out hover:text-light-main" />
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
          <ShoppingCart className="transition-colors duration-150 ease-in-out hover:text-light-main" />
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
  let pathname = new URL(menuUrl).pathname;

  const locales: string[] = ['en', 'en-us', 'vi', 'vi-vn'];

  // remove leading locale prefix if present
  for (const locale of locales) {
    const prefix = `/${locale.toLowerCase()}`;
    if (pathname.toLowerCase().startsWith(prefix + '/')) {
      pathname = pathname.slice(prefix.length); // cut only the prefix
      break;
    }
    if (pathname.toLowerCase() === prefix) {
      pathname = '/'; // if it's exactly /en-us → /
      break;
    }
  }

  return menuUrl.includes('myshopify.com') ||
  menuUrl.includes(publicStoreDomain) ||
  menuUrl.includes(primaryDomainUrl)
    ? pathname || '/'
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
