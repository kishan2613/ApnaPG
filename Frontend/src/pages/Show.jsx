import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Show() {
  const { id } = useParams();
  const [showListing, setShowListing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/listing/${id}`);
        setShowListing(res.data);
      } catch (err) {
        console.error("Error fetching listing:", err);
      }
    };
    fetchListing();
  }, [id]);

  const handleDelete = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
  if (!confirmDelete) return;

  try {
    const res = await axios.delete(`http://localhost:8080/listing/${id}`, {
      withCredentials: true, // 👈 important if using session/cookies
    });

    if (res.data.success) {
      alert(res.data.message || "Listing deleted successfully.");
      navigate("/");
    } else {
      alert(res.data.message || "Failed to delete listing.");
    }
  } catch (err) {
    console.error("Error deleting listing:", err);
    alert("Failed to delete listing. Check console for details.");
  }
};

  if (!showListing) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  const listing = showListing.listing;

  return (
    <div className="max-w-2xl mx-auto p-3 mt-10 bg-white rounded-xl shadow-md">
      {listing.image?.url && (
        <img
          src={listing.image.url}
          alt={listing.title || "Listing Image"}
          className="w-full h-80 object-cover rounded-lg mb-6"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Available";
          }}
        />
      )}

      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
        <p className="text-gray-600 text-sm">Owned by <span className="font-medium">{listing.owner.username}</span></p>
      </div>

      <div className="mb-4">
        <p className="text-gray-700"><strong>Country:</strong> {listing.country}</p>
        <p className="text-gray-700"><strong>Price:</strong> ₹ {listing.price}/month</p>
      </div>

      <div className="flex gap-4 mt-6">
        <Link to={`/listing/${listing._id}/edit`}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Edit
          </button>
        </Link>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
