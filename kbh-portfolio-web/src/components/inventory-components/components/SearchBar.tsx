import React from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="pr-4 relative w-1/4">
      <input
        type="text"
        placeholder="Search Item Name or Code"
        value={searchTerm}
        onChange={onSearchChange}
        className="border border-gray-300 p-2 w-full pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <FiSearch
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        size={18}
      />
    </div>
  );
};

export default SearchBar;
