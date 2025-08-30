import {Suspense} from 'react';
import {Await, Link, NavLink, useLocation} from 'react-router';
import type {FooterQuery, HeaderQuery} from '../../../storefrontapi.generated';
import {Logo} from '~/components/layout/Header';
import {Clock, Instagram, Mail, Phone} from 'lucide-react';
import {Image} from '@shopify/hydrogen';
import {
  FadeInItem,
  FadeInStagger,
} from '~/components/framer-motion/FadeInStagger';
import {FadeInDiv} from '~/components/framer-motion/FadeInDiv';
import {APP_STRINGS} from '~/common/constants/appStrings';
import {
  getAvailableLocaleFromPathname,
  getAvailableLocaleUrlPartFromPathname,
} from '~/common/utils/i18nUtils';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  const location = useLocation();

  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer
            key={location.pathname}
            className="w-full py-16 bg-light-main3 flex flex-col items-center px-6 lg:px-20"
          >
            {/*{footer?.menu && header.shop.primaryDomain?.url && (*/}
            {/*  <FooterMenu*/}
            {/*    menu={footer.menu}*/}
            {/*    primaryDomainUrl={header.shop.primaryDomain.url}*/}
            {/*    publicStoreDomain={publicStoreDomain}*/}
            {/*  />*/}
            {/*)}*/}
            <div className={'w-full max-w-screen-xl'}>
              <FadeInStagger>
                <div
                  className={
                    'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-12'
                  }
                >
                  {/* Brand name, description, media */}
                  <FadeInItem viewportAmount={0.1}>
                    <div className={'flex flex-col gap-1'}>
                      <Logo
                        width={84}
                        height={84}
                        pathname={location.pathname}
                      ></Logo>
                      <div className={'text-sm tracking-tight'}>
                        {
                          APP_STRINGS[
                            getAvailableLocaleFromPathname(location.pathname)
                          ].footerIntroduceText
                        }
                      </div>
                    </div>
                  </FadeInItem>

                  {/* Info */}
                  <FadeInItem>
                    <div className={'flex flex-col gap-3'}>
                      <div className={'text-sm font-[600] mb-2'}>
                        {
                          APP_STRINGS[
                            getAvailableLocaleFromPathname(location.pathname)
                          ].footerInfoTitle
                        }
                      </div>
                      <Link
                        to={`${getAvailableLocaleUrlPartFromPathname(location.pathname)}/pages/chinh-sach-giao-hang`}
                      >
                        <div className={'text-sm'}>
                          {
                            APP_STRINGS[
                              getAvailableLocaleFromPathname(location.pathname)
                            ].footerInfoShippingText
                          }
                        </div>
                      </Link>
                      <Link
                        to={`${getAvailableLocaleUrlPartFromPathname(location.pathname)}/pages/chinh-sach-bao-hanh`}
                      >
                        <div className={'text-sm'}>
                          {
                            APP_STRINGS[
                              getAvailableLocaleFromPathname(location.pathname)
                            ].footerInfoWarrantyText
                          }
                        </div>
                      </Link>
                    </div>
                  </FadeInItem>

                  {/* Contact */}
                  <FadeInItem>
                    <div className={'flex flex-col gap-3'}>
                      <div className={'text-sm font-[600] mb-2'}>
                        {
                          APP_STRINGS[
                            getAvailableLocaleFromPathname(location.pathname)
                          ].footerContactTitle
                        }
                      </div>
                      <div className={'flex gap-3'}>
                        <Phone size={20} />
                        <div className={'text-sm'}>
                          {
                            APP_STRINGS[
                              getAvailableLocaleFromPathname(location.pathname)
                            ].footerContactPhone
                          }
                        </div>
                      </div>

                      <div className={'flex gap-3'}>
                        <Mail size={20} />
                        <div className={'text-sm'}>
                          {
                            APP_STRINGS[
                              getAvailableLocaleFromPathname(location.pathname)
                            ].footerContactEmail
                          }
                        </div>
                      </div>

                      <div className={'flex gap-3'}>
                        <Clock size={20} />
                        <div className={'text-sm'}>9:00 - 21:00</div>
                      </div>
                    </div>
                  </FadeInItem>

                  {/* Media */}
                  <FadeInItem>
                    <div className={'flex flex-col gap-3'}>
                      <div className={'text-sm font-[600] mb-2'}>
                        {
                          APP_STRINGS[
                            getAvailableLocaleFromPathname(location.pathname)
                          ].footerFollowUsTitle
                        }
                      </div>
                      <div
                        className={'flex gap-4 items-center max-w-screen-md'}
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
                    </div>
                  </FadeInItem>
                </div>

                {/* Copyright */}
                <div
                  className={'max-w-screen-xl w-full mt-24 flex justify-center'}
                >
                  <FadeInDiv>
                    <div className={'text-sm'}>
                      © {new Date().getFullYear()}{' '}
                      {
                        APP_STRINGS[
                          getAvailableLocaleFromPathname(location.pathname)
                        ].storeName
                      }
                      . All rights reserved.
                    </div>
                  </FadeInDiv>
                </div>
              </FadeInStagger>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu " role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            <div className={'text-light-text1'}>{item.title}</div>
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
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
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
