import React, { useEffect } from "react";

export interface Product {
  code: string;
  name: string;
  category: string;
  unit_price: number;
  order_state: boolean;
  id: string;
  img_url?: string;
  inventory_retain_state:boolean;
  weight_state:boolean;
}

interface CategoryTabsProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  categories: string[];
  products: Product[];
  setFilteredProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeTab,
  setActiveTab,
  categories,
  products,
  setFilteredProducts,
}) => {
  // Set the default active tab when categories change or on component mount
  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0]);
      setFilteredProducts(products.filter((product) => product.category === categories[0]));
    }
  }, [categories, activeTab, setActiveTab, setFilteredProducts, products]);

  return (
    <div className="font-sans bg-white p-5">
   <div className="flex justify-center items-center">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 p-4  rounded-lg">
      {categories.length > 0 ? (
        categories.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === "all") {
                setFilteredProducts(products);
              } else {
                setFilteredProducts(
                  products.filter((product) => product.category === tab)
                );
              }
            }}
            className={`px-4 py-2 text-sm font-semibold border-2 uppercase ${
              activeTab === tab
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-[#903E0B] border-[#903E0B]"
            }`}
          >
            {tab}
          </button>
        ))
      ) : (
        <span>Loading categories...</span>
      )}
    </div>
  </div>
</div>

  );
};

export default CategoryTabs;
