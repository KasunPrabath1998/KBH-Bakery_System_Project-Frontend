import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const LogoutPopup: React.FC = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [hideLogoutBtn, setHideLogoutBtn] = useState(false);

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('kbh_auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('loginStatus');
    // Redirect
    navigate('/login');
  };
  const cancelFunc = () => {
    setHideLogoutBtn(true);
    setShowPopup(false);
  }


  return (
    <>
     {!hideLogoutBtn &&<button
        onClick={() => setShowPopup(true)}
        className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-500"
      >
        Logout
      </button>}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-medium mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Logout
              </button>
              <button
                onClick={cancelFunc}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutPopup;
