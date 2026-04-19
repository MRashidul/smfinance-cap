import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, loginPartner, loginClient } from "../lib/auth";
import { getPartnerById, getEntryByRef } from "../lib/store";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("admin");
  const [fields, setFields] = useState({
    email: "",
    password: "",
    partnerId: "",
    entryRef: "",
    clientId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setFields((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 400));

    let result;

    if (role === "admin") {
      result = loginAdmin(fields.email, fields.password);
      if (result.success) navigate("/admin");
    } else if (role === "partner") {
      try {
        const partner = await getPartnerById(fields.partnerId.toUpperCase());
        result = loginPartner(fields.partnerId, fields.email, () => partner);
        if (result.success) navigate(`/partner/${result.session.partnerId}`);
      } catch {
        result = { success: false, error: "Partner ID not found." };
      }
    } else {
      try {
        const entry = await getEntryByRef(fields.entryRef.toUpperCase());
        result = loginClient(fields.entryRef, fields.clientId, () => entry);
        if (result.success) navigate(`/entry/${result.session.entryRef}`);
      } catch {
        result = { success: false, error: "Entry reference not found." };
      }
    }

    if (!result.success) setError(result.error);
    setLoading(false);
  };

  const roles = [
    { id: "admin", label: "Admin", sub: "SM Finance staff" },
    { id: "partner", label: "Partner", sub: "Referral partners" },
    { id: "client", label: "Client", sub: "Entry holders" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080806",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 13,
              background: "#b8922a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 500,
              color: "#1a1000",
              letterSpacing: "0.04em",
              margin: "0 auto 16px",
            }}
          >
            SMF
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: "#e8c96b",
              fontFamily: "'Cormorant Garamond', serif",
              marginBottom: 4,
            }}
          >
            Client Appreciation Programme
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#4a3e1a",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            SM Finance · CAP 2026
          </div>
        </div>

        {/* Role switcher */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 6,
            marginBottom: "1.5rem",
            background: "#0d0c0a",
            borderRadius: 12,
            padding: 4,
            border: "0.5px solid #1e1a0e",
          }}
        >
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setRole(r.id);
                setError("");
              }}
              style={{
                padding: "10px 8px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                background: role === r.id ? "#1a1400" : "transparent",
                borderBottom:
                  role === r.id ? "2px solid #b8922a" : "2px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: role === r.id ? "#e8c96b" : "#4a3e1a",
                }}
              >
                {r.label}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: role === r.id ? "#7a6a3a" : "#2a2510",
                  marginTop: 1,
                }}
              >
                {r.sub}
              </div>
            </button>
          ))}
        </div>

        {/* Login card */}
        <div
          style={{
            background: "#0d0c0a",
            border: "0.5px solid #2a2010",
            borderRadius: 16,
            padding: "1.75rem",
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#4a3e1a",
              marginBottom: 20,
            }}
          >
            Sign in as {roles.find((r) => r.id === role)?.label}
          </div>

          <form onSubmit={handleSubmit}>
            {role === "admin" && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#4a3e1a",
                      marginBottom: 6,
                    }}
                  >
                    Email address
                  </label>
                  <input
                    className="input"
                    type="email"
                    required
                    value={fields.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="admin@smfinance.co.uk"
                    autoComplete="email"
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#4a3e1a",
                      marginBottom: 6,
                    }}
                  >
                    Password
                  </label>
                  <input
                    className="input"
                    type="password"
                    required
                    value={fields.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="••••••••••"
                    autoComplete="current-password"
                  />
                </div>
              </>
            )}

            {role === "partner" && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#4a3e1a",
                      marginBottom: 6,
                    }}
                  >
                    Partner ID
                  </label>
                  <input
                    className="input"
                    required
                    value={fields.partnerId}
                    onChange={(e) => set("partnerId", e.target.value)}
                    placeholder="e.g. REF-2026-001"
                    autoComplete="off"
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#4a3e1a",
                      marginBottom: 6,
                    }}
                  >
                    Email on file
                  </label>
                  <input
                    className="input"
                    type="email"
                    required
                    value={fields.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="your@email.co.uk"
                    autoComplete="email"
                  />
                </div>
              </>
            )}

            {role === "client" && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#4a3e1a",
                      marginBottom: 6,
                    }}
                  >
                    Entry reference
                  </label>
                  <input
                    className="input"
                    required
                    value={fields.entryRef}
                    onChange={(e) => set("entryRef", e.target.value)}
                    placeholder="e.g. CAP-2026-00001"
                    autoComplete="off"
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#4a3e1a",
                      marginBottom: 6,
                    }}
                  >
                    Client ID
                  </label>
                  <input
                    className="input"
                    required
                    value={fields.clientId}
                    onChange={(e) => set("clientId", e.target.value)}
                    placeholder="e.g. SMF-10001"
                    autoComplete="off"
                  />
                </div>
              </>
            )}

            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  marginBottom: 16,
                  background: "#1f0f0f",
                  border: "0.5px solid #4a1a1a",
                  fontSize: 13,
                  color: "#cc6060",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 10,
                border: "none",
                background: loading ? "#5a4e1a" : "#b8922a",
                color: loading ? "#3a3010" : "#1a1000",
                fontSize: 14,
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.03em",
                fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.15s",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Demo hint */}
          <div
            style={{
              marginTop: 20,
              padding: "12px 14px",
              background: "#111",
              borderRadius: 8,
              border: "0.5px solid #1a1500",
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#3a2e10",
                marginBottom: 6,
              }}
            >
              Demo credentials
            </div>
            {role === "admin" && (
              <div
                style={{
                  fontSize: 11,
                  color: "#4a3e1a",
                  lineHeight: 1.7,
                  fontFamily: "monospace",
                }}
              >
                Email: admin@smfinance.co.uk
                <br />
                Password: SMF@admin2026
              </div>
            )}
            {role === "partner" && (
              <div
                style={{
                  fontSize: 11,
                  color: "#4a3e1a",
                  lineHeight: 1.7,
                  fontFamily: "monospace",
                }}
              >
                Partner ID: REF-2026-001
                <br />
                Email: sabbir@swmsolicitors.co.uk
              </div>
            )}
            {role === "client" && (
              <div
                style={{
                  fontSize: 11,
                  color: "#4a3e1a",
                  lineHeight: 1.7,
                  fontFamily: "monospace",
                }}
              >
                Entry ref: CAP-2026-00001
                <br />
                Client ID: SMF-10001
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: 10,
            color: "#2a2010",
            lineHeight: 1.7,
          }}
        >
          SM Finance is a trading style of Selina Manir Finance Ltd.
          <br />
          Authorised via 3Q Financial Services Ltd (FCA FRN: 930781).
        </div>
      </div>
    </div>
  );
}
