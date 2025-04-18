import React, { useState, useEffect } from 'react';
import { Package, Boxes, ShoppingCart, Globe, Calculator as CalculatorIcon } from 'lucide-react';
import { FaTimes } from 'react-icons/fa';
import Calculator from '../pages/Calculator';
import CryptoJS from 'crypto-js';
import { User, ShieldCheck, ShoppingBag, DollarSign } from "lucide-react";
import OwnerIcon from "../../../assets/UserRoles/owner.png";
import Supervisor from "../../../assets/UserRoles/supervisor.png";
import CashierIcon from "../../../assets/UserRoles/cashier.png";
import UserPlaceholder from "../../../assets/UserRoles/cashier.png";
import LogoutPopup from '../components/login-Components/LogoutPopup';

interface HeaderProps {
  title: string;
  subtitle: string;
  activeTab: 'selling' | 'transactions' | 'stock' | 'products' | 'orders' | 'website';
  setActiveTab: React.Dispatch<React.SetStateAction<'selling' | 'transactions' | 'stock' | 'products' | 'orders' | 'website'>>;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, activeTab, setActiveTab }) => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [decryptedRole, setDecryptedRole] = useState<string>('');

  const toggleCalculator = () => {
    setIsCalculatorOpen(!isCalculatorOpen);
  };

  useEffect(() => {
    const encryptedRole = localStorage.getItem('user_role');
    if (encryptedRole) {
      const decrypted = CryptoJS.AES.decrypt(encryptedRole, 'secret_key').toString(CryptoJS.enc.Utf8);
      setDecryptedRole(decrypted);
    }
  }, []);









  type RoleType = "owner" | "admin" | "cashier";

  const roleIcons: Record<RoleType, string> = {
    owner: OwnerIcon,
    admin: Supervisor,
    cashier: CashierIcon,
  };

  const roleKey = (decryptedRole?.toLowerCase() as RoleType) || undefined;












  return (
    <header className="flex flex-col ">
      <div className="flex flex-col md:flex-row items-center gap-3 px-3 py-3 bg-orange-300 bg-opacity-30     md:flex-wrap md:gap-4">
        <div className="text-center md:text-left m-0 pr-6">
          <div className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#ff6600] m-0 p-0">{title}</div>
          <div className="ml-1.5 text-xs md:text-[8.5px] lg:text-[11.5px] text-[#666] m-0 p-0">{subtitle}</div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-8 justify-center md:justify-start items-center">
          {/* Stock Icon - Disabled if not owner */}
          <a
            onClick={() => decryptedRole === 'owner' && setActiveTab('stock')}
            className={`flex flex-col items-center space-y-2 ${decryptedRole !== 'owner' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Package className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 ${decryptedRole === 'owner' ? (activeTab === 'stock' ? 'text-orange-500' : 'text-[#BA630C]') : 'text-gray-400'}`} />
            <span className="text-xs md:text-sm lg:text-lg text-gray-700 font-medium">Stock</span>
          </a>

          {/* Products Icon - Disabled if not owner */}
          <a
            onClick={() => decryptedRole === 'owner' && setActiveTab('products')}
            className={`flex flex-col items-center space-y-2 ${decryptedRole !== 'owner' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Boxes className={`w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 ${decryptedRole === 'owner' ? (activeTab === 'products' ? 'text-orange-500' : 'text-[#BA630C]') : 'text-gray-400'}`} />
            <span className="text-xs md:text-sm lg:text-lg text-gray-700 font-medium">Products</span>
          </a>

          {/* Orders Icon - Always Active */}
          <a onClick={() => setActiveTab('orders')} className="flex flex-col items-center space-y-2 cursor-pointer">
            <ShoppingCart className={`w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 ${activeTab === 'orders' ? 'text-orange-500' : 'text-[#BA630C]'}`} />
            <span className="text-xs md:text-sm lg:text-lg text-gray-700 font-medium">Orders</span>
          </a>

          {/* Website Icon - Always Active */}
          <a onClick={() => setActiveTab('website')} className="flex flex-col items-center space-y-2 cursor-pointer">
            <Globe className={`w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 ${activeTab === 'website' ? 'text-orange-500' : 'text-[#BA630C]'}`} />
            <span className="text-xs md:text-sm lg:text-lg text-gray-700 font-medium">Website</span>
          </a>
        </div>


        <div className="w-full md:w-auto mt-6 md:mt-0 flex items-center justify-center md:justify-end gap-3 ml-auto">
          {!decryptedRole ? (
            <img src={UserPlaceholder} alt="Loading" className="w-8 h-8 animate-pulse opacity-60" />
          ) : (
            <>
              <img
                src={roleKey && roleIcons[roleKey] ? roleIcons[roleKey] : UserPlaceholder}
                alt={decryptedRole}
                onClick={() => setShowLogoutPopup(true)}
                className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
              />
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold capitalize text-orange-500">
                {decryptedRole}
              </div>
              {showLogoutPopup && (<div> <LogoutPopup /></div>)}
            </>
          )}
        </div>

      </div>

      {/* This part will be hidden when 'website' tab is active */}
      {activeTab !== 'website' && (
        <div className="mt-2 flex items-center gap-4 justify-end flex-wrap sm:flex-nowrap p-4">
          <button
            onClick={() => setActiveTab('selling')}
            className={`border border-black px-4 py-1 rounded ${activeTab === 'selling' ? 'bg-orange-500 text-white' : 'bg-white'}`}
          >
            SELLING
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`border border-black px-4 py-1 rounded ${activeTab === 'transactions' ? 'bg-orange-500 text-white' : 'bg-white'}`}
          >
            TRANSACTIONS
          </button>

          {/* Calculator Button */}
          <div className="flex items-center gap-4">
            <CalculatorIcon
              color="#4240c4"
              strokeWidth={1.25}
              className="w-10 h-10 cursor-pointer"
              onClick={toggleCalculator}
            />
          </div>
        </div>
      )}

      {/* Calculator Modal */}
      {isCalculatorOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]"
          onClick={toggleCalculator} // click on backdrop will close
        >
          <div
            className=" p-[5vw] sm:p-[4vw] md:p-[3vw] lg:p-6 rounded-lg  relative"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <div className="border h-[50vh] sm:h-[60vh] md:h-[60vh] lg:h-[70vh]">
              <Calculator />
            </div>
            <button
              onClick={toggleCalculator}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
