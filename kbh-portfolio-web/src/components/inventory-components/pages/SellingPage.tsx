import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getProductsService, searchProductsService,getProductByIdService } from '../../../services/productService';
import { doTransactionService } from "../../../services/transactionService";
import { useNavigate } from "react-router-dom";

interface Item {
  id: string;
  name: string;
  unit_price: number;
  category: string;
  count: number
  current_stock:number
  weight_state: boolean;
}

const SellingPage: React.FC = () => {
  const [products, setProducts] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [saleItems , setSaleItems] =  useState<Item[]>([])
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsService();
        console.log(data)
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
  },[]);

  async function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
      const value = e.target.value;
      setSearchTerm(value)
      const fetchedProducts = (await searchProductsService(value)).map((product: any) => ({
        ...product,
        count: 0
      }));
      console.log(fetchedProducts)
      setItems(fetchedProducts)
      setSuggestions(fetchedProducts)
  }

  async function handleSelectItem(value: any) {
    console.log(value);
    setSearchTerm(value.name);
    const fetchedProduct = await getProductByIdService(value.id);
    console.log(fetchedProduct.data.product)
    const product = {
      ...fetchedProduct.data.product,
      count: 1, 
    };
    console.log(product)
    setSaleItems((prevItems) => [...prevItems, product]);
    setSuggestions([]); 
  
    setSearchTerm("")
  }


  async function handleSubmitTransaction () {
    console.log(saleItems);
    setLoading(true);  
    if (saleItems && saleItems.length > 0){
    const transaction = saleItems.map((sale: any) => ({
      ...sale,
      discount: 0,
      discount_type: "Early Bird",
      payment_type: "cash",
      income: 200,
      product_id: sale.id,
      amount: sale.count
    }));
    console.log(transaction);

    try {
      const result = await doTransactionService(transaction);
      console.log(result);

      if (result.data.state) {
        alert("Successfully Added The Transaction");
        handleDiscard()
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Transaction failed. Please try again.");
    } finally {
      setLoading(false);  
    }}else{
      setLoading(false);  
      alert("Select a Product First.");
    }
};


  const handleCountChange = (index: number, change: 'increment' | 'decrement') => {
    console.log(saleItems)
    setSaleItems((prevItems) => {
      const newItems = [...prevItems];
      console.log(newItems[index])
      console.log(newItems[index]['count'])
  if (change === 'increment') {
    newItems[index] = { ...newItems[index], count: newItems[index].count + 1 };
  } else if (change === 'decrement') {
    if (newItems[index].count > 1) {
      newItems[index] = { ...newItems[index], count: newItems[index].count - 1 };
    } else {
      // Remove the item if count becomes 0
      return newItems.filter((_, i) => i !== index);
    }
  }
      return newItems;
    });
  };
  const handleDiscard = () => {
    setSaleItems([]); 
    setSearchTerm(''); 
    setSuggestions([]); 
  };
  const totalAmount = saleItems.reduce((acc, item) => acc + item.unit_price * item.count, 0);

  return (
    <div className="font-sans bg-white p-5">
      <div className="mb-4 flex justify-center">
        <div className="relative w-1/3 z-50">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search Item Name"
            className="border border-gray-300 p-2 w-full pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          {suggestions.length > 0 && isFocused && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelectItem(suggestion)}
                >
                  {suggestion.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* <div className="mb-5 text-center">
        <h2 className="text-1xl font-bold mb-5 text-left">ORDER ID: 0002</h2>
      </div> */}

      <table className="w-full mt-5">
        <thead>
          <tr>
            <th className="p-2 text-center border-b-2 border-b-black">Product</th>
            <th className="p-2 text-center border-b-2 border-b-black">Category</th>
            <th className="p-2 text-center border-b-2 border-b-black">Unit Price</th>
            <th className="p-2 text-center border-b-2 border-b-black">Count</th>
            <th className="p-2 text-center border-b-2 border-b-black">Amount</th>
            <th className="p-2 text-center border-b-2 border-b-black">Current Stock</th>
          </tr>
        </thead>
        <tbody>
        
        {saleItems.length > 0 ? (
  saleItems.map((item, index) => (
    <tr key={index} className="border-b-2 border-b-black">
      <td className="p-2 text-center">{item.name}</td>
      <td className="p-2 text-center">{item.category}</td>
      <td className="p-2 text-center">{item.unit_price}</td>
      <td className="p-2 text-center flex justify-center items-center">
        {item.weight_state ? (
          <>
            <button
              onClick={() => handleCountChange(index, 'decrement')}
              className="bg-[#d1cac6] px-2 border rounded-full h-7 flex items-center justify-center"
            >
              −
            </button>
            <span className="mx-2">{item.count}</span>
            <button
              onClick={() => handleCountChange(index, 'increment')}
              className="bg-[#d1cac6] px-2 border rounded-full h-7 flex items-center justify-center"
            >
              +
            </button>
          </>
        ) : (
          <input
            type="number"
            value={item.count}
            onChange={(e) => {
              const newCount = parseInt(e.target.value, 10);
              if (!isNaN(newCount) && newCount >= 0) {
                setSaleItems((prevItems) => {
                  const updatedItems = [...prevItems];
                  updatedItems[index] = { ...updatedItems[index], count: newCount };
                  return updatedItems.filter(item => item.count > 0);
                });
              }
            }}
            className="w-16 text-center border p-1 rounded-md"
          />
        )}
      </td>
      <td className="p-2 text-center">{item.unit_price * item.count}</td>
      <td className="p-2 text-center">{item.current_stock}</td>
    </tr>
  ))
) : (<></>)}

        </tbody>
      </table>

      {items.length > 0 && (
        <>
          <div className="flex justify-between mt-4">
            <div className="font-bold text-right w-full mr-12">TOTAL: {totalAmount}</div>
          </div>

          <div className="flex justify-center mt-4 space-x-4">
          <button
            className="bg-white text-[#770404] border-2 border-[#770404] px-4 py-2 rounded-[20px]"
            onClick={handleDiscard} 
          >
            DISCARD
          </button>
          <button
            className="bg-[#3D6438] text-white px-4 py-2 rounded-[20px] flex items-center"
            onClick={handleSubmitTransaction}
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin border-4 border-t-4 border-green-500 border-solid w-6 h-6 rounded-full mr-2 border-t-transparent"></div>
            ) : (
              'COMPLETE'
            )}
          </button>


          </div>
        </>
      )}
    </div>
  );
};

export default SellingPage;
