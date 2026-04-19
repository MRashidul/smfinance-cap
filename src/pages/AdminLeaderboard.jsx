import React, { useState, useEffect } from "react";
import { getLeaderboard, PARTNER_TYPES } from "../lib/store";

export default function AdminLeaderboard() {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getLeaderboard();
      setBoard(data);
    };

    load();
  }, []);

  const medals = ["#b8922a", "#8a8a8a", "#7a5a2a"];

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
          Referral leaderboard
        </h1>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div
          style={{ padding: "12px 20px", borderBottom: "0.5px solid #1e1a0e" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "44px 1fr 100px 110px 110px",
              gap: 8,
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#4a3e1a",
            }}
          >
            <span></span>
            <span>Partner</span>
            <span style={{ textAlign: "right" }}>Referrals</span>
            <span style={{ textAlign: "right" }}>Completed</span>
            <span style={{ textAlign: "right" }}>Draw entries</span>
          </div>
        </div>

        <div style={{ padding: "0 20px" }}>
          {board.length === 0 && (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "#3a2e10",
                fontSize: 13,
              }}
            >
              No partners registered yet
            </div>
          )}
          {board.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: "grid",
                gridTemplateColumns: "44px 1fr 100px 110px 110px",
                gap: 8,
                alignItems: "center",
                padding: "14px 0",
                borderBottom:
                  i < board.length - 1 ? "0.5px solid #1a1500" : "none",
              }}
            >
              {/* Rank */}
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: i < 3 ? medals[i] : "#1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 500,
                  color: i < 3 ? (i === 0 ? "#1a1000" : "#fff") : "#4a4a4a",
                }}
              >
                {i + 1}
              </div>

              {/* Partner info */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#1a1a2a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#8a8ac0",
                    flexShrink: 0,
                  }}
                >
                  {p.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 500, color: "#c0b090" }}
                  >
                    {p.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#4a3e1a" }}>
                    {p.firm || PARTNER_TYPES[p.type]}
                    <span style={{ marginLeft: 6 }}>
                      <span className={`badge badge-${p.type}`}>
                        {PARTNER_TYPES[p.type]}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div
                style={{
                  textAlign: "right",
                  fontSize: 16,
                  fontWeight: 300,
                  color: "#c0b090",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {p.totalRefs}
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: 16,
                  fontWeight: 300,
                  color: "#4a9a4a",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {p.completed}
              </div>
              <div
                style={{
                  textAlign: "right",
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

      <div
        style={{
          marginTop: 12,
          fontSize: 12,
          color: "#3a2e10",
          lineHeight: 1.6,
        }}
      >
        Each completed referral transaction earns the partner one draw entry
        into the Annual Prize Draw. Referrers are eligible for the same prize as
        clients.
      </div>
    </div>
  );
}
