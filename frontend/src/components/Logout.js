import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.get('/logout')
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Logout</h2>
        <p className="mt-4 text-center text-gray-600">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
          >
            Logout
          </button>
          <button
            onClick={() => navigate(-1)} 
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
