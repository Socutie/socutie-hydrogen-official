import {Image} from '@shopify/hydrogen';
import {FadeInDiv} from '~/components/framer-motion/FadeInDiv';
import {LoaderCircle} from 'lucide-react';
import {APP_STRINGS} from '~/common/constants/appStrings';
import {getAvailableLocaleFromPathname, getAvailableLocaleUrlPartFromPathname} from '~/common/utils/i18nUtils';
import {motion} from 'framer-motion';
import {Link, useLocation} from 'react-router';

export function BannerSection({
  collection,
  showSectionContent = false,
  src = '/images/hero-banner.jpg',
  aspectClass = 'aspect-[3/4] lg:aspect-[16/9]',
  overlayClass = 'bg-black/0',
  hasLink = true
}: {
  collection?: any;
  showSectionContent?: boolean;
  src?: string;
  aspectClass?: string;
  overlayClass?: string;
  hasLink?: boolean;
}) {
  const location = useLocation();

  return (
    <div className="relative">
      <motion.div
        className="w-full overflow-hidden" // ensures no layout shift
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        transition={{duration: 0.5, ease: 'easeOut'}}
        viewport={{once: true}}
      >
        <motion.div
          initial={{scale: 1.1}}
          whileInView={{scale: 1}}
          transition={{duration: 0.5, ease: 'easeOut'}}
          viewport={{once: true}}
        >
          <a
            target={'_blank'}
            rel="noopener noreferrer"
            href={
              'https://www.instagram.com/p/DNqQbWeJ_uV/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
            }
            className={`${hasLink ? '' : 'pointer-events-none'}`}
          >
            <Image
              src={src}
              alt="hero-banner"
              className={`w-full h-auto object-cover ${aspectClass}`}
              sizes="100vw"
              loading={'eager'}
            />
          </a>
        </motion.div>
      </motion.div>

      {/* Black overlay */}
      <div className={`absolute inset-0 ${overlayClass} pointer-events-none`} />

      {/* Optional content */}
      {/*<motion.div*/}
      {/*  className={`${showSectionContent ? "" : "hidden"} absolute inset-0 flex flex-col items-center justify-center`}*/}
      {/*  initial={{opacity: 0, y: -20}}*/}
      {/*  whileInView={{opacity: 1, y: 0}}*/}
      {/*  transition={{duration: 0.5, ease: 'easeOut'}}*/}
      {/*  viewport={{ once: true }}*/}
      {/*>*/}
      {/*  <div className="font-fancy text-center text-light-bg1 text-2xl sm:text-3xl md:text-4xl mb-2 md:mb-4 mt-[40%] md:mt-[20%]">*/}
      {/*    New Arrival*/}
      {/*  </div>*/}
      {/*  <div className="font-[600] text-center text-light-bg1 text-3xl sm:text-4xl md:text-5xl mb-6 md:mb-8">*/}
      {/*    {`${collection ? collection.title : "Socutie Special Collection"}`}*/}
      {/*  </div>*/}
      {/*  <Link*/}
      {/*    className={`*/}
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
      {/*    to={getAvailableLocaleUrlPartFromPathname(location.pathname) + `${collection ? `/collections/${collection.handle}` : "/collections/best-sellers"}`}*/}
      {/*  >*/}
      {/*    <div*/}
      {/*      className={'relative z-10 flex gap-3 items-center justify-center'}*/}
      {/*    >*/}
      {/*      <div className={''}>EXPLORE NOW</div>*/}
      {/*    </div>*/}
      {/*  </Link>*/}
      {/*</motion.div>*/}
    </div>
  );
}
