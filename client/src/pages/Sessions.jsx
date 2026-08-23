import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const { user, updateUser } = useAuth();

  const load = async () => {
  const res = await api.get("/sessions/mine");
  setSessions(res.data);
  const profile = await api.get("/auth/profile");
  updateUser({ ...user, creditBalance: profile.data.user.creditBalance });
};

  useEffect(() => { load(); }, []);

  const doAction = async (id, action) => {
    try {
      await api.patch(`/sessions/${id}/${action}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action}`);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ color: "#1B2A4A" }}>My Sessions</h1>
      <p style={{ color: "#6B7280", marginBottom: 24 }}>Sessions you're teaching or learning. Your balance: {user?.creditBalance} credits.</p>

      {sessions.length === 0 && <p style={{ color: "#6B7280" }}>No sessions yet.</p>}
      {sessions.map((s) => {
        const isTeacher = s.teacherId?._id === user?.id;
        return (
          <div key={s._id} style={{ background: "#fff", borderRadius: 10, padding: 20, border: "1px solid #E2E6EA", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong style={{ color: "#1B2A4A" }}>{s.skillListingId?.skillName}</strong>
                <div style={{ fontSize: 12, color: "#6B7280" }}>
                  {isTeacher ? `Teaching ${s.learnerId?.name}` : `Learning from ${s.teacherId?.name}`} — {s.creditsAgreed} credits
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0E7C7B" }}>{s.status.toUpperCase()}</span>
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              {isTeacher && s.status === "requested" && (
                <button onClick={() => doAction(s._id, "confirm")} style={btnStyle("#0E7C7B")}>Confirm</button>
              )}
              {s.status === "confirmed" && (
                <button onClick={() => doAction(s._id, "complete")} style={btnStyle("#2FA88F")}>Mark Complete</button>
              )}
              {["requested", "confirmed"].includes(s.status) && (
                <button onClick={() => doAction(s._id, "cancel")} style={btnStyle("#C0392B")}>Cancel</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const btnStyle = (color) => ({ background: color, color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 });

export default Sessions;