import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/listings")
      .then(res => {
        setListings(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  if (error) return (
    <div className="container mx-auto mt-10 px-4">
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold mb-6">Find Your Stay</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing, index) => (
          <Link
            to={`/listing/${listing._id}`}
            key={listing._id || index}
            className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden"
          >
            <img
              src={listing.image?.url || "https://via.placeholder.com/300x200?text=No+Image"}
              alt={listing.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x200?text=Image+Error";
              }}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{listing.title || "Untitled"}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {listing.location || "Unknown"}, {listing.state || ""}
              </p>
              <p className="text-base font-medium text-black mt-2">
                ₹ {listing.price || 0}/month
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
