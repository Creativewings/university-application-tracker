import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import DashboardCards from "./components/DashboardCards";
import Filters from "./components/Filters";
import UniversityTable from "./components/UniversityTable";
import UniversityModal from "./components/UniversityModal";

export default function App() {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [filters, setFilters] = useState({
    language: "", location: "", fees: "", intake: "", aps: "", workExp: "", greGate: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("universities_v2");
    if (saved) {
      try { setUniversities(JSON.parse(saved)); } catch(e) {}
    }
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      const clean = json.filter(u => u["University "] && String(u["University "]).trim() !== "");
      setUniversities(clean);
      localStorage.setItem("universities_v2", JSON.stringify(clean));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      const s = search.toLowerCase();
      const matchSearch = !s || [u["University "], u["Course "], u["Location"]]
        .some(v => String(v || "").toLowerCase().includes(s));
      return (
        matchSearch &&
        (!filters.language || String(u["Course\nlanguage"] || "").toLowerCase().includes(filters.language.toLowerCase())) &&
        (!filters.location || String(u["Location"] || "").toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.fees || String(u["Fees"] || "").toLowerCase().includes(filters.fees.toLowerCase())) &&
        (!filters.intake || String(u["Intake"] || "").toLowerCase().includes(filters.intake.toLowerCase())) &&
        (!filters.aps || String(u["APS Requirement \nwith Application "] || "").toLowerCase().includes(filters.aps.toLowerCase())) &&
        (!filters.workExp || String(u["Work \nExperience"] || "").toLowerCase().includes(filters.workExp.toLowerCase())) &&
        (!filters.greGate || String(u["GRE/GATE \nRequirement"] || "").toLowerCase().includes(filters.greGate.toLowerCase()))
      );
    });
  }, [universities, filters, search]);

  const clearAll = () => {
    setFilters({ language: "", location: "", fees: "", intake: "", aps: "", workExp: "", greGate: "" });
    setSearch("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060a12", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Grid bg */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div style={{ position: "fixed", top: -200, left: -200, width: 600, height: 600, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)" }} />
      <div style={{ position: "fixed", bottom: -200, right: -200, width: 600, height: 600, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>

        {/* HEADER */}
        <header style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo + Title */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0, background: "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(129,140,248,0.18))", border: "1px solid rgba(56,189,248,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🎓</div>
              <div>
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(20px, 4vw, 34px)", lineHeight: 1.1, color: "#e2e8f0" }}>
                  German University <span style={{ color: "#38bdf8" }}>Tracker</span>
                </h1>
                <p style={{ color: "#64748b", marginTop: 5, fontSize: 13 }}>
                  {universities.length > 0
                    ? `Tracking ${universities.length} universities · ${filteredUniversities.length} matching`
                    : "Upload your Excel to start tracking"}
                </p>
              </div>
            </div>

            {/* Right side controls */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <input
                placeholder="🔍  Search university, course, city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: "#0c1220", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 12, padding: "10px 16px", color: "#e2e8f0", fontSize: 14, outline: "none", width: 260, fontFamily: "'DM Sans', sans-serif" }}
              />

              {/* Customization button */}
              <button
                onClick={() => setShowContact(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "linear-gradient(135deg, rgba(129,140,248,0.15), rgba(56,189,248,0.15))",
                  border: "1px solid rgba(129,140,248,0.3)", borderRadius: 12,
                  padding: "10px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600,
                  color: "#818cf8", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg, rgba(129,140,248,0.25), rgba(56,189,248,0.25))"}
                onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg, rgba(129,140,248,0.15), rgba(56,189,248,0.15))"}
              >
                ✦ Customization
              </button>

              <label style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.15))", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 12, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#38bdf8", whiteSpace: "nowrap" }}
                onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg, rgba(56,189,248,0.25), rgba(129,140,248,0.25))"}
                onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.15))"}
              >
                {uploading ? "⏳ Uploading…" : `⬆ ${universities.length > 0 ? "Re-upload" : "Upload"} Excel`}
                <input type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={handleUpload} />
              </label>
            </div>
          </div>
        </header>

        {/* EMPTY STATE */}
        {universities.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px", border: "2px dashed rgba(56,189,248,0.15)", borderRadius: 24, background: "rgba(56,189,248,0.02)" }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>📊</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#e2e8f0" }}>No Data Yet</h2>
            <p style={{ color: "#64748b", maxWidth: 360, margin: "0 auto 28px", fontSize: 15 }}>Upload your Excel sheet to populate the tracker with all your German university data.</p>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #38bdf8, #818cf8)", borderRadius: 12, padding: "13px 32px", cursor: "pointer", fontWeight: 700, color: "#060a12", fontSize: 15 }}>
              ⬆ Upload Excel File
              <input type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={handleUpload} />
            </label>
          </div>
        )}

        {universities.length > 0 && (
          <>
            <DashboardCards universities={filteredUniversities} allUniversities={universities} />
            <Filters filters={filters} setFilters={setFilters} universities={universities} onClear={clearAll} />
            <UniversityTable universities={filteredUniversities} onViewMore={setSelectedUniversity} />
          </>
        )}

        {selectedUniversity && (
          <UniversityModal university={selectedUniversity} onClose={() => setSelectedUniversity(null)} />
        )}

        {/* CONTACT / CUSTOMIZATION MODAL */}
        {showContact && (
          <div
            onClick={() => setShowContact(false)}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{ background: "#0c1220", border: "1px solid rgba(129,140,248,0.3)", borderRadius: 24, width: "100%", maxWidth: 420, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.7)" }}
            >
              {/* Modal header */}
              <div style={{ padding: "22px 26px", background: "linear-gradient(135deg, rgba(129,140,248,0.1), rgba(56,189,248,0.07))", borderBottom: "1px solid rgba(129,140,248,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#e2e8f0" }}>✦ Customization</h2>
                  <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Built with ❤️ by Ankur Ghosh</p>
                </div>
                <button
                  onClick={() => setShowContact(false)}
                  style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}
                >✕</button>
              </div>

              {/* Avatar + name */}
              <div style={{ padding: "28px 26px 20px", textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #38bdf8, #818cf8)", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, border: "3px solid rgba(129,140,248,0.3)" }}>
                  👨‍💻
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#e2e8f0" }}>Ankur Ghosh</h3>
                <p style={{ color: "#64748b", fontSize: 13, marginTop: 5 }}>Developer · Designer</p>
              </div>

              {/* Links */}
              <div style={{ padding: "0 26px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Email */}
                <a
                  href="mailto:ankurghosh13662@gmail.com"
                  style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 14, padding: "13px 16px", textDecoration: "none", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(56,189,248,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(56,189,248,0.06)"}
                >
                  <span style={{ fontSize: 20, width: 36, height: 36, borderRadius: 10, background: "rgba(56,189,248,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✉️</span>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</div>
                    <div style={{ fontSize: 14, color: "#38bdf8", fontWeight: 600, marginTop: 2 }}>ankurghosh13662@gmail.com</div>
                  </div>
                </a>

                {/* Portfolio */}
                <a
                  href="https://react-portfolio-xi-rust.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: 14, padding: "13px 16px", textDecoration: "none", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(129,140,248,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(129,140,248,0.06)"}
                >
                  <span style={{ fontSize: 20, width: 36, height: 36, borderRadius: 10, background: "rgba(129,140,248,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🌐</span>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Portfolio</div>
                    <div style={{ fontSize: 14, color: "#818cf8", fontWeight: 600, marginTop: 2 }}>Visit On Vercel</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 16, color: "#64748b" }}>↗</span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/ankur-ghosh-9089a5314/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: 14, padding: "13px 16px", textDecoration: "none", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(52,211,153,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(52,211,153,0.06)"}
                >
                  <span style={{ fontSize: 20, width: 36, height: 36, borderRadius: 10, background: "rgba(52,211,153,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>💼</span>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>LinkedIn</div>
                    <div style={{ fontSize: 14, color: "#34d399", fontWeight: 600, marginTop: 2 }}>Visit On LinkedIn</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 16, color: "#64748b" }}>↗</span>
                </a>
              </div>

              {/* Footer note */}
              <div style={{ padding: "14px 26px", borderTop: "1px solid rgba(56,189,248,0.08)", textAlign: "center" }}>
                <p style={{ fontSize: 12, color: "#64748b" }}>German University Tracker · v3.0</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
