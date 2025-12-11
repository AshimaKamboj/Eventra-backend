import React, { useMemo, useState } from "react";

// Simple goodies catalog for merch
const GOODS = [
  {
    id: "tee",
    name: "Eventra Classic Tee",
    price: 19.99,
    description: "Soft cotton, unisex fit with Eventra wordmark.",
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cap",
    name: "Eventra Dad Cap",
    price: 16.0,
    description: "Low-profile cap with embroidered logo.",
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "bag",
    name: "Eventra Tote Bag",
    price: 14.5,
    description: "Durable canvas tote for events and daily use.",
    badge: "Eco",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "hoodie",
    name: "Eventra Cozy Hoodie",
    price: 32.0,
    description: "Mid-weight hoodie with front pocket.",
    badge: "Limited",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "stickers",
    name: "Eventra Sticker Pack",
    price: 4.99,
    description: "Die-cut stickers set of 6 designs.",
    badge: "Popular",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
];

function Goodies() {
  const [cart, setCart] = useState({});

  const addToCart = (item) => {
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[itemId] > 1) next[itemId] -= 1;
      else delete next[itemId];
      return next;
    });
  };

  const cartItems = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const product = GOODS.find((g) => g.id === id);
      return product ? { ...product, qty } : null;
    }).filter(Boolean);
  }, [cart]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div style={{ padding: "2rem 1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "1rem" }}>
        <p style={{ color: "#6366f1", fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.85rem", textTransform: "uppercase" }}>
          Merch Store
        </p>
        <h1 style={{ fontSize: "2rem", margin: "0 0 0.5rem" }}>Eventra Goodies</h1>
        <p style={{ color: "#4b5563", maxWidth: "720px" }}>
          Grab limited Eventra tees, caps, bags, stickers, and more. Add items to your bag and proceed to checkout (coming soon!).
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Products grid */}
        <div className="goodies-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          {GOODS.map((item) => (
            <div key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ position: "relative", paddingBottom: "65%", overflow: "hidden" }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
                {item.badge && (
                  <span style={{ position: "absolute", top: 12, left: 12, background: "#111827", color: "#fff", padding: "4px 10px", borderRadius: "999px", fontSize: "0.75rem", letterSpacing: "0.04em" }}>
                    {item.badge}
                  </span>
                )}
              </div>
              <div style={{ padding: "1rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ margin: "0 0 0.35rem", fontSize: "1.05rem" }}>{item.name}</h3>
                <p style={{ margin: "0 0 0.5rem", color: "#6b7280", fontSize: "0.95rem" }}>{item.description}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                  <span style={{ fontWeight: 700, color: "#111827" }}>${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(item)}
                    style={{
                      background: "linear-gradient(120deg, #6366f1, #8b5cf6)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.5rem 0.9rem",
                      cursor: "pointer",
                      fontWeight: 600,
                      boxShadow: "0 4px 10px rgba(99,102,241,0.35)",
                    }}
                  >
                    Add to bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart summary */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "1.25rem", background: "#fff", boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}>
          <h3 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "1.1rem" }}>Your bag</h3>
          {cartItems.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Add goodies to see them here.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
              {cartItems.map((item) => (
                <li key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                      ${item.price.toFixed(2)} × {item.qty}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ border: "1px solid #e5e7eb", background: "#f9fafb", borderRadius: "6px", padding: "0.25rem 0.55rem", cursor: "pointer" }}
                    >
                      −
                    </button>
                    <button
                      onClick={() => addToCart(item)}
                      style={{ border: "1px solid #e5e7eb", background: "#f9fafb", borderRadius: "6px", padding: "0.25rem 0.55rem", cursor: "pointer" }}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div style={{ borderTop: "1px solid #e5e7eb", margin: "1rem 0", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            style={{
              width: "100%",
              background: cartItems.length ? "linear-gradient(120deg, #10b981, #059669)" : "#e5e7eb",
              color: cartItems.length ? "#fff" : "#9ca3af",
              border: "none",
              borderRadius: "10px",
              padding: "0.75rem",
              fontWeight: 700,
              cursor: cartItems.length ? "pointer" : "not-allowed",
              transition: "transform 120ms ease, box-shadow 120ms ease",
              boxShadow: cartItems.length ? "0 8px 18px rgba(16,185,129,0.3)" : "none",
            }}
            disabled={!cartItems.length}
            onClick={() => {
              if (!cartItems.length) return;
              alert("Checkout coming soon! Your selections are saved locally.");
            }}
          >
            Checkout (coming soon)
          </button>
        </div>
      </div>
    </div>
  );
}

export default Goodies;
