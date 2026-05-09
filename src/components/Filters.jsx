export default function Filters({ filters, setFilters, universities, onClear }) {
  const getUnique = (key) =>
    [...new Set(universities.map(u => u[key]).filter(Boolean))].sort();

  const hasActive = Object.values(filters).some(Boolean);

  const Field = ({ label, filterKey, overrideOptions }) => {
    const options = overrideOptions || getUnique(filterKey);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          {label}
        </label>
        <select
          value={filters[filterKey]}
          onChange={e => setFilters({ ...filters, [filterKey]: e.target.value })}
          style={{
            background: "#111827",
            border: `1px solid ${filters[filterKey] ? "rgba(56,189,248,0.4)" : "rgba(56,189,248,0.12)"}`,
            borderRadius: 10, padding: "9px 32px 9px 12px",
            color: "#e2e8f0", fontSize: 13, outline: "none", width: "100%",
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            appearance: "none", WebkitAppearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
          }}
        >
          <option value="" style={{ background: "#111827", color: "#e2e8f0" }}>All {label}</option>
          {options.map((v, i) => (
            <option key={i} value={v} style={{ background: "#111827", color: "#e2e8f0" }}>{String(v).replace(/\n/g, " ")}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div style={{ background: "#0c1220", border: "1px solid rgba(56,189,248,0.12)", borderRadius: 20, padding: "18px 22px", marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>⚙️</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#e2e8f0" }}>Smart Filters</span>
          {hasActive && (
            <span style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 20, padding: "2px 10px", fontSize: 11, color: "#38bdf8", fontWeight: 600 }}>
              Active
            </span>
          )}
        </div>
        {hasActive && (
          <button onClick={onClear} style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 8, padding: "6px 12px", color: "#f87171", fontSize: 13,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>✕ Clear All</button>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 12 }}>
        <Field label="Language" filterKey="language" overrideOptions={getUnique("Course\nlanguage")} />
        <Field label="Location" filterKey="location" overrideOptions={getUnique("Location")} />
        <Field label="Fees" filterKey="fees" overrideOptions={getUnique("Fees")} />
        <Field label="Intake" filterKey="intake" overrideOptions={getUnique("Intake")} />
        <Field label="Work Exp." filterKey="workExp" overrideOptions={getUnique("Work \nExperience")} />
        <Field label="GRE / GATE" filterKey="greGate" overrideOptions={getUnique("GRE/GATE \nRequirement")} />
        <Field label="APS Req." filterKey="aps" overrideOptions={getUnique("APS Requirement \nwith Application ")} />
      </div>
    </div>
  );
}
