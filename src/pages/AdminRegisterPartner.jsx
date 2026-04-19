import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPartner, PARTNER_TYPES } from "../lib/store";
import { downloadPartnerToken } from "../lib/pdf";
import PartnerTokenCard from "../components/shared/PartnerTokenCard";
import QRDisplay from "../components/shared/QRDisplay";

const today = () => new Date().toISOString().split("T")[0];
const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

export default function AdminRegisterPartner() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    firm: "",
    type: "solicitor",
    email: "",
    phone: "",
    city: "",
    registration_date: today(),
  });
  const [generated, setGenerated] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // const handleRegister = () => {
  //   if (!form.name.trim()) { alert('Please enter partner name.'); return }
  //   setGenerated(createPartner(form))
  // }
  const handleRegister = async () => {
    if (!form.name.trim()) {
      alert("Please enter partner name.");
      return;
    }

    // generate ID like REF-2026-001
    const id = `REF-2026-${Date.now()}`;

    const payload = {
      ...form,
      id,
      status: "active",
    };

    const partner = await createPartner(payload);

    setGenerated(partner);
  };

  const handleDownload = async () => {
    if (!generated) return;
    setDownloading(true);
    try {
      await downloadPartnerToken(generated, SITE_URL);
    } catch (e) {
      alert("Download failed: " + e.message);
    }
    setDownloading(false);
  };

  const qrData = generated ? `${SITE_URL}/partner/${generated.id}` : "";

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
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
          Register referral partner
        </h1>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        <div className="card">
          <div className="section-title">Partner details</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <label className="label">Contact name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. James Okafor"
              />
            </div>
            <div>
              <label className="label">Firm / organisation</label>
              <input
                className="input"
                value={form.firm}
                onChange={(e) => set("firm", e.target.value)}
                placeholder="e.g. Okafor & Co"
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <label className="label">Partner type</label>
              <select
                className="input"
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
              >
                {Object.entries(PARTNER_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="partner@firm.co.uk"
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input
                className="input"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="07700 000000"
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <label className="label">Town / city</label>
              <input
                className="input"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="e.g. Ilford"
              />
            </div>
            <div>
              <label className="label">Registration date</label>
              <input
                className="input"
                type="date"
                value={form.registration_date}
                onChange={(e) => set("registration_date", e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-gold" onClick={handleRegister}>
              Register & generate token
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                setForm({
                  name: "",
                  firm: "",
                  type: "solicitor",
                  email: "",
                  phone: "",
                  city: "",
                  registration_date: today(),
                });
                setGenerated(null);
              }}
            >
              Clear
            </button>
          </div>
        </div>
        <div>
          {generated ? (
            <div className="fade-in">
              <div className="section-title">Partner token</div>
              <div style={{ marginBottom: "1.5rem" }}>
                <PartnerTokenCard partner={generated} />
              </div>
              <div className="section-title">Master QR code</div>
              <div style={{ marginBottom: 10 }}>
                <QRDisplay data={qrData} color="#c8c8c8" label={generated.id} />
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#3a2e10",
                  marginBottom: "1rem",
                  lineHeight: 1.6,
                }}
              >
                Partner portal:{" "}
                <span
                  style={{
                    color: "#5a5a5a",
                    fontFamily: "monospace",
                    fontSize: 10,
                  }}
                >
                  {qrData}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  className="btn-gold"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? "Generating..." : "Download token (PNG)"}
                </button>
                <button
                  className="btn-ghost"
                  onClick={() =>
                    alert("Email sending requires Resend API key — see README.")
                  }
                >
                  Email to partner
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => navigate("/admin/partners")}
                >
                  Back to partners
                </button>
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: "#3a2e10" }}>
                Download saves a print-ready PNG token card.
              </div>
            </div>
          ) : (
            <div
              className="card"
              style={{ textAlign: "center", padding: "3rem 2rem" }}
            >
              <div
                style={{
                  fontSize: 28,
                  color: "#1e1a0e",
                  marginBottom: 12,
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                REF-2026-—
              </div>
              <div style={{ fontSize: 13, color: "#3a2e10" }}>
                Fill in the form and click Register
                <br />
                to generate a master referral token
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
