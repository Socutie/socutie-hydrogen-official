import {Image} from '@shopify/hydrogen';
import {FadeInDiv} from '~/components/framer-motion/FadeInDiv';
import {LoaderCircle} from 'lucide-react';
import {APP_STRINGS} from '~/common/constants/appStrings';
import {getAvailableLocaleFromPathname} from '~/common/utils/i18nUtils';

export function HeroBanner({showSectionContent = false, src = "/images/big-banner.jpg", aspectClass = "aspect-[3/4] lg:aspect-[16/9]"}) {
  return (
    <FadeInDiv offsetY={-40} duration={0.6}>
      <div className="relative">
        <Image
          src={src}
          alt="hero-banner"
          className={`w-full h-auto object-cover ${aspectClass}`}
          sizes="100vw"
        />

        {/* Black overlay */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Optional content */}
        {showSectionContent && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-fancy text-center text-light-bg1 text-3xl md:text-4xl mb-2 md:mb-4 mt-[20%]">New Arrival</div>
          <div className="font-[600] text-center text-light-bg1 text-4xl md:text-5xl mb-6 md:mb-8">Summer Collection 2025</div>
          <button
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
             `
        }>
        <div className={"relative z-10 flex gap-3 items-center justify-center"}>
          <div className={""}>EXPLORE NOW</div>
        </div>
      </button>
    </div>
        )}

      </div>
    </FadeInDiv>
  );
}