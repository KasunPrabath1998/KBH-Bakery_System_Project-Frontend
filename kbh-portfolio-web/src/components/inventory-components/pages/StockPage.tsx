import React, { useState, useEffect, useCallback } from "react";
import { FaEdit } from "react-icons/fa";
import { getCategoriesService, getProductsService, searchProductsService } from "../../../services/productService";
import CategoryTabs from "../components/Tabs";
import SearchBar from "../components/SearchBar";
import { addStockService } from "../../../services/stockService";

interface Product {
  id: string;
  name: string;
  category: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const fetchedCategories = await getCategoriesService();
        setCategories(fetchedCategories.data.categories);
  
        if (fetchedCategories.data.categories.length > 0) {
          setActiveTab(fetchedCategories.data.categories[0]); // Set the default active tab to the first category
        }
  
        const products: Product[] = await getProductsService();
        setItems(products);
        setFilteredItems(products.filter((item) => item.category === fetchedCategories.data.categories[0])); // Filter based on the default category
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  
  useEffect(() => {
    setFilteredItems(items.filter((item: Product) => item.category === activeTab));
  }, [activeTab, items]);
  
  const handleSearchChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    if (value) {
      try {
        setLoading(true);
        const results = await searchProductsService(value);
        setFilteredItems(results.filter((item: Product) => item.category === activeTab)); 
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setFilteredItems(items.filter((item: Product) => item.category === activeTab)); 
    }
  }, [items, activeTab]);
  

  
  const handleCountChange = (id: string, action: 'increment' | 'decrement') => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? {
              ...item,
              stock: action === 'increment'
                ? (Number(item.stock) || 0) + 1 
                : Math.max(0, (Number(item.stock) || 0) - 1)
              
            }
          : item
      )
    );
  };



  // const handleCompleteClick = async (id: string) => {
  //   console.log(id)
  //   setItems((prevItems) =>
  //     prevItems.map((item) => (item.id === id ? { ...item, isEditing: false } : item))
  //   );
  //   const relevantItem = items.find((item) => item.id === id);
  //   console.log(relevantItem)
  //   const body_object = {
  //     inventory:{
  //           product_id:id,
  //           stock:relevantItem.stock
  //       }
  //   }
  //   console.log(body_object)
  //   const result = await addStockService(body_object)
  //   console.log(result)
  //   window.location.reload();
  // };


  const handleCompleteClick = async (id: string) => {
    try {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, isEditing: false } : item))
      );
  
      const relevantItem = items.find((item) => item.id === id);
      const body_object = {
        inventory: {
          product_id: id,
          stock: relevantItem.stock,
        },
      };
  
      await addStockService(body_object);
      
      const updatedProducts = await getProductsService();
      setItems(updatedProducts);
      setFilteredItems(
        updatedProducts.filter((item: Product) => item.category === activeTab)
      );
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };
  

  const handleEditClick = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isEditing: true } : item
      )
    );
  };

  
  return (
    <div className="font-sans bg-white p-3 mt-2">

      <CategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} categories={categories} products={items} setFilteredProducts={setFilteredItems} />


      <div className="flex justify-end ">
          <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          <button className="ml-2 mr-3 text-orange-900 border border-orange-600 bg-white px-4 py-1 rounded cursor-pointer hover:text-black transition-all">
            Update Retain Stock
          </button>
      </div>

      
      {loading ? (
        <div className="flex justify-center items-center my-4">
          <div className="animate-spin border-t-4 border-orange-500 border-solid rounded-full w-12 h-12"></div>
        </div>
      ) : (
       <table className="w-full border-collapse p-5">
              <thead>
                <tr >
                  <th className="p-2 text-center border-b-2 border-b-black text-xs sm:text-sm md:text-base lg:text-lg">ITEM CODE</th>
                  <th className="p-2 text-center border-b-2 border-b-black text-xs sm:text-sm md:text-base lg:text-lg">ITEM NAME</th>
                  <th className="p-2 text-center border-b-2 border-b-black text-xs sm:text-sm md:text-base lg:text-lg">CATEGORY</th>
                  <th className="p-2 text-center border-b-2 border-b-black text-xs sm:text-sm md:text-base lg:text-lg">IN STOCK</th>
                  <th className="p-2 text-center border-b-2 border-b-black text-xs sm:text-sm md:text-base lg:text-lg">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 text-center border-b-2 border-b-black text-xs sm:text-sm md:text-base lg:text-lg">{item.code}</td>
                      <td className="p-2 text-center border-b-2 border-b-black text-xs sm:text-sm md:text-base lg:text-lg">{item.name}</td>
                      <td className="p-2 text-center border-b-2 border-b-black text-xs sm:text-sm md:text-base lg:text-lg">{item.category}</td>
                      <td className="p-2 text-center border-b-2 border-b-black text-xs sm:text-sm md:text-base lg:text-lg">
                        {item.isEditing ? (
                          <div className="flex justify-center items-center">
                            <button
                              onClick={() => handleCountChange(item.id, 'decrement')}
                              className="bg-[#d1cac6] px-2 border rounded-full h-7 flex items-center justify-center"
                            >
                              −
                            </button>
                            <span className="mx-2">{item.current_stock+item.stock||item.current_stock}</span>
                            <button
                              onClick={() => handleCountChange(item.id, 'increment')}
                              className="bg-[#d1cac6] px-2 border rounded-full h-7 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span>{item.current_stock+item.stock||item.current_stock}</span>
                        )}
                      </td>
                      <td className="p-2 text-center border-b-2 border-b-black text-xs sm:text-sm md:text-base lg:text-lg">
                        {item.isEditing ? (
                          <button
                            onClick={() => handleCompleteClick(item.id)}
                            className="bg-[#3D6438] text-white text-[10px] px-2 py-1 rounded-full"
                          >
                            COMPLETE
                          </button>
                        ) : (
                          <button onClick={() => handleEditClick(item.id)} className="text-black-500 hover:text-orange-700">
                            <FaEdit size={20} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6} 
                      className="p-2 text-center border-b-2 border-b-black text-xs sm:text-sm md:text-base lg:text-lg"
                    >
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
            
      
      )}
    </div>
  );
};

export default App;