import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [currUser, setCurrUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
  const fetchListing = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/listing/${id}/edit`, {
        withCredentials: true,
      });

      setListing(res.data.listing);

      // Correct ownership check
      const ownerId = res.data.listing.owner?._id || res.data.listing.owner;
      setAuthorized(ownerId === currUser?.id);

    } catch (err) {
      console.error("Error fetching listing:", err);
      setAuthorized(false);
    }
  };
  fetchListing();
}, [id, currUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setListing((prev) => ({
      ...prev,
      imageFile: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const fields = ["title", "description", "price", "country", "location"];
    fields.forEach((key) => {
      formData.append(`listing[${key}]`, listing[key]);
    });

    if (listing.imageFile) {
      formData.append("listing[image]", listing.imageFile);
    }

   try {
  const res = await axios.put(`http://localhost:8080/listing/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  alert("Listing updated successfully!");
  navigate(`/listing/${id}`); // navigate to listing page

} catch (err) {
  console.error("❌ Update error:", err.response?.data || err.message);
  alert("Update failed.");
}
  };

  if (!listing) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  // Show "Not authorized" if user is not owner
  if (!authorized) {
    return (
      <div className="text-center mt-10 text-lg text-red-500">
        You are not authorized to edit this listing.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={listing.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={listing.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={listing.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={listing.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={listing.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Current Image Preview */}
        {listing.image?.url && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Image</label>
            <img
              src={listing.image.url}
              alt="Current"
              className="w-full h-52 object-cover rounded-md mb-3"
            />
          </div>
        )}

        {/* Upload New Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Update Listing
          </button>
        </div>
      </form>
    </div>
  );
}
