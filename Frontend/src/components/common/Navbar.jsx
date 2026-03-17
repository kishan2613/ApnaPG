import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const Navbar = ({ currUser, setCurrUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setCurrUser(null); // clear user in state
        navigate("/login"); // redirect to login
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Brand */}
        <Link to="/" className="text-lg font-bold flex items-center gap-2">
          <FaHome className="text-red-500" /> ApnaPG
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className="fa-solid fa-bars text-xl"></i>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex flex-grow space-x-6 ml-6">
          <Link to="/" className="text-gray-700 hover:text-red-500">Home</Link>
          <Link to="/new" className="text-gray-700 hover:text-red-500">Add Listing</Link>
        </div>

        {/* Auth links (Desktop) */}
        <div className="hidden md:flex space-x-4">
          {currUser ? (
            <button 
              onClick={handleLogout} 
              className="text-gray-700 hover:text-red-500"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/signup" className="text-gray-700 hover:text-red-500">Signup</Link>
              <Link to="/login" className="text-gray-700 hover:text-red-500">Login</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-3 space-y-2 bg-gray-50 border-t">
          <Link to="/" className="block text-gray-700 hover:text-red-500">Home</Link>
          <Link to="/new" className="block text-gray-700 hover:text-red-500">Add Listing</Link>

          <div className="border-t pt-2">
            {currUser ? (
              <button 
                onClick={handleLogout} 
                className="block text-gray-700 hover:text-red-500 w-full text-left"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/signup" className="block text-gray-700 hover:text-red-500">Signup</Link>
                <Link to="/login" className="block text-gray-700 hover:text-red-500">Login</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
