import React, { useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import CryptoJS from "crypto-js";
import Report from "./ReportFormComponent";

interface Product {
  code: string;
  name: string;
  category: string;
  unit_price: number;
  order_state: boolean;
  id: string;
  inventory_retain_state: boolean;
  weight_state: boolean;
}

interface ItemListProps {
  products: Product[];
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleImage: (id: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({
  products,
  handleEdit,
  handleDelete,
  handleImage,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalType, setModalType] = useState<"send" | "order" | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const encryptedRole = localStorage.getItem("user_role");
  let decryptedRole = "";
  if (encryptedRole) {
    try {
      decryptedRole = CryptoJS.AES.decrypt(encryptedRole, "secret_key").toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Error decrypting role:", error);
    }
  }

  const isOwner = decryptedRole === "owner";

  const handleSendReport = (product: Product) => {
    setSelectedProduct(product);
    setModalType("send");
  };

  const handleOrderReport = (product: Product) => {
    setSelectedProduct(product);
    setModalType("order");
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      handleDelete(selectedProduct.id);
      setSelectedProduct(null);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalType(null);
    setResponse(null);
  };

  return (
    <div className="p-5 overflow-x-auto w-full">
      <table className="min-w-[800px] w-full text-[10px] sm:text-sm mt-5 border-collapse">
  <thead>
    <tr>
      <th className="p-2 text-center border-b-2 border-black sm:p-2">ITEM CODE</th>
      <th className="p-2 text-center border-b-2 border-black sm:p-2">ITEM NAME</th>
      <th className="p-2 text-center border-b-2 border-black sm:p-2">CATEGORY</th>
      <th className="p-2 text-center border-b-2 border-black sm:p-2">UNIT PRICE</th>
      <th className="p-2 text-center border-b-2 border-black max-w-[50px] text-[12px] sm:p-2"> ON WEB</th>
      <th className="p-2 text-center border-b-2 border-black max-w-[50px] text-[12px] sm:p-2">WEIGHT</th>
      <th className="p-2 text-center border-b-2 border-black max-w-[50px] text-[12px] sm:p-2">STOCK RETAINED</th>
      <th className="p-2 text-center border-b-2 border-black sm:p-2">REPORTS</th> 
      {isOwner && <th className="p-2 text-center border-b-2 border-black sm:p-2">ACTION</th>}
    </tr>
  </thead>
  <tbody>
    {products.length > 0 ? (
      products.map((item) => (
        <tr key={item.id} className="border-b">
          <td className="p-2 text-center border-b-2 border-b-black sm:p-2">{item.code}</td>
          <td className="p-2 text-center border-b-2 border-b-black sm:p-2">{item.name}</td>
          <td className="p-2 text-center border-b-2 border-b-black sm:p-2">{item.category}</td>
          <td className="p-2 text-center border-b-2 border-b-black sm:p-2">Rs.{item.unit_price.toFixed(2)}</td>
          <td className="p-2 text-center border-b-2 border-b-black sm:p-2">
            {item.order_state ? <span className="text-green-500">✔</span> : <span className="text-red-500 text-[12px]">❌</span>}
          </td>
          <td className="p-2 text-center border-b-2 border-b-black sm:p-2">
            {item.weight_state ? <span className="text-green-500">✔</span> : <span className="text-red-500 text-[12px]">❌</span>}
          </td>
          <td className="p-2 text-center border-b-2 border-b-black sm:p-2">
            {item.inventory_retain_state ? <span className="text-green-500">✔</span> : <span className="text-red-500 text-[12px]">❌</span>}
          </td>
          <td className="p-2 text-center border-b-2 border-b-black sm:p-2"> 
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <button
                className="text-orange-700 border border-orange-600 bg-white px-3 py-1 rounded hover:text-black"
                onClick={() => handleOrderReport(item)}
              >
                Order Report
              </button>
              <button
                className="text-orange-700 border border-orange-600 bg-white px-3 py-1 rounded hover:text-black"
                onClick={() => handleSendReport(item)}
              >
                Send Report
              </button>
            </div>
          </td>
          {isOwner && (
            <td className="p-2 text-center border-b-2 border-b-black sm:p-2">
              <div className="flex items-center justify-center gap-5 flex-nowrap">
                <button
                  className="text-orange-500  bg-white px-3 py-1 rounded hover:underline hover:text-green"
                  onClick={() => handleImage(item.id)}
                >
                  Add to Web
                </button>
                <FaPen className=" text-center text-orange-500 cursor-pointer sm:mx-auto" onClick={() => handleEdit(item.id)} />
                {!item.order_state && (
                  <FaTrash className=" text-center text-red-500 cursor-not-allowed sm:mx-auto " />
                )}
              </div>
            </td>
          )}
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={isOwner ? 9 : 8} className="p-2 text-center border-b-2 border-b-black sm:p-2">
          No items found
        </td>
      </tr>
    )}
  </tbody>
</table>


      {/* Use the Report Component */}
      {modalType && selectedProduct && (
        <Report
          selectedProduct={selectedProduct}
          modalType={modalType}
          setModalType={setModalType}
          setSelectedProduct={setSelectedProduct}
          setResponse={setResponse}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default ItemList;
