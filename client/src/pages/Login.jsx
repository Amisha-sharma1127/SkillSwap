import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.brand}>
        Skill<span style={{ color: "#2FA88F" }}>Swap</span>
      </h1>
      <p style={styles.subtitle}>Trade skills, not money.</p>

      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <button style={styles.button} type="submit">Log In</button>
      </form>

      {error && <div style={styles.error}>{error}</div>}

      <p style={styles.switchText}>
        Don't have an account? <Link to="/register" style={styles.link}>Sign up</Link>
      </p>
    </div>
  );
}

const styles = {
  wrapper: { maxWidth: 400, margin: "60px auto", background: "#fff", borderRadius: 12, padding: 40, boxShadow: "0 2px 20px rgba(27,42,74,0.08)" },
  brand: { textAlign: "center", color: "#E8703A", fontSize: 26, marginBottom: 4 },
  subtitle: { textAlign: "center", color: "#6B7280", fontSize: 14, marginBottom: 20 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#1B2A4A", margin: "16px 0 6px" },
  input: { width: "100%", padding: "11px 13px", border: "1px solid #E2E6EA", borderRadius: 8, fontSize: 14, boxSizing: "border-box" },
  button: { width: "100%", background: "#0E7C7B", color: "#fff", border: "none", padding: 12, borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 20 },
  error: { background: "#FDECEA", color: "#C0392B", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginTop: 14 },
  switchText: { textAlign: "center", marginTop: 18, fontSize: 13, color: "#6B7280" },
  link: { color: "#0E7C7B", fontWeight: 600, textDecoration: "none" },
};

export default Login;