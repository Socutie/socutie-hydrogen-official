import {Image} from '@shopify/hydrogen';
import {FadeInDiv} from '~/components/framer-motion/FadeInDiv';

export function HeroBanner({src = "/images/big-banner.png", aspectClass = "aspect-[3/4] md:aspect-[16/9]"}) {
  return (
    <FadeInDiv offsetY={-20}>
      <div className="relative">
        <Image
          src={src}
          alt="hero-banner"
          className={`w-full h-auto object-cover ${aspectClass}`}
          sizes="100vw"
        />

        {/* Black overlay */}
        <div className="absolute inset-0 bg-black/15" />

        {/* Optional content */}
        {/* <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-white text-5xl">Summer Collection 2025</div>
    </div> */}
      </div>
    </FadeInDiv>
  );
}