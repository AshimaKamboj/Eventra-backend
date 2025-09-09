import React from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";

function Venues() {
  const navigate = useNavigate();

  // Updated venue data with more details
  const venues = [
    {
      id: 1,
      name: "JW Marriott Hotel",
      location: "Mumbai, India",
      capacity: "500 - 2000 Guests",
      description: "A luxurious 5-star hotel offering world-class services and state-of-the-art facilities for grand events and conferences. Located in the heart of the city, it provides an elegant setting with multiple banquet halls and a rooftop terrace.",
      amenities: ["Free Wi-Fi", "In-house Catering", "Projector & Screen", "Valet Parking", "Audio/Visual Equipment"],
      images: [
          "https://cache.marriott.com/content/dam/marriott-renditions/IXCJW/ixcjw-reception-1613-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1336px:*"
      ]
    },
    {
      id: 2,
      name: "Bangalore International Convention Centre",
      location: "Bangalore, India",
      capacity: "1000 - 5000 Guests",
      description: "A sprawling convention center with flexible spaces, perfect for large-scale exhibitions, trade shows, and corporate events. It boasts high-tech infrastructure and customizable floor plans to suit any event's needs.",
      amenities: ["High-speed Internet", "Event Planning Staff", "On-site Restaurants", "Exhibition Booths", "Security Services"],
      images: [
        "https://www.biec.in/images/Biec-slide1.webp"
      ]
    },
    {
      id: 3,
      name: "Pragati Maidan",
      location: "Delhi, India",
      capacity: "2000 - 10000 Guests",
      description: "One of the largest exhibition and convention centers in India, known for hosting major international trade fairs and public events. Its vast open grounds and multiple halls can accommodate events of massive scale.",
      amenities: ["Multiple Halls", "Open Grounds", "Parking Facilities", "Food Courts", "Exhibition Services"],
      images: [
        "https://vajiramandravi.com/current-affairs/wp-content/uploads/2025/03/pragati_maidan.jpg"
      ]
    },
    {
      id: 4,
      name: "Taj Palace Hotel",
      location: "Delhi, India",
      capacity: "300 - 1500 Guests",
      description: "A symbol of classic elegance and hospitality, the Taj Palace offers a regal setting for weddings, banquets, and corporate gatherings. Its grand ballrooms and lush gardens provide a truly memorable experience.",
      amenities: ["Luxurious Suites", "Fine Dining", "Swimming Pool", "Event Staffing", "On-site Parking"],
      images: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3cAXNircIYz_QMeYR0q8SC6QhQ0Vv34Vx0g&s"
      ]
    },
    {
      id: 5,
      name: "Beachside Resort",
      location: "Goa, India",
      capacity: "200 - 800 Guests",
      description: "Experience the perfect blend of scenic beauty and modern comfort. This resort is ideal for destination weddings, team retreats, and relaxing corporate getaways. The private beach access is a unique highlight.",
      amenities: ["Private Beach", "Accommodation", "Swimming Pool", "Bar & Grill", "Outdoor Event Space"],
      images: [
        "https://beachsideresortgulfshores.com/wp-content/uploads/2024/02/36-scaled.jpg"
      ]
    },
    {
      id: 6,
      name: "Hyderabad Expo Centre",
      location: "Hyderabad, India",
      capacity: "1000 - 7000 Guests",
      description: "A modern and versatile space for exhibitions, product launches, and large conferences. The venue features multiple interconnected halls and is equipped with cutting-edge technology for all your event needs.",
      amenities: ["Large Exhibition Halls", "Conference Rooms", "Parking", "Catering Services", "Security"],
      images: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuEti-xpn7PCcGev8PmOyuNoq8xiB_WcJnsw&s"
      ]
    }
  ];

  // fallback placeholder if image fails
  const placeholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E";

  return (
    <section className="venues-section">
      <h2 className="section-title">🏛 Popular Venues</h2>
      <div className="venues-grid">
        {venues.map((venue) => (
          <div key={venue.id} className="venue-card">
            <img
              src={venue.images[0]}
              alt={venue.name}
              className="venue-img"
              onError={(e) => {
                e.currentTarget.src = placeholder;
              }}
            />
            <div className="venue-info">
              <h3>{venue.name}</h3>
              <p>{venue.location}</p>
              <p>
                <strong>Capacity:</strong> {venue.capacity}
              </p>
              <button
                className="venue-btn"
                onClick={() => navigate(`/venues/${venue.id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Venues;

