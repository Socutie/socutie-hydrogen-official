import {Image} from '@shopify/hydrogen';
import HTMLFlipBook from 'react-pageflip';
import {Logo} from '~/components/layout/Header';
import {useLocation} from 'react-router';
import {ArrowRight, HandMetal} from 'lucide-react';
import {getAvailableLocaleFromPathname} from '~/common/utils/i18nUtils';
import {APP_STRINGS} from '~/common/constants/appStrings';

export function HomeBook() {
  const location = useLocation();

  const srcList = getAvailableLocaleFromPathname(location.pathname) === "vi-vn" ? [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg",
    "/images/6.jpg",
  ] : [
    "/images/1eng.jpg",
    "/images/2eng.jpg",
    "/images/3eng.jpg",
    "/images/4eng.jpg",
    "/images/5eng.jpg",
    "/images/6eng.jpg",
  ];

  return (
    <div className={"w-full overflow-hidden py-20"}>
      <HTMLFlipBook
        width={400}
        height={700}
        size="stretch"
        drawShadow={true}
        maxShadowOpacity={0.4}
        flippingTime={900}
        showCover={true}
        usePortrait={true}
        autoSize={true}
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1500}
      >
        <div className={"p-4 bg-light-main3 w-full h-full rounded-lg cursor-pointer"}>
          <div className={"h-full w-full flex flex-col gap-4 justify-center items-center"}>
            <div className={'rounded-[100%] p-3 bg-light-main4'}>
              <Logo width={60} height={60} pathname={location.pathname} disableNavigate={true}/>
            </div>
            <div className={"font-fancy text-3xl sm:text-4xl"}>Socutie Handbook</div>
            <div className={"text-sm text-center"}>{APP_STRINGS[getAvailableLocaleFromPathname(location.pathname)].handbookTitle}</div>
            <div className={"mt-6 animate-bounce"}>
              <HandMetal strokeWidth={1.5} size={20}/>
            </div>

          </div>
        </div>
        {srcList.map((imgSrc, i) => (
          <div key={imgSrc} className={"p-4 bg-light-main4 w-full h-full cursor-pointer flex justify-center items-center rounded-lg"}>
            <Image
              src={imgSrc}
              alt="hero-banner"
              className={`w-full h-auto object-cover`}
              sizes="(max-width: 768px) 500px, 100vw"
              loading={'eager'}
            />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  )
}