import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function CreateListing() {
  const [type, setType] = useState("offer");
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/listings", { type, skillName, category, description });
      navigate("/my-listings");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    }
  };

  return (
    <div style={{ background: "#F7F3EC", minHeight: "100vh", width: "100%" }}>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ color: "#1B2A4A" }}>New Skill Listing</h1>
        <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 10, padding: 28, border: "1px solid #E2E6EA", marginTop: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>I want to...</label>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <button type="button" onClick={() => setType("offer")}
              style={{ flex: 1, padding: 10, borderRadius: 8, border: type === "offer" ? "1px solid #0E7C7B" : "1px solid #E2E6EA", background: type === "offer" ? "#E8F5F1" : "#fff", color: type === "offer" ? "#0E7C7B" : "#6B7280", fontWeight: 600, cursor: "pointer" }}>
              Teach (Offer)
            </button>
            <button type="button" onClick={() => setType("want")}
              style={{ flex: 1, padding: 10, borderRadius: 8, border: type === "want" ? "1px solid #0E7C7B" : "1px solid #E2E6EA", background: type === "want" ? "#E8F5F1" : "#fff", color: type === "want" ? "#0E7C7B" : "#6B7280", fontWeight: 600, cursor: "pointer" }}>
              Learn (Want)
            </button>
          </div>

          <label style={{ display: "block", fontSize: 13, fontWeight: 600, margin: "16px 0 6px" }}>Skill Name</label>
          <input value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="e.g. React.js"
            style={{ width: "100%", padding: 11, border: "1px solid #E2E6EA", borderRadius: 8, boxSizing: "border-box" }} />

          <label style={{ display: "block", fontSize: 13, fontWeight: 600, margin: "16px 0 6px" }}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%", padding: 11, border: "1px solid #E2E6EA", borderRadius: 8 }}>
            <option>Web Development</option>
            <option>Design</option>
            <option>Languages</option>
            <option>Music</option>
            <option>Data Science</option>
            <option>Other</option>
          </select>

          <label style={{ display: "block", fontSize: 13, fontWeight: 600, margin: "16px 0 6px" }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
            style={{ width: "100%", padding: 11, border: "1px solid #E2E6EA", borderRadius: 8, boxSizing: "border-box" }} />

          <button type="submit" style={{ width: "100%", background: "#0E7C7B", color: "#fff", border: "none", padding: 12, borderRadius: 8, fontWeight: 600, cursor: "pointer", marginTop: 20 }}>
            Post Listing
          </button>
          {error && <div style={{ background: "#FDECEA", color: "#C0392B", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginTop: 14 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default CreateListing;