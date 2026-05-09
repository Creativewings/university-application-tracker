export default function DashboardCards({ universities, allUniversities }) {
  const englishCount = universities.filter(u => String(u["Course\nlanguage"] || "").toLowerCase().includes("english")).length;
  const freeCount = universities.filter(u => !u["Fees"] || String(u["Fees"]).trim() === "").length;
  const apsRequired = universities.filter(u =>
    String(u["APS Requirement \nwith Application "] || "").toLowerCase().includes("required") &&
    !String(u["APS Requirement \nwith Application "] || "").toLowerCase().includes("not required")
  ).length;
  const winterIntake = universities.filter(u => String(u["Intake"] || "").toLowerCase().includes("winter")).length;
  const noWorkExp = universities.filter(u => String(u["Work \nExperience"] || "").toLowerCase().includes("not required")).length;
  const noGRE = universities.filter(u => String(u["GRE/GATE \nRequirement"] || "").toLowerCase().includes("not required")).length;
  const uniAssist = universities.filter(u => String(u["Application\n Via"] || "").toLowerCase().includes("uniassist")).length;

  const cards = [
    { label: "Total Universities", value: universities.length, sub: `of ${allUniversities.length} total`, icon: "🎓", accent: "#38bdf8", bg: "rgba(56,189,248,0.07)", border: "rgba(56,189,248,0.2)" },
    { label: "English Programs", value: englishCount, sub: `${Math.round((englishCount/(universities.length||1))*100)}% of results`, icon: "🌐", accent: "#818cf8", bg: "rgba(129,140,248,0.07)", border: "rgba(129,140,248,0.2)" },
    { label: "No Tuition Fees", value: freeCount, sub: "Semester fee only", icon: "💸", accent: "#34d399", bg: "rgba(52,211,153,0.07)", border: "rgba(52,211,153,0.2)" },
    { label: "Winter Intake", value: winterIntake, sub: "Accept winter semester", icon: "❄️", accent: "#38bdf8", bg: "rgba(56,189,248,0.05)", border: "rgba(56,189,248,0.15)" },
    { label: "No Work Exp Req.", value: noWorkExp, sub: "Fresh graduates eligible", icon: "✅", accent: "#34d399", bg: "rgba(52,211,153,0.05)", border: "rgba(52,211,153,0.15)" },
    { label: "No GRE/GATE", value: noGRE, sub: "No entrance exam", icon: "📋", accent: "#fbbf24", bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.18)" },
    { label: "APS Required", value: apsRequired, sub: "Certificate needed", icon: "🏛️", accent: "#fb923c", bg: "rgba(251,146,60,0.06)", border: "rgba(251,146,60,0.18)" },
    { label: "Via UniAssist", value: uniAssist, sub: "Apply through portal", icon: "📤", accent: "#818cf8", bg: "rgba(129,140,248,0.06)", border: "rgba(129,140,248,0.15)" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(168px, 1fr))", gap: 14, marginBottom: 24 }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          background: card.bg, border: `1px solid ${card.border}`,
          borderRadius: 18, padding: "18px 20px",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "default",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 14px 32px -8px ${card.border}`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <div style={{ fontSize: 22, marginBottom: 10 }}>{card.icon}</div>
          <div style={{ fontSize: 34, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: card.accent, lineHeight: 1 }}>
            {card.value}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginTop: 6 }}>{card.label}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
