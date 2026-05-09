function InfoRow({ label, value, accent }) {
  if (!value || String(value).trim() === "") return null;
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(56,189,248,0.1)", borderRadius: 12, padding: "11px 14px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: accent || "#e2e8f0", fontWeight: accent ? 600 : 400, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {String(value).trim()}
      </div>
    </div>
  );
}

function Section({ icon, title, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 26, marginBottom: 12 }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, background: `${color}20`, border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{icon}</div>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#e2e8f0" }}>{title}</h3>
    </div>
  );
}

export default function UniversityModal({ university: u, onClose }) {
  const uniName = u["University "] || u["University"] || "University Details";
  const website = String(u["Website \nLink"] || "").trim().split(/\s+/).find(s => s.startsWith("http"));
  const docLines = String(u["Documents \nrequired"] || "").split(/\n|•/).map(d => d.replace(/^[•\-\*]\s*/, "").trim()).filter(d => d.length > 3);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0c1220", border: "1px solid rgba(56,189,248,0.25)", borderRadius: 24, width: "100%", maxWidth: 860, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.7)", marginBottom: 24 }}>

        {/* Header */}
        <div style={{ padding: "22px 26px", background: "linear-gradient(135deg, rgba(56,189,248,0.07), rgba(129,140,248,0.07))", borderBottom: "1px solid rgba(56,189,248,0.12)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎓</div>
              <div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(15px,3vw,21px)", lineHeight: 1.2, color: "#e2e8f0" }}>{uniName}</h2>
                <p style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>{u["Location"] || ""}{u["Course "] ? ` · ${u["Course "]}` : ""}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {u["Course\nlanguage"] && <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)", color: "#38bdf8" }}>🌐 {String(u["Course\nlanguage"]).replace(/\n/g, " ")}</span>}
              {u["Intake"] && <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)", color: "#fbbf24" }}>📅 {String(u["Intake"]).replace(/\n/g, " & ")}</span>}
              {u["Application\n Via"] && <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.25)", color: "#818cf8" }}>📤 {u["Application\n Via"]}</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {website && (
              <a href={website} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 10, padding: "8px 14px", fontSize: 13, color: "#34d399", textDecoration: "none", fontWeight: 700 }}>
                ↗ Visit Site
              </a>
            )}
            <button onClick={onClose} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 10, cursor: "pointer", color: "#f87171", fontSize: 16, fontFamily: "'DM Sans', sans-serif" }}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 26px", maxHeight: "68vh", overflowY: "auto" }}>

          <Section icon="🎓" title="Program Details" color="#38bdf8" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))", gap: 9 }}>
            <InfoRow label="Course" value={u["Course "]} />
            <InfoRow label="Duration" value={u["No of \nSem"] ? `${u["No of \nSem"]} Semesters` : ""} />
            <InfoRow label="Language" value={String(u["Course\nlanguage"] || "").replace(/\n/g, " ")} accent="#38bdf8" />
            <InfoRow label="Location" value={u["Location"]} />
            <InfoRow label="Intake" value={String(u["Intake"] || "").replace(/\n/g, " & ")} />
            <InfoRow label="Apply Via" value={u["Application\n Via"]} accent="#818cf8" />
            <InfoRow label="Bachelor's Accepted" value={u["Bachelors accepted \nfor this course"]} />
            <InfoRow label="German GPA Required" value={u["German GPA \nrequired"]} />
          </div>

          <Section icon="💸" title="Costs & Fees" color="#34d399" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))", gap: 9 }}>
            <InfoRow label="Tuition Fees" value={u["Fees"] && String(u["Fees"]).trim() ? u["Fees"] : "Free (No Tuition)"} accent={u["Fees"] && String(u["Fees"]).trim() ? "#fb923c" : "#34d399"} />
            <InfoRow label="Semester Contribution" value={u["Semester\nContributions"]} />
          </div>

          <Section icon="📅" title="Application Dates" color="#fbbf24" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))", gap: 9 }}>
            <InfoRow label="Application Start" value={String(u["Application \nStart Date"] || "").replace(/\n/g, " · ")} />
            <InfoRow label="Application Deadline" value={String(u["Application\n Deadline"] || "").replace(/\n/g, " · ")} accent="#fbbf24" />
          </div>

          <Section icon="📋" title="Admission Requirements" color="#818cf8" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))", gap: 9 }}>
            <InfoRow label="IELTS Score" value={u["IELTS\nScore"]} accent="#818cf8" />
            <InfoRow label="TOEFL Score" value={String(u["TOEFL \nScore"] || "").replace(/\n/g, " ")} />
            <InfoRow label="German Language" value={u["German Language\n Requirement"]} />
            <InfoRow label="GRE / GATE" value={u["GRE/GATE \nRequirement"]} />
            <InfoRow label="Work Experience" value={u["Work \nExperience"]} />
            <InfoRow label="APS Requirement" value={u["APS Requirement \nwith Application "]} accent="#fb923c" />
          </div>

          {docLines.length > 0 && (
            <>
              <Section icon="📄" title="Required Documents" color="#38bdf8" />
              <div style={{ background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 14, padding: "14px 18px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr))", gap: 6 }}>
                  {docLines.map((doc, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, lineHeight: 1.5, padding: "4px 0" }}>
                      <span style={{ flexShrink: 0, width: 19, height: 19, borderRadius: 6, background: "rgba(56,189,248,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#38bdf8", fontWeight: 700, marginTop: 1 }}>✓</span>
                      <span style={{ color: "#94a3b8" }}>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
