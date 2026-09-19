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
    <div style={{ background: "#F7F3EC", minHeight: "100vh", width: "100%" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ color: "#1A2333", fontSize: 32 }}>My Listings</h1>
        <p style={{ color: "#8A93A3", marginBottom: 28 }}>Manage what you're offering and looking for.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {listings.length === 0 && <p style={{ color: "#8A93A3" }}>You haven't posted anything yet.</p>}
          {listings.map((l) => (
            <div key={l._id} style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              borderLeft: "5px solid #E8703A",
              boxShadow: "0 4px 14px rgba(26,35,51,0.08)",
            }}>
              <div style={{
                display: "inline-block", fontSize: 11, fontWeight: 700,
                color: "#E8703A", background: "#FDE7DB", padding: "4px 12px",
                borderRadius: 999, marginBottom: 12, letterSpacing: "0.03em",
              }}>
                {l.category?.toUpperCase()}
              </div>
              <h3 style={{ color: "#1A2333", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                {l.skillName}
              </h3>
              {l.description && (
                <p style={{ fontSize: 13.5, color: "#5B6472", lineHeight: 1.5, marginBottom: 18 }}>
                  {l.description}
                </p>
              )}
              <button onClick={() => handleDelete(l._id)} style={{
                background: "transparent", color: "#C0392B", border: "1.5px solid #F0C4BC",
                padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
              }}>
                Delete Listing
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyListings;