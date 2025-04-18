import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import images
import chocolatemilkshake from '../../assets/FeaturedTreatsImages/chocolatemilkshake.jpg';
import chocolatecake from '../../assets/FeaturedTreatsImages/chocolatecake.jpg';
import fruitcake from '../../assets/FeaturedTreatsImages/fruitcake.jpg';
import faluda from '../../assets/FeaturedTreatsImages/faluda.jpg';
import fruitsalad from '../../assets/FeaturedTreatsImages/fruitsalad.jpg';
import mangojuice from '../../assets/FeaturedTreatsImages/mangojuice.jpg'

export const FeaturedTreats = () => {
  const categories = [
    { name: "Faluda", price: "Rs.250", image: faluda },
    { name: "Chocolate Cake", price: "Rs.120", image: chocolatecake },
    { name: "Mango Juice", price: "Rs.250", image: mangojuice },
    { name: "Chocolate Milkshake", price: "Rs.350", image: chocolatemilkshake },
    { name: "Fruit Cake", price: "Rs.1100", image: fruitcake },
    { name: "Fruit Salad", price: "Rs.250", image: fruitsalad },
    
    
  ];

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 3;

  const handleNext = () => {
    if (startIndex + itemsPerPage < categories.length) {
      setStartIndex((prev) => Math.min(prev + itemsPerPage, categories.length - itemsPerPage));
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => Math.max(prev - itemsPerPage, 0));
    }
  };

  const visibleItems = categories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="featuredtreats" className="py-20 text-center">
      <h2 className="text-3xl font-bold italic mb-6">Featured Treats</h2>
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Carousel Container */}
        <div className="relative flex items-center justify-center">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="absolute left-0 p-2 bg-white shadow-md rounded-full z-10 disabled:opacity-50"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1 ">
            {visibleItems.map((category, index) => (
              <div key={index} className="relative w-full max-w-xs h-80 shadow-lg mx-auto transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl animate-slide-in">
                <img src={category.image} className="w-full h-full object-cover rounded-lg transition-transform duration-500 ease-in-out hover:scale-110" alt={category.name} />
                <div className="text-black py-2 text-lg font-bold text-center flex justify-center space-x-4 mt-2">
                  <span>{category.name}</span>
                  <span>{category.price}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            disabled={startIndex + itemsPerPage >= categories.length}
            className="absolute right-0 p-2 bg-white shadow-md rounded-full z-10 disabled:opacity-50"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </section>
  );
};


























// // FeaturedTreats Component
// export const FeaturedTreats = () => {
//   const categories = [
//     { name: "Puff Pastry", price: "Rs.120", image: "src/assets/puffpastry.jpg" },
//     { name: "DOUGHNUTS", price: "Rs.150", image: "src/assets/daughnuts.jpg" },
//     { name: "BROWNIES", price: "Rs.120", image: "src/assets/Brownies.jpg" },
//   ];

//   return (
//     <section className="py-10 text-center">
//       <h2 className="text-3xl font-bold italic mb-6">Featured Treats</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto justify-center pb-6">
//         {categories.map((category, index) => (
//           <div key={index} className="relative w-full max-w-[300px] h-80 shadow-lg mx-auto">
//             <img src={category.image} className="w-full h-full object-cover" alt={category.name} />
//             {/* Text outside the image, centered with a small gap between name and price */}
//             <div className="text-black py-2 text-lg font-bold text-center flex justify-center space-x-4 mt-2">
//               <span>{category.name}</span>
//               <span>{category.price}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };
