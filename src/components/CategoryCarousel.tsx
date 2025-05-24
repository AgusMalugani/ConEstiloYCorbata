import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CategoryModal from './CategoryModal';
import { products } from '../data/products';

interface Category {
  id: number;
  name: string;
  image: string;
  link: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Polar Soft',
    image: 'https://images.pexels.com/photos/6568944/pexels-photo-6568944.jpeg',
    link: '/categoria/polar-soft'
  },
  {
    id: 2,
    name: 'Chalecos Puffer',
    image: 'https://images.pexels.com/photos/6568944/pexels-photo-6568944.jpeg',
    link: '/categoria/chalequitos-puffer'
  },
  {
    id: 3,
    name: 'Camisetas',
    image: 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg',
    link: '/categoria/camisetas'
  },
  {
    id: 4,
    name: 'Accesorios',
    image: 'https://images.pexels.com/photos/6568951/pexels-photo-6568951.jpeg',
    link: '/categoria/accesorios'
  }
];

const CategoryCarousel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(
    product => product.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Nuestras Categorías</h2>
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        className="category-swiper"
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id}>
            <button
              onClick={() => handleCategoryClick(category.name)}
              className="block relative group overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 w-full cursor-pointer"
            >
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <h3 className="text-white text-xl font-semibold p-4 w-full text-center">
                  {category.name}
                </h3>
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        products={filteredProducts}
      />
    </div>
  );
};

export default CategoryCarousel;