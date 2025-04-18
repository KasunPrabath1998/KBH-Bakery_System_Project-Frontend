import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductsService, updateProductsService } from "../../../services/productService"; 
import { storage } from '../../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

interface Item {
  id: string;
  name: string;
  unit_price: number;
  discount: number;
  category: string;
  code: string;
  image: string | null;
  weight_state: boolean; 
  inventory_retain_state: boolean; 
}

const EditProducts: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageMessage, setImageMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedItems = await getProductsService();
        const fetchedItem = fetchedItems.find((item: any) => item.id === id);

        if (fetchedItem) {
          setItem({
            id: fetchedItem.id,
            code: fetchedItem.code,
            name: fetchedItem.name,
            unit_price: fetchedItem.unit_price,
            discount: fetchedItem.unit_price > 100 ? 10 : 0,
            category: fetchedItem.category,
            image: fetchedItem.img_url || null,
            weight_state: fetchedItem.weight_state, 
            inventory_retain_state: fetchedItem.inventory_retain_state, 
          });

          if (!fetchedItem.img_url) {
            setImageMessage('No image uploaded for this product.');
          } else {
            setImageMessage(null);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItem((prev) => {
      if (!prev) return null;

      let parsedValue: string | number = value;
      if (name === "unit_price" || name === "discount") {
        parsedValue = Number(value);
      }

      return { ...prev, [name]: parsedValue };
    });
  };

  const handleDiscountToggle = () => {
    setItem((prev) => (prev ? { ...prev, discount: prev.discount ? 0 : 10 } : null));
  };

  const handleBack = () => {
    navigate('/home', { state: { tab: 'products' } });
  };

  const handleImageRemove = () => {
    setItem((prev) => (prev ? { ...prev, image: null } : null));
    setImageMessage('No image uploaded for this product.');
  };

  const handleUpdate = async () => {
    if (item) {
      try {
        console.log('Updating product with data:', item);
  
        // Prepare the updated product data
        const updatedProduct = {
          unit_price: item.unit_price,
          name: item.name,
          category: item.category,
          img_url: item.image || "", 
          weight_state: item.weight_state,
          inventory_retain_state: item.inventory_retain_state,
          code: item.code,
        };
        console.log(updatedProduct)
        // Call the update service with the formatted product object
        const response = await updateProductsService(item.id, updatedProduct);

        if (response) {
          console.log('Product updated successfully:', response);
          setSuccessMessage('Product updated successfully!');
          setErrorMessage(null);
          window.scrollTo(0, 0);  
        } else {
          throw new Error('Product update failed: No response from server');
        }
      } catch (error) {
        setSuccessMessage(null);
        setErrorMessage('Error updating product. Please try again.');
        console.error('Error updating product:', error);
        window.scrollTo(0, 0);  
      }
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `product-images/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error('Upload error:', error);
        setErrorMessage('Image upload failed');
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setItem((prev) => (prev ? { ...prev, image: downloadURL } : null));
        setImageMessage(null);
        console.log('Image uploaded:', downloadURL);
      }
    );
  };

  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin border-t-4 border-orange-500 border-solid rounded-full w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <button className="text-lg" onClick={handleBack}>
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <div></div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">
            {successMessage}
          </div>
        )}

        {/* Product Code */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-lg font-medium text-gray-700">Product Code</label>
          <div className="flex-1 p-2 text-gray-600">{item.code}</div>
        </div>

        {/* Category */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-lg font-medium text-gray-700">Category</label>
          <div className="flex-1 p-2 text-gray-600">{item.category}</div>
        </div>

        {/* Name */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-lg font-medium text-gray-700">Food Item</label>
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* Price */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-lg font-medium text-gray-700">Price (Rs.)</label>
          <input
            type="number"
            name="unit_price"
            value={item.unit_price}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* Discount */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-lg font-medium text-gray-700">Discount</label>
          <div className="flex space-x-2 items-center w-full">
            <select
              name="discountType"
              defaultValue="Percentage (%)"
              className="border p-2 w-2/5"
            >
              <option>Percentage (%)</option>
            </select>
            <input
              type="number"
              name="discount"
              value={item.discount}
              onChange={handleChange}
              className="border p-2 w-1/5"
            />
            <button
              className={`text-[#941111] border-2 p-2 rounded bg-[#CBC2C2]`}
              onClick={handleDiscountToggle}
            >
              {item.discount ? 'Disable Discount' : 'Enable Discount'}
            </button>
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex items-center space-x-4 mb-4">
          <label className="w-1/4 text-lg font-medium text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 w-full"
          />
        </div>

        {/* Image Preview */}
        {item.image && (
          <div className="flex justify-center">
            <img src={item.image} alt="Product Preview" className="h-40 object-contain" />
          </div>
        )}

        {/* Image Message */}
        {imageMessage && (
          <div className="bg-yellow-100 text-yellow-700 p-4 mb-4 rounded">
            {imageMessage}
          </div>
        )}

        {/* Remove Image */}
        <div className="mt-2 flex justify-center items-center space-x-2">
          <button
            className="text-red-500 mt-0 flex items-center space-x-1 border p-2 rounded border-red-500"
            onClick={handleImageRemove}
          >
            <FaTrash className="text-red-500" />
            <span>Remove from the Web</span>
          </button>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 justify-center mt-4">
          <button className="border-2 border-red-500 text-red-500 px-4 py-1 rounded-full" onClick={handleBack}>
            DISCARD
          </button>
          <button className="bg-[#C35C00] text-white px-4 py-1 rounded-full" onClick={handleUpdate}>
            UPDATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProducts;
