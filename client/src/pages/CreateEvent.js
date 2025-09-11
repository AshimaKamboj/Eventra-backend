import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ use auth context
import "./../style.css";

function CreateEvent() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    image: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    capacity: "",
    venueName: "",
    address: "",
    city: "",
    currency: "USD",
    ticketPrice: "",
  });

  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth(); // ✅ get logged-in user & token

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? URL.createObjectURL(files[0]) : value,
    });
  };

  // Step Navigation
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // ✅ Submit event to backend
  const handlePublish = async () => {
    if (!auth.user || auth.user.role !== "organizer") {
      alert("❌ Only organizers can create events.");
      return;
    }

    try {
      const res = await axios.post(
        "/api/events",
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          tags: formData.tags.split(","),
          image: formData.image,
          date: formData.startDate,
          location: {
            venue: formData.venueName,
            address: formData.address,
            city: formData.city,
          },
          ticketPrice: formData.ticketPrice,
          tickets: [
            {
              type: "General",
              price: formData.ticketPrice,
              available: formData.capacity || 100,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`, // ✅ attach JWT
          },
        }
      );

      alert("✅ Event Created Successfully!");
      navigate(`/event/${res.data._id}`);
    } catch (err) {
      console.error("❌ Error creating event:", err.response?.data || err);
      alert("Error creating event. Check console.");
    }
  };

  return (
    <div className="create-event">
      <h1 className="form-title">Create Your Event</h1>
      <p className="form-subtitle">
        Bring your event to life. Fill in the details below to create an amazing experience.
      </p>

      {/* Tabs */}
      <div className="tabs">
        <button className={step === 1 ? "active" : ""} onClick={() => setStep(1)}>Basic Info</button>
        <button className={step === 2 ? "active" : ""} onClick={() => setStep(2)}>Event Details</button>
        <button className={step === 3 ? "active" : ""} onClick={() => setStep(3)}>Location</button>
        <button className={step === 4 ? "active" : ""} onClick={() => setStep(4)}>Pricing & Tickets</button>
      </div>

      {/* ... keep all your steps as before ... */}

      {/* Step 4: Pricing */}
      {step === 4 && (
        <div className="form-card">
          <h2>💰 Pricing & Tickets</h2>
          <select name="currency" value={formData.currency} onChange={handleChange}>
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
          </select>
          <input type="number" name="ticketPrice" placeholder="Ticket Price" value={formData.ticketPrice} onChange={handleChange} />
          <p>Platform Fee (2%): {formData.ticketPrice ? (formData.ticketPrice * 0.02).toFixed(2) : "0"}</p>
          <p>Total Price (incl. Fee): {formData.ticketPrice ? (formData.ticketPrice * 1.02).toFixed(2) : "0"}</p>
          <div className="buttons">
            <button className="btn-back" onClick={prevStep}>⬅ Back</button>
            <button className="btn-outline" onClick={() => setShowPreview(true)}>Preview Event</button>
            <button className="btn-outline">Save Draft</button>
            {/* ✅ Call publish function */}
            <button className="btn-primary" onClick={handlePublish}>Publish Event</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEvent;
