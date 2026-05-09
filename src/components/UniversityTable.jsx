import { useState } from "react";

function parseDeadline(raw) {
  if (!raw || String(raw).trim() === "") return null;
  const str = String(raw);
  const months = { january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11 };
  const m = str.match(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)/i);
  if (m) {
    const day = parseInt(m[1]), month = months[m[2].toLowerCase()];
    let year = new Date().getFullYear();
    let date = new Date(year, month, day);
    if (date < new Date()) date.setFullYear(year + 1);
    const diff = Math.ceil((date - new Date()) / 86400000);
    return { diff, label: `${m[1]} ${m[2]}` };
  }
  return null;
}

function DeadlineBadge({ raw }) {
  const allDates = String(raw || "").split(/\n/).map(s => s.trim()).filter(Boolean);
  const result = parseDeadline(String(raw || ""));

  if (!result) {
    return <span style={{ color: "#94a3b8", fontSize: 12 }}>{allDates.join(" · ") || "—"}</span>;
  }
  const { diff, label } = result;
  const color = diff < 0 ? "#f87171" : diff <= 14 ? "#fb923c" : diff <= 60 ? "#fbbf24" : "#34d399";
  const bg = diff < 0 ? "rgba(248,113,113,0.1)" : diff <= 14 ? "rgba(251,146,60,0.1)" : diff <= 60 ? "rgba(251,191,36,0.1)" : "rgba(52,211,153,0.1)";
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", background: bg, border: `1px solid ${color}44`, borderRadius: 10, padding: "5px 12px", minWidth: 85 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{diff < 0 ? "Closed" : diff === 0 ? "Today!" : `${diff}d left`}</span>
      <span style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>{label}</span>
    </div>
  );
}

function Badge({ val, trueColor = "#34d399", falseColor = "#fb923c" }) {
  const isGood = String(val || "").toLowerCase().includes("not required");
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: isGood ? trueColor : falseColor }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: isGood ? trueColor : falseColor, flexShrink: 0, display: "inline-block" }} />
      {isGood ? "Not req." : String(val || "").trim() || "Required"}
    </span>
  );
}

export default function UniversityTable({ universities, onViewMore }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...universities].sort((a, b) => {
    if (!sortKey) return 0;
    const va = String(a[sortKey] || ""), vb = String(b[sortKey] || "");
    return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const cols = [
    { label: "#", key: "S.No.", w: 40 },
    { label: "University", key: "University ", w: 200 },
    { label: "Course", key: "Course ", w: 160 },
    { label: "Language", key: "Course\nlanguage", w: 100 },
    { label: "Intake", key: "Intake", w: 110 },
    { label: "Fees", key: "Fees", w: 120 },
    { label: "IELTS", key: "IELTS\nScore", w: 90 },
    { label: "Deadline", key: "Application\n Deadline", w: 120 },
    { label: "GRE/GATE", key: "GRE/GATE \nRequirement", w: 100 },
    { label: "Work Exp.", key: "Work \nExperience", w: 100 },
    { label: "APS", key: "APS Requirement \nwith Application ", w: 80 },
    { label: "Apply Via", key: "Application\n Via", w: 120 },
    { label: "Actions", key: null, w: 120 },
  ];

  if (universities.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", border: "1px solid rgba(56,189,248,0.12)", borderRadius: 20, background: "#0c1220" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
        <p style={{ color: "#64748b", fontSize: 15 }}>No universities match your filters.</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#0c1220", border: "1px solid rgba(56,189,248,0.12)", borderRadius: 20, overflow: "hidden" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(56,189,248,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#64748b" }}>
          Showing <strong style={{ color: "#e2e8f0" }}>{universities.length}</strong> universities
        </span>
        <span style={{ fontSize: 12, color: "#64748b" }}>Click a row for full details</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead style={{ background: "rgba(0,0,0,0.4)" }}>
            <tr>
              {cols.map(({ label, key, w }) => (
                <th key={label}
                  onClick={() => key && handleSort(key)}
                  style={{
                    padding: "12px 14px", fontSize: 11, fontWeight: 700, color: sortKey === key ? "#38bdf8" : "#64748b",
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    cursor: key ? "pointer" : "default", whiteSpace: "nowrap",
                    userSelect: "none", textAlign: "left", minWidth: w,
                    borderBottom: "1px solid rgba(56,189,248,0.1)",
                  }}
                >
                  {label} {key && (sortKey === key ? (sortDir === "asc" ? "↑" : "↓") : "")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((u, idx) => {
              const website = String(u["Website \nLink"] || "").trim().split(/\s+/).find(s => s.startsWith("http"));
              const isEnglish = String(u["Course\nlanguage"] || "").toLowerCase().includes("english");

              return (
                <tr key={idx}
                  onClick={() => onViewMore(u)}
                  style={{ borderTop: "1px solid rgba(56,189,248,0.07)", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(56,189,248,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "13px 14px", color: "#64748b", fontSize: 12, verticalAlign: "top" }}>
                    {u["S.No."] || idx + 1}
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top", minWidth: 180 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#e2e8f0", lineHeight: 1.3 }}>{u["University "] || "—"}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{u["Location"] || ""}</div>
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top", minWidth: 150 }}>
                    <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.3 }}>{u["Course "] || "—"}</div>
                    {u["No of \nSem"] && <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{u["No of \nSem"]} semesters</div>}
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top" }}>
                    <span style={{
                      display: "inline-block", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 8,
                      background: isEnglish ? "rgba(56,189,248,0.1)" : "rgba(251,191,36,0.1)",
                      color: isEnglish ? "#38bdf8" : "#fbbf24",
                      border: `1px solid ${isEnglish ? "rgba(56,189,248,0.25)" : "rgba(251,191,36,0.25)"}`,
                    }}>
                      {String(u["Course\nlanguage"] || "—").replace(/\n/g, " ")}
                    </span>
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top", fontSize: 13, color: "#94a3b8" }}>
                    {String(u["Intake"] || "—").replace(/\n/g, " & ")}
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top", minWidth: 110 }}>
                    {u["Fees"] && String(u["Fees"]).trim()
                      ? <span style={{ color: "#fb923c", fontWeight: 600, fontSize: 13 }}>{String(u["Fees"]).trim()}</span>
                      : <span style={{ color: "#34d399", fontWeight: 600, fontSize: 13 }}>Free</span>}
                    {u["Semester\nContributions"] && String(u["Semester\nContributions"]).trim() &&
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>+{String(u["Semester\nContributions"]).trim()}</div>}
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top" }}>
                    {u["IELTS\nScore"] ? (
                      <span style={{ display: "inline-block", background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.25)", borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 600, color: "#818cf8" }}>
                        {String(u["IELTS\nScore"]).trim()}
                      </span>
                    ) : <span style={{ color: "#64748b", fontSize: 12 }}>—</span>}
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top" }}>
                    <DeadlineBadge raw={u["Application\n Deadline"]} />
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top" }}>
                    <Badge val={u["GRE/GATE \nRequirement"]} />
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top" }}>
                    <Badge val={u["Work \nExperience"]} />
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top" }}>
                    {String(u["APS Requirement \nwith Application "] || "").toLowerCase().includes("required") &&
                     !String(u["APS Requirement \nwith Application "] || "").toLowerCase().includes("not required")
                      ? <span style={{ fontSize: 12, color: "#fb923c", fontWeight: 600 }}>Required</span>
                      : <span style={{ fontSize: 12, color: "#34d399" }}>Not req.</span>}
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top" }}>
                    <span style={{ fontSize: 12, color: String(u["Application\n Via"] || "").toLowerCase().includes("uniassist") ? "#fbbf24" : "#94a3b8", fontWeight: 600 }}>
                      {u["Application\n Via"] || "—"}
                    </span>
                  </td>
                  <td style={{ padding: "13px 14px", verticalAlign: "top" }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 7 }}>
                      {website && (
                        <a href={website} target="_blank" rel="noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 8, padding: "5px 10px", fontSize: 12, color: "#34d399", textDecoration: "none", fontWeight: 600 }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(52,211,153,0.2)"}
                          onMouseLeave={e => e.currentTarget.style.background = "rgba(52,211,153,0.1)"}
                        >↗ Visit</a>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); onViewMore(u); }}
                        style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: 8, padding: "5px 10px", fontSize: 12, color: "#38bdf8", cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(56,189,248,0.2)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(56,189,248,0.1)"}
                      >ℹ Details</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
