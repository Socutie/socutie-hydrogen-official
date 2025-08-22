import {Await, Link} from 'react-router';
import {Suspense, useId} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from '../../../storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/layout/Footer';
import {Header, HeaderMenu, HeaderMenuMobile} from '~/components/layout/Header';
import {CartMain} from '~/components/cart/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {I18nLocale} from '~/lib/i18n';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
  i18n: I18nLocale;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  i18n
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
          i18n={i18n}
        />
      )}
      <main className={"mb-32"}>{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="GIỎ HÀNG">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="TÌM KIẾM">
      <div className="predictive-search w-full px-6">
        <br />
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <div className={"w-full"}>
              <input
                className={"w-full py-2 transition-all duration-300 border-b-[2px] border-b-light-bg2 focus:border-b-light-text1 outline-none focus:outline-none"}
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              {/*&nbsp;*/}
              {/*<button onClick={goToSearch}>Search</button>*/}
            </div>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div className={"mt-8"}>Loading...</div>;
            }

            if (!total) {
              return (
                <></>
                // <SearchResultsPredictive.Empty term={term} />
              );
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                {/*<SearchResultsPredictive.Collections*/}
                {/*  collections={collections}*/}
                {/*  closeSearch={closeSearch}*/}
                {/*  term={term}*/}
                {/*/>*/}
                {/*<SearchResultsPredictive.Pages*/}
                {/*  pages={pages}*/}
                {/*  closeSearch={closeSearch}*/}
                {/*  term={term}*/}
                {/*/>*/}
                {/*<SearchResultsPredictive.Articles*/}
                {/*  articles={articles}*/}
                {/*  closeSearch={closeSearch}*/}
                {/*  term={term}*/}
                {/*/>*/}
                {/*{term.current && total ? (*/}
                {/*  <Link*/}
                {/*    onClick={closeSearch}*/}
                {/*    to={`${SEARCH_ENDPOINT}?q=${term.current}`}*/}
                {/*  >*/}
                {/*    <p>*/}
                {/*      View all results for <q>{term.current}</q>*/}
                {/*      &nbsp; →*/}
                {/*    </p>*/}
                {/*  </Link>*/}
                {/*) : null}*/}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <HeaderMenuMobile
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}
