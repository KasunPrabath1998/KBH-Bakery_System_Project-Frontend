import React, { useState, useEffect, useRef } from "react";
import { getOrderService,searchOrdersService } from "../../../services/orderService";
import { postTodayOrderReportService } from "../../../services/reportService";
import { FaSearch } from "react-icons/fa";
import { Pencil } from "lucide-react";
import { updateOrderService } from "../../../services/orderService";

type Order = {
  id: string;
  code: string;
  product_code: string;
  category: string;
  name: string;
  amount: number;
  total_price: number;
  pickup_date: string;
  pickup_time: string;
  contact: string;
  delivery_state: string;
  weight_state: boolean;
  item: { total_price: number };
  product_id: string;
  address: string;
  place_date?: string;
  placed_time?: string;
};



type Item = {
  id: string;
  name: string;
  [key: string]: any;
};

const OrdersPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [editRow, setEditRow] = useState<string | null>(null);
  const [updatedOrder, setUpdatedOrder] = useState<Partial<Order>>({});

  const [showTodayPlacePopup, setShowTodayPlacePopup] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [reportResponse, setReportResponse] = useState<any>(null);
  
  const [success, setSuccess] = useState("");


  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrderService();
      const orderList = response?.data?.orders?.all;
      if (Array.isArray(orderList)) setOrders(orderList);
      else setError("No orders found.");
    } catch (error: any) {
      console.error("❌ Fetch Error:", error);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      await fetchOrders();
      setSuggestions([]);
      return;
    }

    try {
      const response = await searchOrdersService(value);
      const resultOrders = response?.data?.orders?.all || [];
      setOrders(resultOrders);

      const suggestionList = response?.data?.suggestions || [];
      setSuggestions(suggestionList);
    } catch (error) {
      console.error("Search failed:", error);
      setSuggestions([]);
    }
  };

  const handleSelectItem = (item: Item) => {
    setSearchTerm(item.name);
    setSuggestions([]);
  };

  const handleEditClick = (order: Order) => {
    setEditRow(order.code);
    setUpdatedOrder({ ...order });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    if (updatedOrder) {
      setUpdatedOrder({
        ...updatedOrder,
        [field]: e.target.value,
      });
    }
  };

  const handleGenerateTodayReport = () => {
    setShowTodayPlacePopup(true);
  };

  const handleSubmitTodayReport = async () => {
    if (!selectedPlace) return alert("Please select a place.");
    try {
      setLoading(true);
      const response = await postTodayOrderReportService({ type: selectedPlace });
  
      console.log("Report submission response:", response);
  
      if (response?.code === 0 && response?.state === true) {
        setReportResponse({
          success: true,
          message: response.message || "Report submitted successfully."
        });
      } else {
        setReportResponse({
          error: response?.message || "Something went wrong."
        });
      }
    } catch (err) {
      console.error("Report submission failed:", err);
      setReportResponse({ error: "Failed to generate report." });
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };
  
  
  
  const handleSave = async () => {
     if (!updatedOrder?.id) {
       setError("❌ Invalid order data.");
       return;
     }
 
     setLoading(true);
     setError("");
     setSuccess("");
 
     try {
       const orderData = {
         order:{
         id : updatedOrder.id,
         code: updatedOrder.code,
         address: updatedOrder.address,
         product_id: updatedOrder.product_id,
         pickup_time: updatedOrder.pickup_time,
         contact: updatedOrder.contact,
         pickup_date: updatedOrder.pickup_date,
         amount: updatedOrder.amount,
         total_price: updatedOrder.total_price || 0,
         delivery_state: updatedOrder.delivery_state || "pending",
         place_date: updatedOrder.place_date || new Date().toISOString(),
         placed_time: updatedOrder.placed_time || new Date().toISOString(),
       }
       };
 
       const response = await updateOrderService(orderData);
 
       if (response) {
         setSuccess("✅ Order updated successfully!");
         setEditRow(null); 
       } else {
         throw new Error("No response from the server");
       }
     } catch (error) {
       setError("❌ Failed to update the order. Please try again.");
     } finally {
       setLoading(false);
       fetchOrders();
     }
   };
  
  

  return (
    <div className="flex justify-center items-center text-center p-5">
      <div className="w-full max-w-7xl">
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
        <div className="mb-4 flex justify-center">
          <div className="flex flex-wrap justify-between items-center w-full px-4">
            <div className="relative w-full sm:w-1/3">
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
                <div className="absolute top-full left-0 w-full bg-white border mt-1 rounded shadow-lg z-10">
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
            <div className="flex gap-2 mt-4 sm:mt-0 sm:w-1/3 justify-end">
              <button
                className="bg-orange-700 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm sm:text-base"
                onClick={handleGenerateTodayReport}
              >
                Today's Report
              </button>
            </div>
          </div>
        </div>

        {/* Popup */}
        {showTodayPlacePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow w-80 text-center space-y-4">
             <h2 className="text-lg font-semibold">Select Type for Today’s Report</h2>
             {reportResponse?.error && (
                <p className="text-sm text-red-500">{reportResponse.error}</p>
              )}
              {reportResponse?.success && (
                <p className="text-sm text-green-500">{reportResponse.message}</p>
              )}
              <select
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">-- Select Type --</option>
                <option value="placed">Placed Today</option>
                <option value="pick">Pickup Today</option>
              </select>
              <div className="flex gap-4 mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded w-full"
                onClick={() => {
                  setShowTodayPlacePopup(false);
                  setReportResponse(null); 
                  setSelectedPlace("");   
                }}
              >
                Cancel
              </button>

                <button
                  className={`bg-orange-500 text-white px-4 py-2 rounded w-full flex justify-center items-center ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                  onClick={handleSubmitTodayReport}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin w-5 h-5 border-4 border-t-transparent border-orange-300 rounded-full" />
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="table-auto border-collapse w-full text-xs ">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">CODE</th>
                        <th className="p-2 border">PRODUCT CODE</th>
                        <th className="p-2 border">CATEGORY</th>
                        <th className="p-2 border">NAME</th>
                        <th className="p-2 border">AMOUNT</th>
                        <th className="p-2 border">PRICE</th>
                        <th className="p-2 border">PICKUP DATE</th>
                        <th className="p-2 border">PICKUP TIME</th>
                        <th className="p-2 border">CONTACT</th>
                        <th className="p-2 border">DELIVERY STATUS</th>
                        <th className="p-2 border">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.code}>
                          <td className="p-2 border">{order.code}</td>
                          <td className="p-2 border">{order.product_code}</td>
                          <td className="p-2 border">{order.category}</td>
                          <td className="p-2 border">{order.name}</td>
                          <td className="p-2 border">
                            {editRow === order.code ? (
                              <input
                                type="number"
                                value={updatedOrder?.amount || ""}
                                onChange={(e) => handleChange(e, "amount")}
                                className="border px-2 py-1 text-xs"
                              />
                            ) : (
                              order.amount
                            )}
                          </td>
                          <td className="p-2 border">
                            {editRow === order.code ? (
                              <input
                                type="number"
                                value={updatedOrder?.total_price || ""}
                                onChange={(e) => handleChange(e, "total_price")}
                                className="border px-2 py-1 text-xs"
                              />
                            ) : (
                              order.total_price
                            )}
                          </td>
                          <td className="p-2 border">
                            {editRow === order.code ? (
                              <input
                                type="text"
                                value={updatedOrder?.pickup_date || ""}
                                onChange={(e) => handleChange(e, "pickup_date")}
                                className="border px-2 py-1 text-xs"
                              />
                            ) : (
                              order.pickup_date
                            )}
                          </td>
                          <td className="p-2 border">
                            {editRow === order.code ? (
                              <input
                                type="text"
                                value={updatedOrder?.pickup_time || ""}
                                onChange={(e) => handleChange(e, "pickup_time")}
                                className="border px-2 py-1 text-xs"
                              />
                            ) : (
                              order.pickup_time
                            )}
                          </td>
                          <td className="p-2 border">
                            {editRow === order.code ? (
                              <input
                                type="text"
                                value={updatedOrder?.contact || ""}
                                onChange={(e) => handleChange(e, "contact")}
                                className="border px-2 py-1 text-xs"
                              />
                            ) : (
                              order.contact
                            )}
                          </td>
                          <td className="p-2 border">
                            {editRow === order.code ? (
                              <select
                                value={updatedOrder?.delivery_state}
                                onChange={(e) => handleChange(e, "delivery_state")}
                                className="border px-2 py-1 text-xs"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Delivered">Completed</option>
                                <option value="In Progress">Processing</option>
                              </select>
                            ) : (
                              order.delivery_state
                            )}
                          </td>
                          <td className="p-2 border">
                            {editRow === order.code ? (
                              <button
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                                onClick={handleSave}
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditClick(order)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Pencil size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;