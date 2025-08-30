import type {ProductFragment, ProductVariantFragment} from '../../../storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
import {Swiper, SwiperSlide} from 'swiper/react';
import {useEffect, useRef, useState} from 'react';
import 'swiper/css';
import {Navigation} from 'swiper/modules';
import {ChevronLeft, ChevronRight} from 'lucide-react';

export function ProductImage({
  variantImage,
  images
}: {
  variantImage: ProductVariantFragment['image'],
  images: ProductFragment['images']['nodes'];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  const imgUrls = images.map(image => image.url);

  useEffect(() => {
    const variantImgIndex = imgUrls.findIndex(url => url === variantImage!.url);

    if(variantImgIndex === -1) return;

    swiperRef.current?.slideTo(variantImgIndex);
    setCurrentIndex(variantImgIndex);
  }, [variantImage!.url]);

  if (!variantImage) {
    return <div className="product-image" />;
  }
  return (
    <div className="flex gap-8">
      {/* Images list for desktop */}
      <div className="hidden lg:flex flex-col gap-2 w-[50px] max-h-[60vh] overflow-y-auto scrollbar-hidden">
        {imgUrls.map((url, index) => (
          <Image
            key={url}
            src={url}
            alt={'Product Thumbnail'}
            className={`aspect-[3/4] object-cover w-full p-[2px] cursor-pointer border ${currentIndex === index ? 'border-light-main' : 'border-light-bg1'} transition-all duration-300 ease-in-out`}
            sizes="100px"
            onClick={() => {
              swiperRef.current?.slideTo(index);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>

      {/* Main image */}
      {/*<div className={"w-full hidden lg:flex lg:flex-col gap-4"}>*/}
      {/*  {imgUrls.map((url, index) => (*/}
      {/*    <Image*/}
      {/*      key={url}*/}
      {/*      src={url}*/}
      {/*      alt={'Product Thumbnail'}*/}
      {/*      className={`aspect-[3/4] object-cover w-full`}*/}
      {/*      sizes="50vw"*/}
      {/*      onClick={() => {*/}
      {/*        swiperRef.current?.slideTo(index);*/}
      {/*        setCurrentIndex(index);*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</div>*/}

      <div className={"flex-1 min-w-0"}>
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          grabCursor={false}
          speed={300}
          touchRatio={1}
          touchAngle={30}
          className={'relative w-full aspect-[3/4] h-auto group'}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => {
            setCurrentIndex(swiper.activeIndex);
          }}
        >
          {imgUrls.map((url, index) => (
            <SwiperSlide key={url}>
              <img src={url} alt="1" className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}

          {/* Nav buttons */}
          <button
            className={`${currentIndex === 0 ? 'hidden' : ''} absolute opacity-0 group-hover:opacity-70 transition-all duration-200 ease-in-out p-2 z-10 top-1/2 left-4 -translate-y-1/2 bg-light-bg1 text-light-text1 rounded-full shadow`}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            className={`${currentIndex === imgUrls.length - 1 ? 'hidden' : ''} absolute opacity-0 group-hover:opacity-70 transition-all duration-200 ease-in-out p-2 z-10 top-1/2 right-4 -translate-y-1/2 bg-light-bg1 text-light-text1 rounded-full shadow"`}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>

          {/* Index Display */}
          <div className="flex flex-wrap gap-2 w-full px-4 justify-center items-center absolute opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out bottom-4 left-1/2 -translate-x-1/2 z-10">
            {imgUrls.map((url, index) => (
              <button
                key={url}
                className={`w-2 h-2 ${currentIndex === index ? 'bg-light-main' : 'bg-light-bg1 opacity-60'} rounded-full transition-all duration-300 ease-in-out`}
                onClick={() => {
                  swiperRef.current?.slideTo(index);
                  setCurrentIndex(index);
                }}
              ></button>
            ))}
          </div>
        </Swiper>
      </div>

    </div>
  );
}
