import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import DashboardCards from "./components/DashboardCards";
import Filters from "./components/Filters";
import UniversityTable from "./components/UniversityTable";
import UniversityModal from "./components/UniversityModal";

const C = {
  bg: "#060a12",
  surface: "#0c1220",
  border: "rgba(56,189,248,0.12)",
  borderBright: "rgba(56,189,248,0.28)",
  accent: "#38bdf8",
  accent2: "#818cf8",
  text: "#e2e8f0",
  muted: "#64748b",
  dim: "#94a3b8",
};

export default function App() {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
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
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      <div style={{ position: "fixed", top: -200, left: -200, width: 600, height: 600, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)" }} />
      <div style={{ position: "fixed", bottom: -200, right: -200, width: 600, height: 600, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>

        {/* HEADER */}
        <header style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo + Title */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(129,140,248,0.18))",
                border: "1px solid rgba(56,189,248,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
              }}>🎓</div>
              <div>
                <h1 style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: "clamp(20px, 4vw, 34px)", lineHeight: 1.1,
                  color: "#e2e8f0",
                }}>
                  German University{" "}
                  <span style={{ color: "#38bdf8" }}>Tracker</span>
                </h1>
                <p style={{ color: "#64748b", marginTop: 5, fontSize: 13 }}>
                  {universities.length > 0
                    ? `Tracking ${universities.length} universities · ${filteredUniversities.length} matching`
                    : "Upload your Excel to start tracking"}
                </p>
              </div>
            </div>

            {/* Search + Upload */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <input
                placeholder="🔍  Search university, course, city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  background: "#0c1220", border: "1px solid rgba(56,189,248,0.15)",
                  borderRadius: 12, padding: "10px 16px", color: "#e2e8f0",
                  fontSize: 14, outline: "none", width: 260,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <label style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.15))",
                border: "1px solid rgba(56,189,248,0.3)", borderRadius: 12,
                padding: "10px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600,
                color: "#38bdf8", whiteSpace: "nowrap",
              }}>
                {uploading ? "⏳ Uploading…" : `⬆ ${universities.length > 0 ? "Re-upload" : "Upload"} Excel`}
                <input type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={handleUpload} />
              </label>
            </div>
          </div>
        </header>

        {/* EMPTY STATE */}
        {universities.length === 0 && (
          <div style={{
            textAlign: "center", padding: "80px 20px",
            border: "2px dashed rgba(56,189,248,0.15)", borderRadius: 24,
            background: "rgba(56,189,248,0.02)",
          }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>📊</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 12, color: "#e2e8f0" }}>
              No Data Yet
            </h2>
            <p style={{ color: "#64748b", maxWidth: 360, margin: "0 auto 28px", fontSize: 15 }}>
              Upload your Excel sheet to populate the tracker with all your German university data.
            </p>
            <label style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              borderRadius: 12, padding: "13px 32px", cursor: "pointer",
              fontWeight: 700, color: "#060a12", fontSize: 15,
            }}>
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
      </div>
    </div>
  );
}
