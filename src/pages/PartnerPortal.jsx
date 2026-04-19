import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPartnerById,
  getReferralsByPartner,
  PARTNER_TYPES,
} from "../lib/store";
import { getSession, clearSession } from "../lib/auth";
import { downloadPartnerToken } from "../lib/pdf";
import PartnerTokenCard from "../components/shared/PartnerTokenCard";
import QRDisplay from "../components/shared/QRDisplay";
import { format } from "date-fns";

const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

export default function PartnerPortal() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const session = getSession();

  useEffect(() => {
    const load = async () => {
      try {
        const p = await getPartnerById(partnerId?.toUpperCase());

        if (!p) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setPartner(p);

        const refs = await getReferralsByPartner(p.id);
        setReferrals(refs);

        setLoading(false);
      } catch (err) {
        setNotFound(true);
        setLoading(false);
      }
    };

    load();
  }, [partnerId]);

  const fmtDate = (d) => {
    try {
      return format(new Date(d), "d MMM yyyy");
    } catch {
      return d;
    }
  };
  const completed = referrals.filter((r) => r.status === "completed").length;
  const qrData = partner ? `${SITE_URL}/partner/${partner.id}` : "";

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  const handleDownload = async () => {
    if (!partner) return;
    setDownloading(true);
    try {
      await downloadPartnerToken(partner, SITE_URL);
    } catch (e) {
      alert("Download failed: " + e.message);
    }
    setDownloading(false);
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
            color: "#4a4a4a",
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
          className="pulse"
        >
          Loading partner portal...
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
              fontSize: 32,
              color: "#2a2a2a",
              fontFamily: "'Cormorant Garamond', serif",
              marginBottom: 12,
            }}
          >
            Partner not found
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#3a3a3a",
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            No partner matching "{partnerId}" was found. Please contact SM
            Finance.
          </div>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 12,
              color: "#5a5a5a",
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
            borderBottom: "0.5px solid #1a1a1a",
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
                background: "#5a5a5a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 500,
                color: "#1a1a1a",
              }}
            >
              SMF
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#c0c0c0",
                  letterSpacing: "0.06em",
                }}
              >
                SM Finance
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#4a4a4a",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Referral partner portal
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 11,
              color: "#3a3a3a",
              background: "none",
              border: "0.5px solid #1e1e1e",
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
        <div style={{ padding: "28px 20px 20px" }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#4a4a4a",
              marginBottom: 4,
            }}
          >
            Welcome
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 400,
              color: "#c8c8c8",
              fontFamily: "'Cormorant Garamond', serif",
              marginBottom: 2,
            }}
          >
            {partner.name}
          </div>
          <div style={{ fontSize: 12, color: "#4a4a4a", marginBottom: 24 }}>
            {partner.firm && `${partner.firm} · `}
            {PARTNER_TYPES[partner.type]}
          </div>

          {/* Token card */}
          <div style={{ marginBottom: 20 }}>
            <PartnerTokenCard partner={partner} />
          </div>

          {/* QR */}
          <div
            style={{
              background: "#0d0d0d",
              border: "0.5px solid #1e1e1e",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              gap: 14,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <QRDisplay data={qrData} color="#c0c0c0" bg="#0a0a0a" size={80} />
            <div>
              <div style={{ fontSize: 11, color: "#4a4a4a", marginBottom: 4 }}>
                Your master referral QR
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#5a5a5a",
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
              >
                Present this QR when referring a client to SM Finance. Each
                completed transaction earns you one draw entry.
              </div>
              <button
                onClick={handleDownload}
                disabled={downloading}
                style={{
                  fontSize: 11,
                  color: downloading ? "#3a3a3a" : "#8a8a8a",
                  background: "#111",
                  border: "0.5px solid #2a2a2a",
                  borderRadius: 6,
                  padding: "5px 12px",
                  cursor: downloading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {downloading ? "Generating..." : "Download token (PNG)"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ padding: "0 20px", marginBottom: 28 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 10,
            }}
          >
            {[
              ["Total referrals", referrals.length, "#c0c0c0"],
              ["Completed", completed, "#4a9a4a"],
              ["Draw entries", completed, "#b8922a"],
            ].map(([l, v, c]) => (
              <div
                key={l}
                style={{
                  background: "#111",
                  border: "0.5px solid #1e1e1e",
                  borderRadius: 10,
                  padding: "12px 14px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 300,
                    color: c,
                    fontFamily: "'Cormorant Garamond', serif",
                    marginBottom: 2,
                  }}
                >
                  {v}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#3a3a3a",
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div
          style={{
            margin: "0 20px 28px",
            background: "#111",
            border: "0.5px solid #1e1e1e",
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
              background: "#3b6d11",
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 13, color: "#a0a0a0" }}>
              {completed > 0
                ? `${completed} draw ${completed === 1 ? "entry" : "entries"} earned so far`
                : "No completed referrals yet this year"}
            </div>
            <div style={{ fontSize: 11, color: "#3a3a3a", marginTop: 1 }}>
              Draw: January 2027 · Annual Dinner, London
            </div>
          </div>
        </div>

        {/* Referral history */}
        <div style={{ padding: "0 20px", marginBottom: 28 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#4a4a4a",
              marginBottom: 12,
            }}
          >
            Referral history
          </div>
          {referrals.length === 0 ? (
            <div
              style={{
                background: "#111",
                border: "0.5px solid #1e1e1e",
                borderRadius: 10,
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 13, color: "#3a3a3a" }}>
                No referrals logged yet
              </div>
              <div style={{ fontSize: 12, color: "#2a2a2a", marginTop: 4 }}>
                When you refer a client and their transaction completes, it will
                appear here.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {referrals.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: "#111",
                    border: "0.5px solid #1e1e1e",
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
                        color: "#a0a0a0",
                      }}
                    >
                      {r.client_name || r.entry_ref}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#3a3a3a", marginTop: 2 }}
                    >
                      {fmtDate(r.referral_date)}
                      {r.entry_ref ? ` · ${r.entry_ref}` : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {r.status === "completed" && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "#b8922a",
                          background: "#1a1400",
                          border: "0.5px solid #2a2010",
                          borderRadius: 4,
                          padding: "2px 7px",
                        }}
                      >
                        +1 entry
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 10,
                        color: "#4a9a4a",
                        background: "#0f1f0f",
                        border: "0.5px solid #1a4a1a",
                        borderRadius: 4,
                        padding: "2px 7px",
                      }}
                    >
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How to refer */}
        <div style={{ padding: "0 20px", marginBottom: 28 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#4a4a4a",
              marginBottom: 12,
            }}
          >
            How to refer
          </div>
          <div
            style={{
              background: "#111",
              border: "0.5px solid #1e1e1e",
              borderRadius: 14,
              padding: 16,
            }}
          >
            {[
              [
                "Introduce your client",
                "Tell them about SM Finance and let them know you will be referring them.",
              ],
              [
                "Quote your partner ID",
                `When contacting SM Finance, quote your ID: ${partner.id}`,
              ],
              [
                "Transaction completes",
                "Once the finance completes, both you and your client earn a draw entry.",
              ],
              [
                "Attend the Annual Dinner",
                "You are eligible for the same prize. Join us in January 2027.",
              ],
            ].map(([title, desc], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  marginBottom: i < 3 ? 14 : 0,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "1px solid #2a2a2a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 500,
                    color: "#8a8a8a",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#a0a0a0",
                      marginBottom: 2,
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#4a4a4a", lineHeight: 1.5 }}
                  >
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ padding: "0 20px", marginBottom: 28 }}>
          <div
            style={{
              background: "#111",
              border: "0.5px solid #1e1e1e",
              borderRadius: 14,
              padding: 16,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 13, color: "#6a6a6a", marginBottom: 6 }}>
              Questions about the programme?
            </div>
            <a
              href="https://smfinance.co.uk/contact-us/"
              style={{ fontSize: 12, color: "#5a5a5a" }}
            >
              Contact SM Finance →
            </a>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px",
            borderTop: "0.5px solid #1a1a1a",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 10, color: "#2a2a2a", lineHeight: 1.7 }}>
            SM Finance is a trading style of Selina Manir Finance Ltd.
            <br />
            Authorised via 3Q Financial Services Ltd (FCA FRN: 930781).
            <br />
            <a href="https://smfinance.co.uk" style={{ color: "#3a3a3a" }}>
              smfinance.co.uk
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
