import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const WebSite: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null); 
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDiscountBanner, setShowDiscountBanner] = useState<boolean>(false); 
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();
 


  const handleDiscountBannerClick = () => {  
    setShowDiscountBanner(prevState => !prevState);
  };



  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="font-sans bg-white p-5">
      <div className="flex justify-center space-x-4 mb-4">
        <button onClick={() => navigate("/")} className="bg-white text-[#770404] border-2 border-[#770404] px-3 py-1 rounded-md hover:bg-orange-500 hover:text-white">View Website</button>
        <button className="bg-white text-[#770404] border-2 border-[#770404] px-3 py-1 rounded-md hover:bg-orange-500 hover:text-white">+ Featured Items</button>
        <button onClick={handleDiscountBannerClick} className="bg-white text-[#770404] border-2 border-[#770404] px-3 py-1 rounded-md hover:bg-orange-500 hover:text-white">+ Discount Banner</button>
      </div>

      {showDiscountBanner ? (
        <div className="bg-white p-5 rounded-lg shadow-md w-96 mx-auto mt-10 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 border border-gray-300 rounded-md flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
              ) : (
                <svg className="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 16V8a2 2 0 012-2h14a2 2 0 012 2v8M16 21v-4M8 21v-4M3 8l9 6 9-6" />
                </svg>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-2">Please upload a horizontal bg image image</p>
            
            <div className="mt-3 flex items-center space-x-2 border bg-gray-100 p-2 rounded-md">
              <input 
                type="file" 
                id="imageInput" 
                className="hidden" 
                accept="image/*" 
             
              />
              <label 
                htmlFor="imageInput" 
                className="px-4 py-2 border border-green-500 text-green-500 rounded-md cursor-pointer hover:bg-green-500 hover:text-white focus:outline-none"
              >
                Choose File
              </label>
              <div className="text-sm text-gray-600">
                {fileName ? `Chosen file: ${fileName}` : 'No chosen file'}
              </div>
            </div>

            <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md">Save</button>
          </div>
        </div>) :(<div></div>)  };
        </div>
            )}

export default WebSite;
