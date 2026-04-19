import React, { useState, useEffect } from "react";
import {
  getReferrals,
  getPartners,
  createReferral,
  getEntries,
  PARTNER_TYPES,
} from "../lib/store";
import { format } from "date-fns";

const today = () => new Date().toISOString().split("T")[0];

export default function AdminReferralLog() {
  const [referrals, setReferrals] = useState([]);
  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    partner_id: "",
    entry_ref: "",
    client_name: "",
    referral_date: today(),
  });

  const reload = async () => {
    const referralsData = await getReferrals();
    const partnersData = await getPartners();

    setReferrals(referralsData);
    setPartners(partnersData);
  };

  useEffect(() => {
    reload();
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleLog = () => {
    if (!form.partner_id || !form.entry_ref) {
      alert("Partner and entry ref are required.");
      return;
    }
    createReferral({ ...form, status: "completed" });
    setForm({
      partner_id: "",
      entry_ref: "",
      client_name: "",
      referral_date: today(),
    });
    setShowForm(false);
    reload();
  };

  const fmtDate = (d) => {
    try {
      return format(new Date(d), "d MMM yyyy");
    } catch {
      return d;
    }
  };

  const filtered = referrals.filter((r) => {
    const p = partners.find((x) => x.id === r.partner_id) || {};
    const s = search.toLowerCase();
    const matchS =
      !s ||
      (p.name || "").toLowerCase().includes(s) ||
      r.entry_ref?.toLowerCase().includes(s) ||
      r.client_name?.toLowerCase().includes(s);
    const matchT = !typeFilter || p.type === typeFilter;
    return matchS && matchT;
  });

  const exportCSV = () => {
    const rows = [
      [
        "Partner ID",
        "Partner name",
        "Firm",
        "Type",
        "Client name",
        "Entry ref",
        "Date",
        "Status",
      ],
    ];
    filtered.forEach((r) => {
      const p = partners.find((x) => x.id === r.partner_id) || {};
      rows.push([
        r.partner_id,
        p.name || "",
        p.firm || "",
        PARTNER_TYPES[p.type] || "",
        r.client_name || "",
        r.entry_ref || "",
        r.referral_date,
        r.status,
      ]);
    });
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "CAP-2026-referrals.csv";
    a.click();
  };

  return (
    <div className="fade-in">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#4a3e1a",
              marginBottom: 4,
            }}
          >
            Partners
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 400,
              color: "#e8c96b",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Referral log
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "+ Log referral"}
          </button>
          <button className="btn-ghost" onClick={exportCSV}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Log form */}
      {showForm && (
        <div className="card fade-in" style={{ marginBottom: "1.5rem" }}>
          <div className="section-title">Log a referral</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <label className="label">Partner</label>
              <select
                className="input"
                value={form.partner_id}
                onChange={(e) => set("partner_id", e.target.value)}
              >
                <option value="">Select partner...</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Client entry ref</label>
              <input
                className="input"
                value={form.entry_ref}
                onChange={(e) => set("entry_ref", e.target.value)}
                placeholder="CAP-2026-00001"
              />
            </div>
            <div>
              <label className="label">Client name</label>
              <input
                className="input"
                value={form.client_name}
                onChange={(e) => set("client_name", e.target.value)}
                placeholder="e.g. Amir Hassan"
              />
            </div>
            <div>
              <label className="label">Referral date</label>
              <input
                className="input"
                type="date"
                value={form.referral_date}
                onChange={(e) => set("referral_date", e.target.value)}
              />
            </div>
          </div>
          <button className="btn-gold" onClick={handleLog}>
            Save referral
          </button>
        </div>
      )}

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          className="input"
          style={{ maxWidth: 260 }}
          placeholder="Search partner, client or entry ref..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input"
          style={{ width: 160 }}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All partner types</option>
          {Object.entries(PARTNER_TYPES).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <div style={{ marginLeft: "auto", fontSize: 12, color: "#4a3e1a" }}>
          {filtered.length} referrals
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div
          style={{ padding: "12px 16px", borderBottom: "0.5px solid #1e1a0e" }}
        >
          <div
            className="trow trow-header"
            style={{
              gridTemplateColumns: "130px 1fr 130px 90px 85px 80px",
              border: "none",
              padding: 0,
            }}
          >
            <span>Partner ID</span>
            <span>Partner</span>
            <span>Client / entry</span>
            <span>Type</span>
            <span>Date</span>
            <span>Status</span>
          </div>
        </div>
        <div style={{ maxHeight: 440, overflowY: "auto", padding: "0 16px" }}>
          {filtered.length === 0 && (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "#3a2e10",
                fontSize: 13,
              }}
            >
              No referrals logged yet
            </div>
          )}
          {filtered.map((r) => {
            const p = partners.find((x) => x.id === r.partner_id) || {
              name: "Unknown",
              type: "partner",
              firm: "",
            };
            return (
              <div
                key={r.id}
                className="trow"
                style={{
                  gridTemplateColumns: "130px 1fr 130px 90px 85px 80px",
                }}
              >
                <span
                  style={{
                    fontWeight: 500,
                    color: "#8a8a8a",
                    fontFamily: "monospace",
                    fontSize: 12,
                  }}
                >
                  {r.partner_id}
                </span>
                <span style={{ color: "#c0b090" }}>
                  {p.name}
                  {p.firm && (
                    <span
                      style={{
                        color: "#3a2e10",
                        fontSize: 11,
                        display: "block",
                      }}
                    >
                      {p.firm}
                    </span>
                  )}
                </span>
                <span style={{ color: "#7a6a3a", fontSize: 12 }}>
                  {r.client_name || "—"}
                  {r.entry_ref && (
                    <span
                      style={{
                        color: "#3a2e10",
                        fontSize: 11,
                        display: "block",
                        fontFamily: "monospace",
                      }}
                    >
                      {r.entry_ref}
                    </span>
                  )}
                </span>
                <span>
                  <span className={`badge badge-${p.type}`}>
                    {PARTNER_TYPES[p.type] || p.type}
                  </span>
                </span>
                <span style={{ color: "#5a4e2a", fontSize: 12 }}>
                  {fmtDate(r.referral_date)}
                </span>
                <span>
                  <span className="badge badge-active">{r.status}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
