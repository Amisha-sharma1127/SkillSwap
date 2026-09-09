import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Landing() {
  const [topListings, setTopListings] = useState([]);

  useEffect(() => {
    api
      .get("/listings")
      .then((res) => {
        const rated = res.data
          .filter((l) => l.userId?.ratingCount > 0)
          .sort((a, b) => (b.userId?.avgRating || 0) - (a.userId?.avgRating || 0))
          .slice(0, 3);
        setTopListings(rated);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.logo}>
          <span style={s.logoMark}>S</span>
          Skill<span style={{ color: "#E8703A" }}>Swap</span>
        </div>
        <div style={s.navCenter}>
          <a href="#skills" style={s.navCenterLink}>
            Explore skills
          </a>
          <a href="#how" style={s.navCenterLink}>
            How it works
          </a>
        </div>
        <div style={s.navLinks}>
          <Link to="/login" style={s.navLink}>
            Log in
          </Link>
          <Link to="/register" style={s.navBtn}>
            Join the swap
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header style={s.hero}>
        <div style={s.heroLeft}>
          <div style={s.heroBadge}>● A BETTER KIND OF CAMPUS NETWORK</div>
          <h1 style={s.heroTitle}>
            Trade curiosity,
            <br />
            <span style={{ color: "#E8703A" }}>not cash.</span>
          </h1>
          <p style={s.heroSub}>
            SkillSwap is where students teach what they know, earn campus
            credits, and find the people who can unlock what's next.
          </p>
          <div style={s.heroActions}>
            <a href="#skills" style={s.primaryBtn}>
              Find a skill →
            </a>
            <Link to="/register" style={s.secondaryBtn}>
              Start teaching
            </Link>
          </div>
          <div style={s.heroProof}>
            <div style={s.avatarStack}>
              {["JR", "KM", "A"].map((n, i) => (
                <span key={i} style={{ ...s.avatarChip, marginLeft: i === 0 ? 0 : -10 }}>
                  {n}
                </span>
              ))}
            </div>
            <span style={s.heroProofText}>1,240+ students already swapping</span>
          </div>
        </div>

        <div style={s.heroRight}>
          <div style={s.heroCard}>
            <div style={s.heroCardTop}>
              <span>LIVE ON CAMPUS</span>
              <span>● All systems ready</span>
            </div>
            <h3 style={s.heroCardTitle}>
              What can you
              <br />
              teach in 60 minutes?
            </h3>
            <p style={s.heroCardSub}>
              From film photography to econometrics, someone nearby is
              looking for your exact kind of brain.
            </p>
            <div style={s.heroCardGrid}>
              <div style={s.heroCardTile}>
                <p style={s.tileLabel}>TOP SWAP</p>
                <p style={s.tileTitle}>Figma for founders</p>
                <p style={s.tileSub}>6 credits · 45 min</p>
              </div>
              <div style={{ ...s.heroCardTile, background: "#E8703A" }}>
                <p style={{ ...s.tileLabel, color: "rgba(255,255,255,0.75)" }}>
                  THIS WEEK
                </p>
                <p style={s.tileTitle}>32 new skills</p>
                <p style={{ ...s.tileSub, color: "rgba(255,255,255,0.75)" }}>
                  across your campus
                </p>
              </div>
            </div>
          </div>
          <div style={s.floatBadge}>
            <span style={s.floatAvatar}>MS</span>
            <div>
              <p style={s.floatName}>Maya just joined</p>
              <p style={s.floatSub}>Illustration · North Quad</p>
            </div>
          </div>
        </div>
      </header>

      {/* How it works */}
      <section id="how" style={s.howSection}>
        <div style={s.howLeft}>
          <div style={s.eyebrow}>THE SIMPLE EXCHANGE</div>
          <h2 style={s.howTitle}>
            A campus full of
            <br />
            teachers.
          </h2>
          <p style={s.howSub}>
            Learning gets better when it feels like a conversation, not a
            transaction.
          </p>
        </div>
        <div style={s.stepsGrid}>
          {[
            ["01", "Offer your edge", "List the thing friends always ask you to explain."],
            ["02", "Spend credits", "Book a peer, not a price tag. One hour, one fair exchange."],
            ["03", "Keep it moving", "Complete sessions, earn more, pass it on."],
          ].map(([n, t, d]) => (
            <div key={n} style={s.stepCard}>
              <div style={s.stepNum}>{n}</div>
              <h3 style={s.stepTitle}>{t}</h3>
              <p style={s.stepDesc}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular this week (real data) */}
      <section id="skills" style={s.tutorsSection}>
        <div style={s.tutorsHeader}>
          <div>
            <div style={s.eyebrow}>A FEW DOORS TO OPEN</div>
            <h2 style={s.sectionTitle}>Popular this week</h2>
          </div>
          <Link to="/register" style={s.browseLink}>
            Browse all skills →
          </Link>
        </div>

        {topListings.length > 0 ? (
          <div style={s.tutorsGrid}>
            {topListings.map((l) => (
              <div key={l._id} style={s.tutorCard}>
                <span style={s.tutorBadge}>{l.category}</span>
                <h3 style={s.tutorSkill}>{l.skillName}</h3>
                <p style={s.tutorDesc}>
                  with {l.userId?.name} · {l.userId?.avgRating} rating
                </p>
                <div style={s.tutorFooter}>
                  <span style={s.tutorName}>
                    {l.description ? l.description.slice(0, 28) : "No description"}
                    {l.description && l.description.length > 28 ? "…" : ""}
                  </span>
                  <span style={s.tutorRating}>
                    ★ {l.userId?.ratingCount} reviews
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={s.emptyState}>
            No rated listings yet — be the first to teach something and show
            up here.
          </p>
        )}
      </section>

      {/* CTA banner */}
      <section style={s.ctaSection}>
        <div style={s.ctaCard}>
          <div>
            <div style={{ ...s.eyebrow, color: "#F0A88A" }}>
              MAKE YOUR KNOW-HOW COUNT
            </div>
            <h2 style={s.ctaTitle}>
              You don't need to be an expert.
              <br />
              Just be one step ahead.
            </h2>
          </div>
          <Link to="/register" style={s.ctaBtn}>
            Join SkillSwap →
          </Link>
        </div>
      </section>

      <footer style={s.footer}>
        <span style={s.footerLeft}>© SkillSwap · Built for curious campuses</span>
        <span style={s.footerRight}>Learn generously / earn fairly</span>
      </footer>
    </div>
  );
}

const s = {
  page: {
    background: "#F7F3EC",
    minHeight: "100vh",
    fontFamily: "-apple-system, Segoe UI, Roboto, sans-serif",
    color: "#1A2333",
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 48px",
  },
  logo: {
    fontSize: 19,
    fontWeight: 800,
    color: "#1A2333",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  logoMark: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#1A2333",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 14,
  },
  navCenter: { display: "flex", gap: 32 },
  navCenterLink: {
    color: "#5B6472",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
  },
  navLinks: { display: "flex", alignItems: "center", gap: 16 },
  navLink: {
    color: "#1A2333",
    textDecoration: "none",
    fontSize: 14.5,
    fontWeight: 500,
  },
  navBtn: {
    background: "#E8703A",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 999,
    textDecoration: "none",
    fontSize: 14.5,
    fontWeight: 600,
  },

  hero: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 48,
    alignItems: "center",
    padding: "40px 48px 100px",
    maxWidth: 1140,
    margin: "0 auto",
  },
  heroLeft: {},
  heroBadge: {
    fontSize: 12.5,
    fontWeight: 800,
    letterSpacing: "0.04em",
    color: "#C2551F",
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: 700,
    fontFamily: "Georgia, 'Times New Roman', serif",
    lineHeight: 1.08,
    marginBottom: 20,
    color: "#1A2333",
  },
  heroSub: {
    fontSize: 16,
    color: "#5B6472",
    lineHeight: 1.6,
    marginBottom: 30,
    maxWidth: 440,
  },
  heroActions: { display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" },
  primaryBtn: {
    background: "#E8703A",
    color: "#fff",
    padding: "13px 24px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14.5,
  },
  secondaryBtn: {
    background: "transparent",
    color: "#1A2333",
    padding: "13px 24px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 14.5,
    border: "1px solid #D8D0C0",
  },
  heroProof: { display: "flex", alignItems: "center", gap: 12 },
  avatarStack: { display: "flex" },
  avatarChip: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "#1A2333",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #F7F3EC",
  },
  heroProofText: { fontSize: 13.5, color: "#5B6472" },

  heroRight: { position: "relative" },
  heroCard: {
    background: "#1A2333",
    borderRadius: 24,
    padding: 32,
    color: "#fff",
    boxShadow: "0 20px 40px rgba(26,35,51,0.25)",
  },
  heroCardTop: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 40,
    letterSpacing: "0.03em",
  },
  heroCardTitle: {
    fontSize: 24,
    fontFamily: "Georgia, 'Times New Roman', serif",
    lineHeight: 1.3,
    marginBottom: 12,
  },
  heroCardSub: {
    fontSize: 13.5,
    color: "rgba(255,255,255,0.55)",
    lineHeight: 1.6,
    marginBottom: 28,
    maxWidth: 300,
  },
  heroCardGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  heroCardTile: { background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 16 },
  tileLabel: { fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 6 },
  tileTitle: { fontSize: 14, fontWeight: 600, marginBottom: 4 },
  tileSub: { fontSize: 11.5, color: "rgba(255,255,255,0.5)" },

  floatBadge: {
    position: "absolute",
    bottom: -24,
    left: 24,
    background: "#fff",
    borderRadius: 16,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 10px 24px rgba(26,35,51,0.15)",
  },
  floatAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#FDE7DB",
    color: "#E8703A",
    fontSize: 11,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  floatName: { fontSize: 13.5, fontWeight: 600, marginBottom: 2 },
  floatSub: { fontSize: 11.5, color: "#8A93A3" },

  howSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1.3fr",
    gap: 48,
    padding: "80px 48px",
    maxWidth: 1140,
    margin: "0 auto",
    borderTop: "1px solid #EAE3D6",
  },
  howLeft: {},
  eyebrow: {
    fontSize: 11.5,
    fontWeight: 800,
    letterSpacing: "0.05em",
    color: "#C2551F",
    marginBottom: 16,
  },
  howTitle: {
    fontSize: 32,
    fontFamily: "Georgia, 'Times New Roman', serif",
    lineHeight: 1.15,
    marginBottom: 14,
    color: "#1A2333",
  },
  howSub: { fontSize: 14.5, color: "#5B6472", lineHeight: 1.6, maxWidth: 320 },
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
  stepCard: {
    background: "#FDFBF7",
    borderRadius: 16,
    padding: 22,
    border: "1px solid #EAE3D6",
  },
  stepNum: { fontSize: 12, fontWeight: 700, color: "#8A93A3", marginBottom: 20 },
  stepTitle: { fontSize: 15.5, fontWeight: 700, marginBottom: 8 },
  stepDesc: { fontSize: 13.5, color: "#5B6472", lineHeight: 1.5 },

  tutorsSection: {
    padding: "0px 48px 80px",
    maxWidth: 1140,
    margin: "0 auto",
  },
  tutorsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 28,
  },
  sectionTitle: { fontSize: 32, fontFamily: "Georgia, 'Times New Roman', serif", color: "#1A2333" },
  browseLink: {
    border: "1px solid #D8D0C0",
    borderRadius: 999,
    padding: "10px 18px",
    fontSize: 13.5,
    fontWeight: 600,
    color: "#1A2333",
    textDecoration: "none",
  },
  tutorsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 },
  emptyState: {
    fontSize: 13.5,
    color: "#8A93A3",
    background: "#FDFBF7",
    border: "1px dashed #E0D9C9",
    borderRadius: 16,
    padding: 32,
    textAlign: "center",
  },
  tutorCard: {
    background: "#FDFBF7",
    borderRadius: 16,
    padding: 24,
    border: "1px solid #EAE3D6",
  },
  tutorBadge: {
    display: "inline-block",
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.03em",
    color: "#E8703A",
    background: "#FDE7DB",
    padding: "4px 10px",
    borderRadius: 999,
    marginBottom: 14,
  },
  tutorSkill: {
    fontSize: 18,
    fontFamily: "Georgia, 'Times New Roman', serif",
    marginBottom: 6,
  },
  tutorDesc: { fontSize: 13, color: "#5B6472", marginBottom: 20 },
  tutorFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #EAE3D6",
    paddingTop: 14,
    fontSize: 12,
    color: "#5B6472",
  },
  tutorName: {},
  tutorRating: { color: "#E8703A", fontWeight: 700 },

  ctaSection: { padding: "0 48px 80px", maxWidth: 1140, margin: "0 auto" },
  ctaCard: {
    background: "#1A2333",
    borderRadius: 24,
    padding: "48px 56px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 32,
    flexWrap: "wrap",
  },
  ctaTitle: {
    fontSize: 28,
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: "#fff",
    lineHeight: 1.25,
    maxWidth: 420,
  },
  ctaBtn: {
    background: "#E8703A",
    color: "#fff",
    padding: "14px 26px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14.5,
    whiteSpace: "nowrap",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 48px 40px",
    maxWidth: 1140,
    margin: "0 auto",
    fontSize: 12.5,
    color: "#8A93A3",
  },
  footerLeft: {},
  footerRight: {},
};

export default Landing;