import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStats, getEntries, getLeaderboard } from "../lib/store";
import { getSession } from "../lib/auth";
import { format } from "date-fns";

function StatCard({ label, value, sub, color = "#e8c96b", barValue, barMax }) {
  const pct = barMax ? Math.min(100, Math.round((barValue / barMax) * 100)) : 0;
  return (
    <div
      style={{
        background: "#0f0e0a",
        border: "0.5px solid #2a2010",
        borderRadius: 14,
        padding: "1.25rem",
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#4a3e1a",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 300,
          color,
          fontFamily: "'Cormorant Garamond', serif",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 11,
            color: "#3a2e10",
            marginBottom: barMax ? 8 : 0,
          }}
        >
          {sub}
        </div>
      )}
      {barMax !== undefined && (
        <div style={{ height: 3, background: "#1a1500", borderRadius: 2 }}>
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: color,
              borderRadius: 2,
              opacity: 0.7,
              transition: "width 0.8s ease",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recent, setRecent] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const session = getSession();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const yearPct = Math.round(
    ((new Date() - new Date("2026-01-01")) /
      (new Date("2027-01-01") - new Date("2026-01-01"))) *
      100,
  );
  const daysLeft = Math.round(
    (new Date("2027-01-01") - new Date()) / (1000 * 60 * 60 * 24),
  );

  useEffect(() => {
    const load = async () => {
      const statsData = await getStats();
      const entriesData = await getEntries();
      const leadersData = await getLeaderboard();

      setStats(statsData);
      setRecent(entriesData.slice(0, 8));
      setLeaders(leadersData.slice(0, 5));
    };

    load();
  }, []);

  const fmtDate = (d) => {
    try {
      return format(new Date(d), "d MMM yyyy");
    } catch {
      return d;
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#4a3e1a",
            marginBottom: 6,
          }}
        >
          {greeting}, {session?.name?.split(" ")[0] || "Admin"}
        </div>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 400,
            color: "#e8c96b",
            fontFamily: "'Cormorant Garamond', serif",
            marginBottom: 4,
          }}
        >
          Programme Dashboard
        </h1>
        <div style={{ fontSize: 12, color: "#4a3e1a" }}>
          {new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · {daysLeft} days until draw
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,minmax(0,1fr))",
          gap: 12,
          marginBottom: "1.5rem",
        }}
      >
        <StatCard
          label="Total entries"
          value={stats.totalEntries ?? 0}
          sub="All registered entries"
          color="#e8c96b"
          barValue={stats.totalEntries}
          barMax={100}
        />
        <StatCard
          label="Checked in"
          value={stats.checkedIn ?? 0}
          sub={`${stats.totalEntries ? Math.round((stats.checkedIn / stats.totalEntries) * 100) : 0}% confirmed`}
          color="#4a9a6a"
          barValue={stats.checkedIn}
          barMax={stats.totalEntries || 1}
        />
        <StatCard
          label="Referral entries"
          value={stats.referralEntries ?? 0}
          sub={`via ${stats.totalPartners ?? 0} partners`}
          color="#c9a227"
          barValue={stats.referralEntries}
          barMax={stats.totalEntries || 1}
        />
        <StatCard
          label="Unique clients"
          value={stats.uniqueClients ?? 0}
          sub="Distinct client IDs"
          color="#8a8ac0"
        />
      </div>

      {/* Programme timeline */}
      <div
        style={{
          background: "#0f0e0a",
          border: "0.5px solid #2a2010",
          borderRadius: 14,
          padding: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 500, color: "#7a6a3a" }}>
            Programme year progress
          </div>
          <div style={{ fontSize: 11, color: "#4a3e1a" }}>
            {yearPct}% of year elapsed
          </div>
        </div>
        <div
          style={{
            height: 5,
            background: "#1a1500",
            borderRadius: 3,
            overflow: "hidden",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${yearPct}%`,
              background: "#b8922a",
              borderRadius: 3,
              opacity: 0.8,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "#3a2e10",
            letterSpacing: "0.06em",
          }}
        >
          <span>JAN 2026 · Programme open</span>
          <span>{daysLeft} days to draw</span>
          <span>JAN 2027 · Annual Dinner</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "1.25rem",
          alignItems: "start",
        }}
      >
        {/* Recent entries table */}
        <div
          style={{
            background: "#0f0e0a",
            border: "0.5px solid #2a2010",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem 1.25rem",
              borderBottom: "0.5px solid #1a1500",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 500, color: "#c0b090" }}>
              Recent entries
            </div>
            <Link
              to="/admin/entries"
              style={{ fontSize: 11, color: "#5a4e2a" }}
            >
              View all →
            </Link>
          </div>
          <div style={{ padding: "0 1.25rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 90px 75px 86px",
                gap: 8,
                padding: "8px 0",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#3a2e10",
                borderBottom: "0.5px solid #1a1500",
              }}
            >
              <span>Entry ref</span>
              <span>Client</span>
              <span>Product</span>
              <span>Type</span>
              <span>Status</span>
            </div>
            {recent.length === 0 && (
              <div
                style={{
                  padding: "2rem 0",
                  textAlign: "center",
                  color: "#3a2e10",
                  fontSize: 13,
                }}
              >
                No entries yet — generate your first token
              </div>
            )}
            {recent.map((e) => (
              <div
                key={e.ref}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr 90px 75px 86px",
                  gap: 8,
                  padding: "10px 0",
                  borderBottom: "0.5px solid #120e00",
                  alignItems: "center",
                  fontSize: 13,
                }}
              >
                <span
                  style={{
                    fontWeight: 500,
                    color: "#b8922a",
                    fontFamily: "monospace",
                    fontSize: 11,
                  }}
                >
                  {e.ref}
                </span>
                <span
                  style={{
                    color: "#c0b090",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.client_name}
                </span>
                <span style={{ color: "#5a4e2a", fontSize: 11 }}>
                  {e.product.split(" ").slice(0, 2).join(" ")}
                </span>
                <span>
                  <span
                    className={`badge badge-${e.entry_type === "referral" ? "referral" : "active"}`}
                  >
                    {e.entry_type === "referral" ? "Ref" : "Direct"}
                  </span>
                </span>
                <span>
                  <span
                    className={`badge badge-${e.checked_in ? "checkedin" : "active"}`}
                  >
                    {e.checked_in ? "In" : "Active"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Quick actions */}
          <div
            style={{
              background: "#0f0e0a",
              border: "0.5px solid #2a2010",
              borderRadius: 14,
              padding: "1rem 1.25rem",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#4a3e1a",
                marginBottom: 12,
              }}
            >
              Quick actions
            </div>
            {[
              {
                to: "/admin/generate",
                label: "Generate token",
                sub: "New client entry",
              },
              {
                to: "/admin/scan",
                label: "Scan & check in",
                sub: "Annual Dinner",
              },
              {
                to: "/admin/draw",
                label: "Live draw",
                sub: "Prize draw stage",
              },
              {
                to: "/admin/partners/register",
                label: "Register partner",
                sub: "Referral partner",
              },
            ].map((a, i) => (
              <Link key={a.to} to={a.to}>
                <div
                  style={{
                    padding: "9px 11px",
                    borderRadius: 8,
                    background: "#111",
                    border: "0.5px solid #1e1500",
                    marginBottom: i < 3 ? 6 : 0,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#c0b090",
                      }}
                    >
                      {a.label}
                    </div>
                    <div
                      style={{ fontSize: 10, color: "#3a2e10", marginTop: 1 }}
                    >
                      {a.sub}
                    </div>
                  </div>
                  <span style={{ color: "#3a2e10", fontSize: 14 }}>→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Partner leaderboard */}
          <div
            style={{
              background: "#0f0e0a",
              border: "0.5px solid #2a2010",
              borderRadius: 14,
              padding: "1rem 1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#4a3e1a",
                }}
              >
                Top referrers
              </div>
              <Link
                to="/admin/leaderboard"
                style={{ fontSize: 11, color: "#4a3e1a" }}
              >
                Full →
              </Link>
            </div>
            {leaders.length === 0 && (
              <div style={{ fontSize: 12, color: "#3a2e10" }}>
                No partners registered yet
              </div>
            )}
            {leaders.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: i < leaders.length - 1 ? 10 : 0,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background:
                      i === 0
                        ? "#b8922a"
                        : i === 1
                          ? "#666"
                          : i === 2
                            ? "#7a5a2a"
                            : "#1a1a1a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 500,
                    color: i < 3 ? (i === 0 ? "#1a1000" : "#fff") : "#3a3a3a",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#9a8060",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#3a2e10",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.firm || p.type}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 300,
                    color: "#b8922a",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  {p.drawEntries}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
