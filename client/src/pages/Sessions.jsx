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

  useEffect(() => {
    load();
  }, []);

  const doAction = async (id, action) => {
    try {
      await api.patch(`/sessions/${id}/${action}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action}`);
    }
  };

  const leaveReview = async (sessionId) => {
    const rating = prompt("Rate this session 1-5:", "5");
    if (!rating) return;
    const comment = prompt("Any comments? (optional)", "");
    try {
      await api.post("/reviews", {
        sessionId,
        rating: Number(rating),
        comment: comment || "",
      });
      alert("Review submitted!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  const joinMeeting = (sessionId) => {
    const roomName = `SkillSwap-Session-${sessionId}`;
    window.open(`https://meet.jit.si/${roomName}`, "_blank", "noopener,noreferrer");
  };

  const statusStyle = (status) => {
    const map = {
      offered: { bg: "#FEF3E2", color: "#B8860B" },
      requested: { bg: "#FEF3E2", color: "#B8860B" },
      confirmed: { bg: "#E8F5F1", color: "#0E7C7B" },
      completed: { bg: "#E8F0FE", color: "#3B5B92" },
      cancelled: { bg: "#FDECEA", color: "#C0392B" },
    };
    return map[status] || { bg: "#F0F0F0", color: "#6B7280" };
  };

  return (
    <div style={{ background: "#F7F3EC", minHeight: "100vh", width: "100%" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ color: "#1B2A4A", fontSize: 32, marginBottom: 6 }}>My Sessions</h1>
        <div style={{
          display: "inline-block", background: "#1A2333", color: "#fff",
          padding: "8px 18px", borderRadius: 999, fontSize: 14, fontWeight: 600, marginBottom: 28,
        }}>
          Balance: <span style={{ color: "#E8703A" }}>{user?.creditBalance} credits</span>
        </div>

        {sessions.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#8A93A3" }}>
            No sessions yet — head to Discover to find a skill.
          </div>
        )}

        {sessions.map((s) => {
          const isTeacher = s.teacherId?._id === user?.id;
          const status = (s.status || "").toLowerCase();
          const st = statusStyle(status);

          return (
            <div
              key={s._id}
              style={{
                background: "#FDFBF7",
                borderRadius: 14,
                padding: 22,
                border: "1px solid #EAE3D6",
                marginBottom: 16,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, background: "#1A2333",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 16, flexShrink: 0,
                  }}>
                    {(isTeacher ? s.learnerId?.name : s.teacherId?.name)?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#1A2333", fontSize: 16 }}>
                      {s.skillListingId?.skillName || "Skill Session"}
                    </div>
                    <div style={{ fontSize: 13, color: "#8A93A3", marginTop: 2 }}>
                      {isTeacher
                        ? `Teaching ${s.learnerId?.name || "Learner"}`
                        : `Learning from ${s.teacherId?.name || "Teacher"}`}{" "}
                      · {s.creditsAgreed} credits
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 999,
                  background: st.bg, color: st.color, letterSpacing: "0.03em",
                }}>
                  {status.toUpperCase()}
                </span>
              </div>

              <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {isTeacher && ["requested", "offered"].includes(status) && (
                  <button onClick={() => doAction(s._id, "confirm")} style={btnStyle("#0E7C7B")}>Confirm</button>
                )}
                {status === "confirmed" && (
                  <button onClick={() => joinMeeting(s._id)} style={btnStyle("#3B82F6")}>Join video call</button>
                )}
                {status === "confirmed" && (
                  <button onClick={() => doAction(s._id, "complete")} style={btnStyle("#2FA88F")}>Mark Complete</button>
                )}
                {status === "completed" && (
                  <button onClick={() => leaveReview(s._id)} style={btnStyle("#E8703A")}>Leave Review</button>
                )}
                {["offered", "requested", "confirmed"].includes(status) && (
                  <button onClick={() => doAction(s._id, "cancel")} style={btnStyle("#C0392B", true)}>Cancel</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const btnStyle = (color, outline) => ({
  background: outline ? "transparent" : color,
  color: outline ? color : "#fff",
  border: outline ? `1px solid ${color}` : "none",
  padding: "8px 18px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
});

export default Sessions;