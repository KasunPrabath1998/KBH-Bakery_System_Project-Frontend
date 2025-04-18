import { useState, useRef, useEffect } from "react";

import { placeOrderService } from "../../services/orderService";
import { getOrderProductsService, getCategoriesService, getWebCategoriesService } from "../../services/productService";


type Product = {
  code: number;
  id: string;
  name: string;
  category: string;
  unit_price: number;
  img_url: string;
  weight_state: boolean;
};


const PRODUCTS_PER_PAGE = 6;

export const Products = () => {

  const [pageIndex, setPageIndex] = useState(0);
  const [orderFormVisible, setOrderFormVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [deliveryMethod, setDeliveryMethod] = useState("PICKUP AT STORE");
  const [count, setCount] = useState<number>(1);
  const [weight, setWeight] = useState<number | null>(null);
  const [pickupTime, setPickupTime] = useState<string>("");
  const [pickupDate, setPickupDate] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [contact, setContact] = useState<string>("");

  const orderFormRef = useRef<HTMLDivElement>(null);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [orderProducts, setOrderProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
 





  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);









  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const displayedProducts = Array.isArray(filteredProducts)
  ? filteredProducts.slice(pageIndex * PRODUCTS_PER_PAGE, (pageIndex + 1) * PRODUCTS_PER_PAGE)
  : [];


  const handleOrderClick = (productId: string) => {
    const selectedProduct = filteredProducts.find(product => product.id === productId);

    if (selectedProduct) {
      setSelectedProduct(selectedProduct);
      setOrderFormVisible(true);

      setTimeout(() => {
        orderFormRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      console.warn("Product not found!");
    }
  };


  const handlePlaceOrder = async () => {
    if (!selectedProduct) {
      alert("No product selected");
      return;
    }


    if (
      (selectedProduct.weight_state && !weight) || 
      (!selectedProduct.weight_state && !count) || 
      !pickupTime || 
      !contact
    ) {
      alert("Please fill in all fields before placing an order.");
      return;
    }
    

    // Formatting the pickup time (24-hour to 12-hour format)
    const formattedPickupTime = new Date(`2000-01-01T${pickupTime}`)
      .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
      .toLowerCase();

    // Formatting the pickup date to "MM/DD/YYYY"
    const dateParts = pickupDate.split("-"); // ["2025", "04", "10"]
    const formattedPickupDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // "10/04/2025"
    
    const orderData = {
      order: {
        product_id: selectedProduct.id,
        amount: selectedProduct.weight_state ? weight : count,
        // amount: count,
        address,
        contact,
        pickup_date: formattedPickupDate,
        pickup_time: formattedPickupTime,
        is_weight: selectedProduct.weight_state
      }
    };

    try {
      const response = await placeOrderService(orderData);
      console.log("Order placed successfully:", response);
      alert("Order placed successfully!");
      setOrderFormVisible(false);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };


  const handleConfirmOrder = () => {
    setPopupVisible(false);
    setOrderFormVisible(false);
    setSuccessPopupVisible(true);

    setTimeout(() => {
      setSuccessPopupVisible(false);
    }, 3000);
  };



  useEffect(() => {
    const fetchOrderProducts = async () => {
      try {
        const responseData = await getOrderProductsService();

        if (!responseData) {
          console.warn("⚠️ API returned null or undefined response");
          return;
        }
        if (Array.isArray(responseData.products)) {
          setOrderProducts(responseData.products);
          console.log("Order Products Set:", responseData.products);
        } else {
          console.warn("⚠️ No valid order products received");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setError("Failed to fetch order products");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getWebCategoriesService();
        if (response && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
          setSelectedCategory(response.data.categories[0]); // Set the first category as default
        } else {
          console.warn("⚠️ No categories available");
        }
      } catch (error) {
        setError("Failed to fetch categories");
        console.error("Error fetching categories:", error);
      }
    };

    






    fetchCategories();
    fetchOrderProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = orderProducts.filter(product => product.category === selectedCategory);
      setFilteredProducts(filtered); 
    }
  }, [selectedCategory, orderProducts]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);  
    setPageIndex(0); 
  };




  





  







  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContact(value);

    const isValid = /^0\d{9}$/.test(value);
    if (!isValid) {
      setError("Contact number must be 10 digits and start with 0.");
    } else {
      setError("");
    }
  };








  return (
    <section id="product" className="text-center py-10">
      <div className="w-full px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Explore More</h2>

        <div className="max-w-screen-md mx-auto flex flex-wrap justify-center gap-8 md:gap-6 border-b pb-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`pb-2 text-base md:text-lg font-semibold transition-colors duration-300 ${selectedCategory === category ? "border-b-2 border-brown-500 text-black" : "text-gray-500 hover:text-black"}`}
              onClick={() => {
                handleCategoryClick(category);
                setPageIndex(0);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center space-x-4">
        <button
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
          disabled={pageIndex === 0}
          className="text-2xl font-bold px-3"
        >
          &#60;
        </button>

        {/* Product Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 min-h-[500px]">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="relative shadow-lg rounded-lg overflow-hidden w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-96 mx-auto"
            >
              <div className="relative w-full h-full">
                <img src={product.img_url} alt={product.name} className="w-full h-full object-cover rounded" />

                {/* Order Button */}
                <button
                  onClick={() => handleOrderClick(product.id)}
                  className="absolute top-2 right-0 bg-[#8B4513] bg-opacity-80 text-white py-2 px-4 w-28 sm:w-32 md:w-36 lg:w-40"
                >
                  Order
                </button>

                {/* Name and Price Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#654321] bg-opacity-90 text-white text-center py-2">
                  <p className="font-semibold text-sm sm:text-base">{product.name}</p>
                  <p className="text-xs sm:text-sm">Rs. {product.unit_price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>


        <button
          onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={pageIndex >= totalPages - 1}
          className="text-2xl font-bold px-3"
        >
          &#62;
        </button>
      </div>



      {orderFormVisible && selectedProduct && (
        <div
          ref={orderFormRef}
          className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-auto border"
        >
          <h3 className="text-xl font-semibold mb-4 text-center">
            {selectedProduct.name}{" "}
            <span className="text-gray-600 text-sm">Rs. {selectedProduct.unit_price}</span>
          </h3>




          <div className="mb-3 flex flex-col sm:flex-row items-center">
            <label className="text-gray-700 font-medium w-full sm:w-40">
              {selectedProduct?.weight_state ? "Weight (g):" : "Count:"}
            </label>

            {selectedProduct?.weight_state ? (
              <input
                type="number"
                value={weight ?? ""}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full sm:w-40 px-3 py-2 border rounded text-gray-700"
                placeholder="Enter weight"
              />
            ) : (
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full sm:w-20 px-3 py-2 border rounded text-gray-700"
                placeholder="Enter count"
              />
            )}
          </div>









          {/* <div className="mb-3 flex flex-col sm:flex-row items-center">
            <label className="text-gray-700 font-medium w-full sm:w-40">Count:</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full sm:w-20 px-3 py-2 border rounded text-gray-700"
            />
          </div> */}

          <div>
            <div className="mb-3 flex flex-col sm:flex-row items-center">
              <label className="text-gray-700 font-medium w-full sm:w-40">
                Delivery Method:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="PICKUP AT STORE"
                    checked={deliveryMethod === "PICKUP AT STORE"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="mr-2"
                  />
                  PICKUP AT STORE
                </label>
              </div>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row items-center">
              <label className="text-gray-700 font-medium w-full sm:w-40">Pickup Date</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full sm:w-40 px-3 py-2 border rounded"
                min={new Date().toISOString().split("T")[0]} // Prevents past dates
              />

            </div>


            <div className="mb-4 flex flex-col sm:flex-row items-center">
              <label className="text-gray-700 font-medium w-full sm:w-40">Pickup Time</label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full sm:w-40 px-3 py-2 border rounded"
                min="07:00"
                max="21:00"
              />
            </div>

            {deliveryMethod === "DELIVER TO LOCATION" && (
              <div className="mb-3 flex flex-col sm:flex-row items-center">
                <label className="text-gray-700 font-medium w-full sm:w-40">
                  Address:
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded h-16"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>
            )}
          </div>






          <div className="mb-4 flex flex-col sm:flex-row items-center">
            <label className="text-gray-700 font-medium w-full sm:w-40">Contact Number:</label>
            <input
              type="text"
              value={contact}
              onChange={handleContactChange}
              className="w-full sm:w-60 px-3 py-2 border rounded"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 sm:ml-4 sm:mt-0">{error}</p>
            )}
          </div>







          {/* <div className="mb-4 flex flex-col sm:flex-row items-center">
            <label className="text-gray-700 font-medium w-full sm:w-40">Contact Number:</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full sm:w-60 px-3 py-2 border rounded"
            />
          </div> */}

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setOrderFormVisible(false)}
              className="border px-4 py-2 rounded w-full sm:w-32"
            >
              Discard
            </button>

            <button
              onClick={handlePlaceOrder}
              className="bg-orange-500 text-white px-4 py-2 rounded w-full sm:w-32"
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {popupVisible && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setPopupVisible(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">
              <span className="text-orange-500 font-bold text-xl sm:text-2xl">Hii</span> You are about to place the following order
            </h3>

            {/* Order Details */}
            <div className="mt-4 text-gray-700 text-left space-y-2">
              <p><span className="font-medium">Item:</span> {selectedProduct.name}</p>
              <p><span className="font-medium">Count:</span> {count}</p>
              <p><span className="font-medium">Price:</span> Rs. {selectedProduct.unit_price * count}.00</p>
              <p className="mt-3"><span className="font-medium">Contact:</span> {contact}</p>
              <p><span className="font-medium">Address:</span> {address}</p>
              <p><span className="font-medium">Collecting Method:</span> {deliveryMethod}</p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setPopupVisible(false)}
                className="border border-black px-4 py-2 rounded-lg w-full sm:w-auto"
              >
                DISCARD
              </button>
              <button
                onClick={handleConfirmOrder}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

      {successPopupVisible && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center">
            <div className="flex justify-center">
              <div className="bg-green-500 rounded-full p-3 md:p-4">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-700 mt-3 text-lg md:text-xl font-medium">
              Successfully Placed the Order!
            </p>
            <p className="text-black text-2xl md:text-3xl font-bold mt-2">
              Rs. {selectedProduct?.unit_price * count}.00
            </p>
          </div>
        </div>
      )}

    </section>
  );
};

