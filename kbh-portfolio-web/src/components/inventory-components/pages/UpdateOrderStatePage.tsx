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
  order_state: boolean;
  inventory_retain_state:boolean;
  weight_state:boolean;
}

const EditProducts: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedItems = await getProductsService();
        console.log(fetchedItems)
        const fetchedItem = fetchedItems.find((product: any) => product.id === id);

        if (fetchedItem) {
          setItem({
            id: fetchedItem.id,
            code: fetchedItem.code,
            name: fetchedItem.name,
            unit_price: fetchedItem.unit_price,
            discount: fetchedItem.unit_price > 100 ? 10 : 0,
            category: fetchedItem.category,
            image: fetchedItem.img_url && fetchedItem.img_url.trim() !== "" ? fetchedItem.img_url : null,
            order_state: fetchedItem.order_state ?? false,
            weight_state:fetchedItem.weight_state ?? false,
            inventory_retain_state:fetchedItem.inventory_retain_state ?? false
          });
        } else {
          console.log('Item not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBack = () => {
    navigate('/home', { state: { tab: 'products' } });
  };

  const handleImageRemove = () => {
    setItem((prev) => (prev ? { ...prev, image: null } : null));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setItem((prev) => (prev ? { ...prev, image: reader.result as string } : null));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!item) return;

    if (!imageFile && (!item.image || item.image.trim() === "")) {
      setErrorMessage("Please upload an image.");
      setSuccessMessage(null);
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setUploading(true);

    let imageUrl = item.image;

    // If new image file is selected, upload to Firebase
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      try {
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      } catch (error) {
        setUploading(false);
        setErrorMessage("Image upload failed. Please try again.");
        return;
      }
    }

    // Now update the product
    try {
      const payload = {
        name: item.name,
        unit_price: item.unit_price,
        discount: item.discount,
        category: item.category,
        img_url: imageUrl,
        code: item.code,
        order_state: item.order_state,
        inventory_retain_state:item.inventory_retain_state,
        weight_state:item.weight_state
      };
      console.log(item)
      const updatedProduct = await updateProductsService(item.id, payload);
      console.log('Item updated:', updatedProduct);
      setSuccessMessage("Product updated successfully!");
    } catch (error) {
      console.error('Update error:', error);
      setErrorMessage("Error updating product. Please try again.");
    } finally {
      setUploading(false);
    }
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
        <h1 className="text-2xl font-bold">Update State</h1>
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

        {/* Image Upload */}
        <div className="flex items-center space-x-4 mb-2">
          <label className="w-1/4 text-lg font-medium text-gray-700">Image</label>
          <div className="flex space-x-2 items-center w-full">
            <input
              type="file"
              className="border p-2 w-full"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Image Preview */}
        {item.image ? (
          <>
            <div className="flex justify-center">
              <img
                src={item.image}
                alt="Preview"
                className="h-40 object-contain border rounded"
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-1 break-all">
            </p>
          </>
        ) : (
          <p className="text-red-500 text-center">Please upload an image.</p>
        )}

        {/* Remove Image Button */}
        <div className="mt-2 flex justify-center items-center space-x-2">
          <button
            className="text-red-500 mt-0 flex items-center space-x-1 border p-2 rounded border-red-500"
            onClick={handleImageRemove}
          >
            <FaTrash className="text-red-500" />
            <span>Remove image</span>
          </button>
        </div>

        {/* Order State Toggle */}
        <div className="flex items-center justify-center space-x-4 mt-4">
          <label className="text-lg font-medium">Order State:</label>
          <input
            type="checkbox"
            checked={item.order_state}
            onChange={() =>
              setItem((prev) =>
                prev ? { ...prev, order_state: !prev.order_state } : prev
              )
            }
            className="w-5 h-5"
          />
          <span className="text-gray-600">{item.order_state ? "Active" : "Inactive"}</span>
        </div>

        {/* Uploading Spinner */}
        {uploading && (
          <div className="text-center text-orange-500 mt-2 animate-pulse">
            Uploading image...
          </div>
        )}

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
