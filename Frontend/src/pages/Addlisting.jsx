import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    price: "",
    country: "",
    location: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({
        ...formData,
        image: files && files.length > 0 ? files[0] : null,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append image if selected
    if (formData.image) {
      console.log("Appending image:", formData.image.name);
      data.append("listing[image]", formData.image);
    }

    // Append text fields as listing[field]
    Object.keys(formData).forEach((key) => {
      if (key !== "image" && formData[key]) {
        data.append(`listing[${key}]`, formData[key]);
      }
    });

    // Debug check what is being sent
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const res = await fetch("http://localhost:8080/listing", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await res.json();
      console.log("Response:", result);

      if (result.success) {
        alert("Listing added successfully!");
        navigate("/");
      } else {
        alert("Failed to add listing.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Add New Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Listing
        </button>
      </form>
    </div>
  );
};

export default AddListing;
