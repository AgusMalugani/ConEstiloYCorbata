import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroCarousel: React.FC = () => {
  const heroImages = [
    {
      id: 1,
      url: 'https://dcdn-us.mitiendanube.com/stores/003/008/308/themes/style/1-slide-1740743476931-6753418377-1b28d42bf6f673793f9c5db00f9737a61740743478-1920-1920.png?1480414231',
      alt: 'Perrito con ropa elegante'
    },
    {
      id: 2,
      url: 'https://dcdn-us.mitiendanube.com/stores/003/008/308/themes/style/1-slide-1740742892047-1627557969-2a44a19ac8472dcd2878df2ad185da8a1740742894-1920-1920.png?1480414231',
      alt: 'Perrito con chaleco'
    },
    {
      id: 3,
      url: 'https://dcdn-us.mitiendanube.com/stores/003/008/308/themes/style/1-slide-1740742892061-1937921802-af8b32862e2b104b43d52d665df7c87e1740742895-1920-1920.png?1480414231',
      alt: 'Perrito con camiseta'
    }
  ];

  return (
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="hero-swiper !absolute inset-0"
      >
        {heroImages.map((image) => (
          <SwiperSlide key={image.id} className="!h-full">
            <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;