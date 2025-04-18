import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import AddItemForm from "../components/products-Componets/AddItemForm";
import CategoryTabs from "../components/Tabs";
import ItemList from "../components/products-Componets/ProductsTtemList";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
import { getCategoriesService, deleteProductsService, getProductsService, searchProductsService } from "../../../services/productService";

interface Product {
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

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getProductsService();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);

        const fetchedCategories = await getCategoriesService();
        setCategories(fetchedCategories.data.categories);

        if (fetchedCategories.length > 0) {
          setActiveTab(fetchedCategories[0]);
        }
      } catch (error) {
        setError("Failed to fetch products or categories");
        console.error("Error fetching products or categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    if (activeTab && categories.length > 0) {
      const filtered = products.filter((product) => product.category === activeTab);
      setFilteredProducts(filtered);
    }
  }, [activeTab, categories, products]);

  const handleSearchChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  
  
    if (value) {
      try {
        setLoading(true);
  
        let result = await searchProductsService(value);
  
        if (activeTab && categories.length > 0) {
          result = result.filter((product: Product) => product.category === activeTab); 
        }
  
        setFilteredProducts(result);
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setLoading(false);
      }
    } else {
      if (activeTab && categories.length > 0) {
        const filtered = products.filter((product: Product) => product.category === activeTab); 
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(products); 
      }
    }
  }, [activeTab, categories, products]);
  
  const handleImage = (id: string) => {
    navigate(`/edit-image/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-product/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      console.log(`Attempting to delete product with ID: ${id}`);
      setLoading(true);
      await deleteProductsService(id);
      const fetchedProducts = await getProductsService();
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
      console.log(`Successfully deleted product with ID: ${id}`);
    } catch (error) {
      console.error(`Failed to delete product with ID: ${id}`, error);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="font-sans bg-white p-3 mt-2 ">
        <CategoryTabs categories={categories} activeTab={activeTab} setActiveTab={setActiveTab} products={products} setFilteredProducts={setFilteredProducts} />
      </div>

      <div className="mb-4 flex justify-end">
        <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        <button onClick={() => setIsFormOpen(true)} className="bg-white text-[#770404] border-2 border-[#770404] px-3 py-1 rounded-md hover:text-black ml-2 mr-4 cursor-pointer">+ Add Product</button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center my-4">
          <div className="animate-spin border-t-4 border-orange-500 border-solid rounded-full w-12 h-12"></div>
        </div>
      ) : (
        <ItemList products={filteredProducts} handleEdit={handleEdit} handleImage={handleImage} handleDelete={handleDelete} />
      )}

      {isFormOpen && (
        <AddItemForm
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          setProducts={setProducts}
        />
      )}
    </div>
  );
};

export default ProductsPage;
