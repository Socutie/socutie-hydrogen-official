import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {Image} from '@shopify/hydrogen';

export default function AboutSocutiePage() {
  const srcList = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg",
    "/images/6.jpg",
  ];
  
  return (
    <div className={'flex flex-col items-center mt-48 px-2'}>
      <div className={'w-full max-w-[400px]'}>
        <div className={"mb-16 text-center font-cute font-[700] text-3xl"}>About Socutie</div>
        {/*<Swiper slidesPerView={1}>*/}
        {/*  {srcList.map((imgSrc, index) => (*/}
        {/*    <SwiperSlide>*/}
        {/*      <div className="w-[400px]">*/}
        {/*        <Image*/}
        {/*          src={imgSrc}*/}
        {/*          alt="hero-banner"*/}
        {/*          className="w-full h-auto object-cover"*/}
        {/*          sizes="400px"*/}
        {/*          loading="eager"*/}
        {/*        />*/}
        {/*      </div>*/}
        {/*    </SwiperSlide>*/}
        {/*  ))}*/}
        {/*</Swiper>*/}
        <div className={"flex flex-col"}>
          {srcList.map((src, i) => (
            <div key={src}>
              <Image
                src={src}
                alt="hero-banner"
                className="w-full h-auto object-cover"
                sizes="400px"
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}