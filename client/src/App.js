// src/App.js
import React, { useState } from "react";
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
import Venues from "./pages/Venues";
import Blog from "./pages/Blog";
import Support from "./pages/Support";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EventDetails from "./pages/EventDetails";
import VenueDetails from "./pages/VenueDetails";
import BlogPost from "./pages/BlogPost";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

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
  // Session user state; starts null on fresh app start
  const [user, setUser] = useState(null);
  const sessionUser = { user, setUser }; // pass to Navbar and Login

  return (
    <Router>
      <Navbar sessionUser={sessionUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/venues/:id" element={<VenueDetails />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postId" element={<BlogPost />} />
        <Route path="/support" element={<Support />} />
        <Route path="/login" element={<Login sessionUser={sessionUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
