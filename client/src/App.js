// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import TrendingEvents from "./components/TrendingEvents";
import Features from "./components/Features";

// Pages
import Explore from "./pages/Explore";
import CreateEvent from "./pages/CreateEvent";
import CreateVenue from "./pages/CreateVenue";
import Venues from "./pages/Venues";
import Blog from "./pages/Blog";
import Support from "./pages/Support";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EventDetails from "./pages/EventDetails";
import VenueDetails from "./pages/VenueDetails";
import BlogPost from "./pages/BlogPost";
import Profile from "./pages/Profile";
import MyReviews from "./pages/MyReviews";

// Auth wrappers
import ProtectedRoute from "./components/ProtectedRoute";
import OrganizerRoute from "./components/OrganizerRoute";
import { AuthProvider } from "./context/AuthContext";

// Home Page Layout
function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <TrendingEvents />
      <Features />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar /> {/* Navbar automatically shows buttons based on logged-in user */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:postId" element={<BlogPost />} />
          <Route path="/support" element={<Support />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/event/:id" element={<EventDetails />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-reviews"
            element={
              <ProtectedRoute>
                <MyReviews />
              </ProtectedRoute>
            }
          />

          {/* Organizer-only Routes */}
          <Route
            path="/create-event"
            element={
              <OrganizerRoute>
                <CreateEvent />
              </OrganizerRoute>
            }
          />
          <Route
            path="/create-venue"
            element={
              <OrganizerRoute>
                <CreateVenue />
              </OrganizerRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
