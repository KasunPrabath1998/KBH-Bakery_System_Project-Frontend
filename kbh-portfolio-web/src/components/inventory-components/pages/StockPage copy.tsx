import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

const initialItems = [
  { id: '7676', name: 'Grapes Muffin', type: 'Cakes', price: 150, quantity: 3, isEditing: false },
  { id: '7677', name: 'Chocolate Cake', type: 'Cakes', price: 200, quantity: 2, isEditing: false },
  { id: '7678', name: 'Blueberry Tart', type: 'Pastry', price: 200, quantity: 4, isEditing: false },
  { id: '7679', name: 'Vanilla Cupcake', type: 'Cakes', price: 120, quantity: 2, isEditing: false },
  { id: '7680', name: 'Strawberry Shortcake', type: 'Cakes', price: 250, quantity: 1, isEditing: false },
  { id: '7681', name: 'Apple Pie', type: 'Pastry', price: 180, quantity: 3, isEditing: false },
  { id: '7682', name: 'Chocolate Croissant', type: 'Pastry', price: 220, quantity: 2, isEditing: false },
  { id: '7683', name: 'Cinnamon Roll', type: 'Buns', price: 160, quantity: 4, isEditing: false },
  { id: '7684', name: 'Garlic Bread', type: 'Bread', price: 100, quantity: 6, isEditing: false },
  { id: '7685', name: 'Donut', type: 'Doughnuts', price: 90, quantity: 8, isEditing: false },
  { id: '7686', name: 'Glazed Doughnut', type: 'Doughnuts', price: 110, quantity: 5, isEditing: false },
  { id: '7687', name: 'Rice and Curry', type: 'Rice & Curry', price: 300, quantity: 2, isEditing: false },
  { id: '7688', name: 'Fried Rice', type: 'Rice & Curry', price: 250, quantity: 4, isEditing: false },
  { id: '7689', name: 'Pasta Primavera', type: 'Rice & Curry', price: 280, quantity: 3, isEditing: false },
  { id: '7690', name: 'Cheese Bread', type: 'Bread', price: 120, quantity: 7, isEditing: false },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('CAKES');
  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [suggestions, setSuggestions] = useState<string[]>([]);

  
  const handleEditClick = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isEditing: true } : item
      )
    );
  };
  
  const handleCompleteClick = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isEditing: false } : item
      )
    );
  };

  const handleCountChange = (id: string, action: 'increment' | 'decrement') => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: action === 'increment' ? item.quantity + 1 : Math.max(0, item.quantity - 1) }
          : item
      )
    );
  };
  
  const filteredItems = items.filter(item => {
    const matchesSearchTerm =
      searchTerm.trim() === "" || 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesCategory =
      activeTab === "" || item.type.toLowerCase() === activeTab.toLowerCase();
  
    return matchesSearchTerm && matchesCategory;
  });
  

  const allKeywords = [
    ...new Set([
      ...items.map(item => item.name.toLowerCase()),
      ...items.map(item => item.type.toLowerCase()),
    ]),
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === '') {
      setSuggestions([]);
    } else {
      const filteredSuggestions = allKeywords.filter(keyword =>
        keyword.includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  };

  return (
    <div className="font-sans bg-white p-5 mt-2">
      <div className="font-sans bg-white p-5 flex justify-center items-center">
        <div className="flex space-x-4 mb-6 p-2 bg-[#FFDBBB] rounded-lg">
          {['CAKES', 'PASTRY', 'BUNS', 'DOUGHNUTS', 'BREAD', 'RICE & CURRY'].map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold border-2 ${
                activeTab === tab ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-[#903E0B] border-[#903E0B]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <div className="relative w-1/4">
          <input
            type="text"
            placeholder="Search Item ID or Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 p-2 w-full pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setSearchTerm(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <table className="w-full mt-5 border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-center border-b-2 border-b-black">ITEM ID</th>
            <th className="p-2 text-center border-b-2 border-b-black">ITEM NAME</th>
            <th className="p-2 text-center border-b-2 border-b-black">CATEGORY</th>
            <th className="p-2 text-center border-b-2 border-b-black">IN STOCK</th>
            <th className="p-2 text-center border-b-2 border-b-black">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 text-center border-b-2 border-b-black">{item.id}</td>
                <td className="p-2 text-center border-b-2 border-b-black">{item.name}</td>
                <td className="p-2 text-center border-b-2 border-b-black">{item.type}</td>
                <td className="p-2 text-center border-b-2 border-b-black">
                {item.isEditing ? (
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() => handleCountChange(item.id, 'decrement')} 
                      className="bg-[#d1cac6] px-2 border rounded-full h-7 flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => handleCountChange(item.id, 'increment')} 
                      className="bg-[#d1cac6] px-2 border rounded-full h-7 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span>{item.quantity}</span>
                )}
              </td>
                <td className="p-2 text-center border-b-2 border-b-black">
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
              <td colSpan={5} className="p-2 text-center border-b-2 border-b-black">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;
