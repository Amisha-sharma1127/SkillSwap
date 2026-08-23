import { useState, useEffect } from "react";
import api from "../api/axios";

function MyListings() {
  const [listings, setListings] = useState([]);

  const load = async () => {
    const res = await api.get("/listings/mine");
    setListings(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this listing?")) return;
    await api.delete(`/listings/${id}`);
    load();
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ color: "#1B2A4A" }}>My Listings</h1>
      <p style={{ color: "#6B7280", marginBottom: 24 }}>Manage what you're offering and looking for.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {listings.length === 0 && <p style={{ color: "#6B7280" }}>You haven't posted anything yet.</p>}
        {listings.map((l) => (
          <div key={l._id} style={{ background: "#fff", borderRadius: 10, padding: 20, border: "1px solid #E2E6EA" }}>
            <h3 style={{ color: "#1B2A4A" }}>{l.skillName}</h3>
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>{l.category}</div>
            <div style={{ fontSize: 13.5, marginBottom: 14 }}>{l.description}</div>
            <button onClick={() => handleDelete(l._id)} style={{ background: "#C0392B", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyListings;