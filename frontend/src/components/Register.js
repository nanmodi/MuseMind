import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [isRegistering, setIsRegistering] = useState(true); // Toggle between Login and Sign Up
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [responseMessage, setResponseMessage] = useState("");
 const nav=useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((isRegistering && user.name && user.email && user.password) || (!isRegistering && user.email && user.password)) {
      try {
        const endpoint = isRegistering ? '/register' : '/login';
        const response = await axios.post(endpoint, user,{withCredentials:true});
        if(response.status===200 || response.status===201)
        {
          setResponseMessage(response.data.message);
           console.log('login ')
           nav('/chat')
        }
        
      } catch (error) {
        setResponseMessage("Error occurred during submission.");
      }
    } else {
      setResponseMessage("All fields are required.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          {isRegistering ? "Sign Up" : "Log In"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-6">
          {isRegistering && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Username</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your username"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {isRegistering ? "Sign Up" : "Log In"}
          </button>
        </form>
        {responseMessage && <p className="mt-4 text-center text-red-500">{responseMessage}</p>}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-500 hover:underline"
            >
              {isRegistering ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
