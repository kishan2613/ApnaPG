import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const text = await res.text(); // get raw text
    console.log("Raw Response:", text);

    let result;
    try {
      result = JSON.parse(text); // try to parse
    } catch (err) {
      toast.error("Server did not return valid JSON");
      return;
    }

    if (result.success) {
      toast.success("✅ " + result.message, { duration: 3000 });
      localStorage.setItem("user", JSON.stringify(result.user));
      setTimeout(() => navigate("/"), 1500);
    } else {
      toast.error("❌ " + (result.message || "Wrong username or password"), {
        duration: 3000,
      });
    }
  } catch (err) {
    console.error("Error:", err);
    toast.error("⚠️ Something went wrong, try again later.", { duration: 3000 });
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {/* Toast container */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login on ApnaPG
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Enter username"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Enter password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg shadow-md hover:bg-green-600 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
