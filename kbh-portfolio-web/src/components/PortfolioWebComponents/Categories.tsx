// Categories Component
import breadImage from '../../assets/CategoriesImages/bread.jpg';
import bunsImage from '../../assets/CategoriesImages/buns.jpg';
import pastryImage from '../../assets/CategoriesImages/pastry.jpg';
import cakesImage from '../../assets/CategoriesImages/cakes.jpg';
import doughnutsImage from '../../assets/CategoriesImages/daughnuts.jpg';
import drinksImage from '../../assets/CategoriesImages/drinks.jpg';

export const Categories = () => {
  const categories = [
    { name: "BREAD", image: breadImage },
    { name: "BUNS", image: bunsImage },
    { name: "PASTRY", image: pastryImage },
    { name: "CAKES", image: cakesImage },
    { name: "DOUGHNUTS", image: doughnutsImage },
    { name: "DRINKS", image: drinksImage },
  ];

  const handleCategoryClick = (category: string) => {
    // Scroll to Product component
    const productSection = document.getElementById("product");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
    }

    // Optionally, store the selected category in localStorage or global state
    localStorage.setItem("selectedCategory", category);
  };

  return (
    <section id="delights" className="py-10 text-center">
      <h2 className="text-3xl font-bold italic mb-6">Our Featuring Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto justify-center">
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative w-full max-w-[300px] h-80 shadow-lg mx-auto cursor-pointer"
            onClick={() => handleCategoryClick(category.name)}
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-full bg-orange-500 text-white py-3 text-lg font-bold text-center">
              {category.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};


















// Categories Component
// export const Categories = () => {
//     const categories = [
//       { name: "BREAD", image: "/path-to-bread.jpg" },
//       { name: "BUNS", image: "/path-to-buns.jpg" },
//       { name: "PASTRY", image: "/path-to-pastry.jpg" },
//       { name: "CAKES", image: "/path-to-cakes.jpg" },
//       { name: "DOUGHNUTS", image: "/path-to-doughnuts.jpg" },
//       { name: "DRINKS", image: "/path-to-drinks.jpg" },
//     ];
//     return (
//         <section className="py-10 text-center">
//           <h2 className="text-3xl font-bold mb-6">Our Featuring Categories</h2>
//           <div className="grid grid-cols-3 gap-6 container mx-auto">
//             {categories.map((category, index) => (
//               <div key={index} className="bg-white shadow-lg p-4 rounded">
//                 <img src={category.image} alt={category.name} className="w-full h-40 object-cover rounded" />
//                 <h3 className="mt-2 font-bold text-orange-500">{category.name}</h3>
//               </div>
//             ))}
//           </div>
//         </section>
//       );
//     };