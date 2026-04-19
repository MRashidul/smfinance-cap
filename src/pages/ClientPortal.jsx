import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEntryByRef, getEntriesByClientId } from "../lib/store";
import { getSession, clearSession } from "../lib/auth";
import QRDisplay from "../components/shared/QRDisplay";
import { format } from "date-fns";

const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

export default function ClientPortal() {
  const { ref } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const session = getSession();

  useEffect(() => {
    const load = async () => {
      try {
        const e = await getEntryByRef(ref?.toUpperCase());

        if (!e) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setEntry(e);

        const all = await getEntriesByClientId(e.client_id);
        setAllEntries(all);

        setLoading(false);
      } catch (err) {
        setNotFound(true);
        setLoading(false);
      }
    };

    load();
  }, [ref]);

  const fmtDate = (d) => {
    try {
      return format(new Date(d), "d MMM yyyy");
    } catch {
      return d;
    }
  };
  const qrData = entry ? `${SITE_URL}/entry/${entry.ref}` : "";

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#4a3e1a",
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
          className="pulse"
        >
          Loading your entry...
        </div>
      </div>
    );

  if (notFound)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <div
            style={{
              fontSize: 36,
              color: "#1e1a0e",
              fontFamily: "'Cormorant Garamond', serif",
              marginBottom: 12,
            }}
          >
            Entry not found
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#3a2e10",
              lineHeight: 1.6,
              marginBottom: 20,
            }}
          >
            We couldn't find entry "{ref}". Please check your token or contact
            SM Finance.
          </div>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 12,
              color: "#5a4e2a",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ← Back to login
          </button>
        </div>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto", paddingBottom: "3rem" }}>
        {/* Header */}
        <div
          style={{
            background: "#0a0a0a",
            borderBottom: "0.5px solid #1a1500",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: "#b8922a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 500,
                color: "#1a1000",
              }}
            >
              SMF
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#d4b050",
                  letterSpacing: "0.06em",
                }}
              >
                SM Finance
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#4a3e1a",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Client appreciation programme
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 11,
              color: "#3a2e10",
              background: "none",
              border: "0.5px solid #1e1a0e",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Sign out
          </button>
        </div>

        {/* Hero */}
        <div style={{ padding: "28px 20px 0" }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#5a4e2a",
              marginBottom: 4,
            }}
          >
            Welcome
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: "#e8c96b",
              fontFamily: "'Cormorant Garamond', serif",
              marginBottom: 2,
            }}
          >
            {entry.client_name}
          </div>
          <div style={{ fontSize: 12, color: "#4a3e1a", marginBottom: 24 }}>
            Client ID: {entry.client_id}
          </div>

          {/* Token */}
          <div
            style={{
              background: "#111",
              border: "1px solid #2a2010",
              borderRadius: 14,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "#e8c96b",
                marginBottom: 2,
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              {entry.ref}
            </div>
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#5a4e2a",
                marginBottom: 14,
              }}
            >
              Annual prize draw entry · CAP 2026
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {[
                ["Product", entry.product],
                ["Completed", fmtDate(entry.completion_date)],
                ["Programme", "CAP 2026"],
                ["Draw date", "Jan 2027"],
              ].map(([l, v]) => (
                <div key={l}>
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#4a3e1a",
                    }}
                  >
                    {l}
                  </div>
                  <div
                    style={{ fontSize: 12, fontWeight: 500, color: "#c9a227" }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                height: "0.5px",
                background: "#1e1a0e",
                marginBottom: 14,
              }}
            />
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <QRDisplay data={qrData} size={72} />
              <div style={{ fontSize: 11, color: "#4a3e1a", lineHeight: 1.6 }}>
                Your unique entry QR code.
                <br />
                Show at the Annual Dinner
                <br />
                to confirm attendance.
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div
          style={{
            margin: "0 20px 24px",
            background: "#111",
            border: "0.5px solid #1e1a0e",
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: entry.checked_in ? "#4a8aaa" : "#3b6d11",
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 13, color: "#c0b090" }}>
              {entry.checked_in
                ? "Checked in for the Annual Dinner"
                : allEntries.length > 1
                  ? `${allEntries.length} entries confirmed — great position`
                  : "Your entry is confirmed and active"}
            </div>
            <div style={{ fontSize: 11, color: "#4a3e1a", marginTop: 1 }}>
              Draw: January 2027 · Annual Dinner, London
            </div>
          </div>
        </div>

        {/* All entries */}
        <div style={{ padding: "0 20px", marginBottom: 28 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#4a3e1a",
              marginBottom: 12,
            }}
          >
            Your draw entries
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {allEntries.map((e) => (
              <div
                key={e.ref}
                style={{
                  background: "#111",
                  border: "0.5px solid #1e1a0e",
                  borderRadius: 10,
                  padding: "12px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#c9a227",
                      fontFamily: "monospace",
                    }}
                  >
                    {e.ref}
                  </div>
                  <div style={{ fontSize: 11, color: "#4a3e1a", marginTop: 2 }}>
                    {e.product} · {fmtDate(e.completion_date)}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    padding: "3px 8px",
                    borderRadius: 4,
                    background:
                      e.entry_type === "referral" ? "#1a1400" : "#0f1f0f",
                    color: e.entry_type === "referral" ? "#c9a227" : "#4a9a4a",
                    border: `0.5px solid ${e.entry_type === "referral" ? "#2a2010" : "#1a4a1a"}`,
                  }}
                >
                  {e.entry_type === "referral" ? "Referral" : "Active"}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "#3a2e10",
              textAlign: "center",
            }}
          >
            Each completed transaction earns an additional entry.
          </div>
        </div>

        {/* Prize */}
        <div style={{ padding: "0 20px", marginBottom: 28 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#4a3e1a",
              marginBottom: 12,
            }}
          >
            This year's prize
          </div>
          <div
            style={{
              background: "#111",
              border: "0.5px solid #2a2010",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#0d0d0d",
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "0.5px solid #1e1a0e",
              }}
            >
              <svg width="190" height="76" viewBox="0 0 190 76" fill="none">
                <rect
                  x="18"
                  y="34"
                  width="154"
                  height="22"
                  rx="5"
                  fill="#111"
                  stroke="#b8922a"
                  strokeWidth="0.75"
                />
                <path
                  d="M38 34 L54 14 L136 14 L152 34"
                  fill="#0d0d0d"
                  stroke="#b8922a"
                  strokeWidth="0.75"
                />
                <rect
                  x="58"
                  y="16"
                  width="30"
                  height="16"
                  rx="2"
                  fill="#0a0a0a"
                  stroke="#c9a227"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
                <rect
                  x="100"
                  y="16"
                  width="30"
                  height="16"
                  rx="2"
                  fill="#0a0a0a"
                  stroke="#c9a227"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
                <circle
                  cx="54"
                  cy="58"
                  r="10"
                  fill="#111"
                  stroke="#b8922a"
                  strokeWidth="1.5"
                />
                <circle
                  cx="54"
                  cy="58"
                  r="5"
                  fill="#1a1400"
                  stroke="#c9a227"
                  strokeWidth="0.75"
                />
                <circle
                  cx="136"
                  cy="58"
                  r="10"
                  fill="#111"
                  stroke="#b8922a"
                  strokeWidth="1.5"
                />
                <circle
                  cx="136"
                  cy="58"
                  r="5"
                  fill="#1a1400"
                  stroke="#c9a227"
                  strokeWidth="0.75"
                />
              </svg>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: "#e8c96b",
                  fontFamily: "'Cormorant Garamond', serif",
                  marginBottom: 2,
                }}
              >
                Mercedes S Class
              </div>
              <div style={{ fontSize: 12, color: "#5a4e2a", marginBottom: 8 }}>
                Or cash alternative of equal value
              </div>
              <div
                style={{
                  display: "inline-block",
                  background: "#1a1400",
                  border: "1px solid #2e2010",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: 12,
                  color: "#c9a227",
                }}
              >
                Worth up to £100,000
              </div>
            </div>
          </div>
        </div>

        {/* Refer */}
        <div style={{ padding: "0 20px", marginBottom: 28 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#4a3e1a",
              marginBottom: 12,
            }}
          >
            Earn more entries
          </div>
          <div
            style={{
              background: "#111",
              border: "0.5px solid #2a2010",
              borderRadius: 14,
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 400,
                color: "#d4b050",
                fontFamily: "'Cormorant Garamond', serif",
                marginBottom: 6,
              }}
            >
              Refer a friend or colleague
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#5a4e2a",
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              When someone you refer completes a qualifying finance transaction
              through SM Finance, you both earn an additional draw entry.
            </div>
            <button
              className="btn-gold"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                fontSize: 13,
              }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "SM Finance CAP",
                    text: "I've been entered into the SM Finance Annual Prize Draw — a Mercedes S Class worth up to £100,000!",
                    url: "https://smfinance.co.uk",
                  });
                } else {
                  alert(
                    "Share link: https://smfinance.co.uk\n\nTell your friend to mention your name when contacting SM Finance.",
                  );
                }
              }}
            >
              Share with a friend
            </button>
          </div>
        </div>

        {/* Annual Dinner */}
        <div style={{ padding: "0 20px", marginBottom: 28 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#4a3e1a",
              marginBottom: 12,
            }}
          >
            Annual Dinner
          </div>
          <div
            style={{
              background: "#111",
              border: "0.5px solid #2a2010",
              borderRadius: 14,
              padding: 16,
              display: "flex",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#1a1400",
                border: "0.5px solid #2a2010",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <rect
                  x="2"
                  y="5"
                  width="18"
                  height="15"
                  rx="2"
                  stroke="#b8922a"
                  strokeWidth="1.2"
                />
                <line
                  x1="2"
                  y1="9"
                  x2="20"
                  y2="9"
                  stroke="#b8922a"
                  strokeWidth="1"
                />
                <line
                  x1="7"
                  y1="2"
                  x2="7"
                  y2="7"
                  stroke="#b8922a"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <line
                  x1="15"
                  y1="2"
                  x2="15"
                  y2="7"
                  stroke="#b8922a"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#d4b050",
                  marginBottom: 4,
                }}
              >
                You are invited
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#5a4e2a",
                  lineHeight: 1.5,
                  marginBottom: 8,
                }}
              >
                SM Finance Annual Client Appreciation Dinner — an evening of
                celebration, networking and the live prize draw.
              </div>
              <div
                style={{
                  display: "inline-block",
                  fontSize: 11,
                  color: "#b8922a",
                  border: "1px solid #2a2010",
                  borderRadius: 4,
                  padding: "3px 8px",
                  background: "#120f00",
                }}
              >
                January 2027 · London venue TBC
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px",
            borderTop: "0.5px solid #1a1500",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 10, color: "#2e2510", lineHeight: 1.7 }}>
            SM Finance is a trading style of Selina Manir Finance Ltd.
            <br />
            Authorised via 3Q Financial Services Ltd (FCA FRN: 930781).
            <br />
            <a href="https://smfinance.co.uk" style={{ color: "#3a2e10" }}>
              smfinance.co.uk
            </a>{" "}
            ·{" "}
            <a
              href="https://smfinance.co.uk/client-appreciation-programme/"
              style={{ color: "#3a2e10" }}
            >
              Full T&Cs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
