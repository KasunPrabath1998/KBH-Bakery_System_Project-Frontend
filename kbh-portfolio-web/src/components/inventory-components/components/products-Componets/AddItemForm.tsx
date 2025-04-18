import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { postProductsService,getCategoriesService } from "../../../../services/productService";
import { storage } from '../../../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

interface FormData {
  name: string;
  price: string;
  type: string;
  customType?: string;
  weight_state: boolean;
  inventory_retain_state: boolean;
  order_state: boolean;
  image: File | null;  
}

interface AddItemFormProps {
  isFormOpen: boolean;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
}

const AddItemForm: React.FC<AddItemFormProps> = ({
  isFormOpen,
  setIsFormOpen,
  setProducts,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    type: '',
    customType: '',
    weight_state: false,
    inventory_retain_state: false,
    order_state: false,
    image: null,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (isFormOpen) {
      setFormData({
        name: '',
        price: '',
        type: '', 
        customType: '',
        weight_state: false,
        inventory_retain_state: false,
        order_state: false,
        image: null,
      });
  
      (async () => {
        try {
          const data = await getCategoriesService();
          console.log("Fetched categories:", data);
  
          if (Array.isArray(data?.data?.categories)) {
            setCategories(data.data.categories);
          } else {
            console.error("Unexpected categories format:", data);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      })();
    }
  
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [isFormOpen]);
  
  
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const selectedCategory = formData.type === "Other"
      ? (formData.customType ? formData.customType.toUpperCase() : '')
      : formData.type;

    let imgUrl = "";

    try {
      if (formData.image) {
        const file = formData.image;
        const storageRef = ref(storage, `product-images/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => reject(error),
            async () => {
              imgUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      const productData = {
        product: {
          unit_price: Number(formData.price),
          name: formData.name,
          category: selectedCategory,
          weight_state: formData.weight_state,
          inventory_retain_state: formData.inventory_retain_state,
          order_state: formData.order_state,
          img_url: imgUrl,
        },
      };

      const response = await postProductsService(productData);

      if (response.state === false) {
        setErrorMessage(response.data.message || "An error occurred.");
      } else {
        setSuccessMessage("Product added successfully!");
        setFormData({
          name: '',
          price: '',
          type: 'Short Eats',
          customType: '',
          weight_state: false,
          inventory_retain_state: false,
          order_state: false,
          image: null,
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setErrorMessage("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }

  };

  return isFormOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <div className="flex justify-end mb-4">
          <FiX size={24} className="cursor-pointer" onClick={() => setIsFormOpen(false)} />
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {errorMessage && <div className="text-red-600 bg-red-100 p-2 rounded-lg text-sm">{errorMessage}</div>}
          {successMessage && <div className="text-green-600 bg-green-100 p-2 rounded-lg text-sm">{successMessage}</div>}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Item Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              className="border p-2 w-full rounded-lg" 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Unit Price</label>
            <input 
              type="number" 
              value={formData.price} 
              onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
              className="border p-2 w-full rounded-lg" 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Category</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="border p-2 w-full rounded-lg"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>

          </div>

          {formData.type === "Other" && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">Custom Category</label>
              <input 
                type="text" 
                value={formData.customType} 
                onChange={(e) => setFormData({ ...formData, customType: e.target.value })} 
                className="border p-2 w-full rounded-lg" 
                required 
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Image</label>
            <input 
              type="file" 
              onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })} 
              className="border p-2 w-full rounded-lg" 
              accept="image/*"
            />
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.weight_state}
                onChange={(e) => setFormData({ ...formData, weight_state: e.target.checked })}
                className="mr-2"
              />
              Weight State
            </label>
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.inventory_retain_state}
                onChange={(e) => setFormData({ ...formData, inventory_retain_state: e.target.checked })}
                className="mr-2"
              />
              Inventory Retain State
            </label>
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.order_state}
                onChange={(e) => setFormData({ ...formData, order_state: e.target.checked })}
                className="mr-2"
              />
              Order State
            </label>
          </div>

          <button 
            type="submit" 
            className="bg-orange-600 text-white p-2 w-full rounded-lg disabled:bg-gray-400" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </div>
    </div>
  ) : null;
};

export default AddItemForm;
