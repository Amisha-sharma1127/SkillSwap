import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/", label: "Discover" },
    { to: "/my-listings", label: "My Listings" },
    { to: "/sessions", label: "My Sessions" },
    { to: "/create", label: "List a Skill" },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={styles.logoMark}>S</span>
        Skill<span style={{ color: "#E8703A" }}>Swap</span>
      </div>

      <div style={styles.userCard}>
        <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || "?"}</div>
        <div>
          <div style={styles.userName}>{user?.name}</div>
          <div style={styles.userCredits}>{user?.creditBalance ?? 0} credits</div>
        </div>
      </div>

      <nav style={styles.nav}>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={{
              ...styles.navLink,
              ...(location.pathname === l.to ? styles.navLinkActive : {}),
            }}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <button style={styles.logoutBtn} onClick={handleLogout}>Log out</button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: 240, minHeight: "100vh", background: "#1A2333", color: "#fff",
    padding: "24px 20px", display: "flex", flexDirection: "column",
    position: "fixed", left: 0, top: 0, boxSizing: "border-box",
  },
  logo: { fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", gap: 10, marginBottom: 28 },
  logoMark: {
    width: 30, height: 30, borderRadius: 8, background: "#E8703A", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15,
  },
  userCard: {
    display: "flex", alignItems: "center", gap: 10, background: "#232D42",
    borderRadius: 10, padding: 12, marginBottom: 28,
  },
  avatar: {
    width: 36, height: 36, borderRadius: 8, background: "#E8703A", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0,
  },
  userName: { fontSize: 13.5, fontWeight: 600, color: "#fff" },
  userCredits: { fontSize: 12, color: "#E8703A" },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navLink: {
    color: "#A9B2C3", textDecoration: "none", fontSize: 14.5, padding: "10px 12px",
    borderRadius: 8, fontWeight: 500,
  },
  navLinkActive: { background: "#E8703A", color: "#fff", fontWeight: 600 },
  logoutBtn: {
    background: "transparent", border: "1px solid #333F55", color: "#A9B2C3",
    padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13.5, marginTop: 12,
  },
};

export default Navbar;