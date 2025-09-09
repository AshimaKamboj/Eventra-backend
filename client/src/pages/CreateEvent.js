import React, { useState } from "react";
import "./../style.css";

function CreateEvent() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    image: null,
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

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Step Navigation
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

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

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="form-card">
          <h2>📌 Basic Information</h2>
          <input type="text" name="title" placeholder="Event Title *" value={formData.title} onChange={handleChange} />
          <textarea name="description" placeholder="Event Description *" value={formData.description} onChange={handleChange}></textarea>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="Music">Music</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Festival">Festival</option>
          </select>
          <input type="text" name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleChange} />
          <input type="file" name="image" onChange={handleChange} />
          <button className="btn-next" onClick={nextStep}>Next ➡</button>
        </div>
      )}

      {/* Step 2: Event Details */}
      {step === 2 && (
        <div className="form-card">
          <h2>📅 Event Schedule</h2>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
          <input type="number" name="capacity" placeholder="Expected Capacity" value={formData.capacity} onChange={handleChange} />
          <div className="buttons">
            <button className="btn-back" onClick={prevStep}>⬅ Back</button>
            <button className="btn-next" onClick={nextStep}>Next ➡</button>
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {step === 3 && (
        <div className="form-card">
          <h2>📍 Event Location</h2>
          <input type="text" name="venueName" placeholder="Venue Name" value={formData.venueName} onChange={handleChange} />
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
          <div className="buttons">
            <button className="btn-back" onClick={prevStep}>⬅ Back</button>
            <button className="btn-next" onClick={nextStep}>Next ➡</button>
          </div>
        </div>
      )}

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
            <button className="btn-primary">Publish Event</button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="preview-modal">
          <div className="preview-content">
            <h2>👀 Event Preview</h2>
            <h3>{formData.title || "Untitled Event"}</h3>
            <p>{formData.description || "No description provided."}</p>
            <p><strong>Category:</strong> {formData.category}</p>
            <p><strong>Tags:</strong> {formData.tags}</p>
            <p><strong>Schedule:</strong> {formData.startDate} {formData.startTime} - {formData.endDate} {formData.endTime}</p>
            <p><strong>Location:</strong> {formData.venueName}, {formData.address}, {formData.city}</p>
            <p><strong>Tickets:</strong> {formData.currency} {formData.ticketPrice}</p>
            <p><strong>Total (incl. fee):</strong> {formData.ticketPrice ? (formData.ticketPrice * 1.02).toFixed(2) : "0"} {formData.currency}</p>
            
            <div className="buttons">
              <button className="btn-back" onClick={() => setShowPreview(false)}>Close</button>
              <button className="btn-primary">Publish Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEvent;
