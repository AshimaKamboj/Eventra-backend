// src/pages/Profile.js
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  if (!user) {
    return (
      <div className="page-container">
        <h1>Please log in to view your profile</h1>
        <p>You’ll be redirected shortly...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Welcome, {user.name || "User"} 🎉</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role || "Member"}</p>

      <div style={{ marginTop: "2rem" }}>
        <button
          className="profile-btn"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login"; // logout
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
