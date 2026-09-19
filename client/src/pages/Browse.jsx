import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Browse() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { user } = useAuth();

  const loadListings = async () => {
    const params = {};
    if (search) params.q = search;
    if (category) params.category = category;
    const res = await api.get("/listings", { params });
    setListings(res.data);
  };

  useEffect(() => { loadListings(); }, []);

  const requestSession = async (listing, iAmTeaching) => {
    const creditsAgreed = prompt("How many credits for this session?", "2");
    if (!creditsAgreed) return;
    const scheduledAt = prompt("When? (YYYY-MM-DD HH:MM)", "2026-08-01 10:00");
    if (!scheduledAt) return;
    try {
      await api.post("/sessions/request", {
        skillListingId: listing._id,
        creditsAgreed: Number(creditsAgreed),
        scheduledAt: new Date(scheduledAt.replace(" ", "T")).toISOString(),
        iAmTeaching,
      });
      alert("Session requested! Check the Sessions page.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to request session");
    }
  };

  return (
    <div style={{ background: "#F7F3EC", minHeight: "100vh", width: "100%" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ color: "#1B2A4A" }}>Browse Skills</h1>
        <p style={{ color: "#6B7280", marginBottom: 24 }}>Find someone to learn from, or offer to teach.</p>

        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <input placeholder="Search by skill..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: 11, border: "1px solid #E2E6EA", borderRadius: 8 }} />
          <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)}
            style={{ flex: 1, padding: 11, border: "1px solid #E2E6EA", borderRadius: 8 }} />
          <button onClick={loadListings} style={{ background: "#0E7C7B", color: "#fff", border: "none", padding: "0 20px", borderRadius: 8, cursor: "pointer" }}>Filter</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {listings.length === 0 && <p style={{ color: "#6B7280" }}>No listings yet.</p>}
          {listings.map((l) => {
            const isOwner = l.userId?._id === user?.id;
            return (
             <div key={l._id} style={{
                  background: "#FDFBF7", borderRadius: 14, padding: 22,
                  border: "1px solid #EAE3D6", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                  <span style={{
                    background: l.type === "offer" ? "#E8F5F1" : "#EAF0FA",
                    color: l.type === "offer" ? "#0E7C7B" : "#3B5B92",
                    fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999,
                    letterSpacing: "0.03em",
                  }}>
                    {l.type === "offer" ? "OFFERING" : "WANTING"}
                  </span>
                  <h3 style={{ color: "#1A2333", margin: "12px 0 4px", fontSize: 18 }}>{l.skillName}</h3>
                  <div style={{ fontSize: 12, color: "#8A93A3", marginBottom: 12 }}>{l.category}</div>
                  <div style={{ fontSize: 13.5, color: "#5B6472", marginBottom: 16, lineHeight: 1.5 }}>{l.description}</div>
                  <div style={{ fontSize: 12, color: "#8A93A3", borderTop: "1px solid #EAE3D6", paddingTop: 14 }}>
                    By {l.userId?.name}
                    {l.userId?.ratingCount > 0 && (
                      <span style={{ color: "#E8703A", fontWeight: 600 }}> · ★ {l.userId.avgRating} ({l.userId.ratingCount})</span>
                    )}
                  </div>
                {!isOwner && l.type === "offer" && (
                  <button onClick={() => requestSession(l, false)} style={{ marginTop: 12, background: "#0E7C7B", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
                    Request Session
                  </button>
                )}
                {!isOwner && l.type === "want" && (
                  <button onClick={() => requestSession(l, true)} style={{ marginTop: 12, background: "#3B5B92", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
                    Offer to Teach
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Browse;