// client/src/pages/CreateVenue.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style.css";

function CreateVenue() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "India"
    },
    capacity: {
      min: "",
      max: ""
    },
    amenities: "",
    images: "",
    contactInfo: {
      phone: "",
      email: "",
      website: ""
    },
    pricing: {
      basePrice: "",
      currency: "INR"
    }
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const venueData = {
        ...formData,
        capacity: {
          min: parseInt(formData.capacity.min),
          max: parseInt(formData.capacity.max)
        },
        pricing: {
          ...formData.pricing,
          basePrice: parseFloat(formData.pricing.basePrice) || 0
        },
        amenities: formData.amenities.split(',').map(item => item.trim()).filter(item => item)
      };

      const response = await axios.post("/api/venues", venueData, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });

      alert("✅ Venue Created Successfully!");
      navigate("/venues");
    } catch (error) {
      console.error("Error creating venue:", error);
      alert("Error creating venue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-venue">
      <div className="form-container">
        <h1 className="form-title">Create New Venue</h1>
        <p className="form-subtitle">
          Add your venue to our platform and make it available for event organizers.
        </p>

        <form onSubmit={handleSubmit} className="venue-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2>📌 Basic Information</h2>
            <input
              type="text"
              name="name"
              placeholder="Venue Name *"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Venue Description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          {/* Location */}
          <div className="form-section">
            <h2>📍 Location Details</h2>
            <input
              type="text"
              name="location.address"
              placeholder="Address *"
              value={formData.location.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="location.city"
              placeholder="City *"
              value={formData.location.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="location.state"
              placeholder="State"
              value={formData.location.state}
              onChange={handleChange}
            />
            <select
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
            >
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
            </select>
          </div>

          {/* Capacity */}
          <div className="form-section">
            <h2>👥 Capacity</h2>
            <div className="capacity-inputs">
              <input
                type="number"
                name="capacity.min"
                placeholder="Minimum Capacity *"
                value={formData.capacity.min}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="capacity.max"
                placeholder="Maximum Capacity *"
                value={formData.capacity.max}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="form-section">
            <h2>🏆 Amenities</h2>
            <input
              type="text"
              name="amenities"
              placeholder="Amenities (comma separated) - e.g., Wi-Fi, Parking, Catering"
              value={formData.amenities}
              onChange={handleChange}
            />
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h2>📞 Contact Information</h2>
            <input
              type="tel"
              name="contactInfo.phone"
              placeholder="Phone Number"
              value={formData.contactInfo.phone}
              onChange={handleChange}
            />
            <input
              type="email"
              name="contactInfo.email"
              placeholder="Email Address"
              value={formData.contactInfo.email}
              onChange={handleChange}
            />
            <input
              type="url"
              name="contactInfo.website"
              placeholder="Website URL"
              value={formData.contactInfo.website}
              onChange={handleChange}
            />
          </div>

          {/* Pricing */}
          <div className="form-section">
            <h2>💰 Pricing</h2>
            <div className="pricing-inputs">
              <select
                name="pricing.currency"
                value={formData.pricing.currency}
                onChange={handleChange}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
              <input
                type="number"
                name="pricing.basePrice"
                placeholder="Base Price (per day)"
                value={formData.pricing.basePrice}
                onChange={handleChange}
                step="0.01"
              />
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <h2>📸 Images</h2>
            <input
              type="url"
              name="images"
              placeholder="Image URL (optional)"
              value={formData.images}
              onChange={handleChange}
            />
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate("/venues")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Venue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateVenue;

