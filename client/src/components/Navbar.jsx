import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>Skill<span style={{ color: "#2FA88F" }}>Swap</span></div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Browse</Link>
        <Link to="/my-listings" style={styles.link}>My Listings</Link>
        <Link to="/sessions" style={styles.link}>Sessions</Link>
        <Link to="/create" style={styles.link}>+ New Listing</Link>
        <span style={styles.creditPill}>{user?.creditBalance ?? 0} credits</span>
        <span style={styles.userName}>{user?.name}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: "#1B2A4A", color: "#fff", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 20, fontWeight: 700 },
  links: { display: "flex", gap: 20, alignItems: "center" },
  link: { color: "#D6DCE8", textDecoration: "none", fontSize: 14 },
  creditPill: { background: "#2FA88F", color: "#1B2A4A", fontWeight: 700, padding: "6px 14px", borderRadius: 999, fontSize: 13 },
  userName: { fontSize: 13, color: "#D6DCE8" },
  logoutBtn: { background: "transparent", border: "1px solid #3a4a6b", color: "#D6DCE8", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 },
};

export default Navbar;