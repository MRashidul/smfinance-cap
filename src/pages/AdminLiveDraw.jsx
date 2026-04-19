import React, { useState, useRef, useEffect } from "react";
import { getEntries } from "../lib/store";

export default function AdminLiveDraw() {
  const [pool, setPool] = useState("checkedin");
  const [exclude, setExclude] = useState("");
  const [status, setStatus] = useState("ready");
  const [displayName, setDisplayName] = useState("");
  const [winner, setWinner] = useState(null);
  const [eligibleCount, setEligibleCount] = useState(0);
  const intervalRef = useRef();

  const getEligible = async () => {
    const all = await getEntries();

    let eligible = pool === "checkedin" ? all.filter((e) => e.checked_in) : all;

    if (exclude.trim()) {
      eligible = eligible.filter((e) => e.ref !== exclude.trim().toUpperCase());
    }

    return eligible;
  };

  useEffect(() => {
    const load = async () => {
      const eligible = await getEligible();
      setEligibleCount(eligible.length);
    };

    load();
  }, [pool, exclude]);

  const startDraw = async () => {
    const eligible = await getEligible();

    if (!eligible.length) {
      alert("No eligible entries in the draw pool.");
      return;
    }

    setStatus("spinning");
    setWinner(null);

    let ticks = 0;
    intervalRef.current = setInterval(() => {
      const r = eligible[Math.floor(Math.random() * eligible.length)];
      setDisplayName(r.client_name + " · " + r.ref);

      ticks++;
      if (ticks > 35) {
        clearInterval(intervalRef.current);

        const w = eligible[Math.floor(Math.random() * eligible.length)];
        setWinner(w);
        setDisplayName(w.client_name);
        setStatus("done");
      }
    }, 80);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setStatus("ready");
    setWinner(null);
    setDisplayName("");
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
            marginBottom: 4,
          }}
        >
          Annual Dinner
        </div>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: "#e8c96b",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          Live prize draw
        </h1>
      </div>

      {/* Draw stage */}
      <div
        className="card"
        style={{
          textAlign: "center",
          padding: "2.5rem 2rem",
          marginBottom: "1.5rem",
          borderColor: status === "done" ? "#b8922a" : "#2a2010",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#4a3e1a",
            marginBottom: 16,
          }}
        >
          SM Finance · Annual Client Appreciation Prize Draw · January 2027
        </div>

        {/* Drum */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: `2px solid ${status === "done" ? "#b8922a" : "#2a2010"}`,
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#111",
            animation:
              status === "spinning" ? "spin 0.25s linear infinite" : "none",
          }}
        >
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <circle
              cx="25"
              cy="25"
              r="22"
              stroke="#b8922a"
              strokeWidth="1"
              opacity={status === "spinning" ? 1 : 0.4}
            />
            <circle
              cx="25"
              cy="25"
              r="13"
              stroke="#b8922a"
              strokeWidth="0.6"
              strokeDasharray="3 2"
              opacity={status === "spinning" ? 0.8 : 0.25}
            />
            <circle
              cx="25"
              cy="25"
              r="5"
              fill="#b8922a"
              opacity={status === "spinning" ? 0.9 : 0.3}
            />
          </svg>
        </div>

        {/* Status text */}
        <div
          style={{
            fontSize: status === "spinning" ? 14 : 16,
            color: status === "done" ? "#e8c96b" : "#7a6a3a",
            minHeight: 24,
            marginBottom: 8,
            fontFamily:
              status === "done" ? "'Cormorant Garamond', serif" : "inherit",
            fontWeight: status === "done" ? 500 : 400,
            transition: "all 0.2s",
          }}
        >
          {status === "ready" && "Ready to draw"}
          {status === "spinning" && (
            <span className="pulse">{displayName || "..."}</span>
          )}
          {status === "done" && displayName}
        </div>

        <div style={{ fontSize: 12, color: "#4a3e1a", marginBottom: 24 }}>
          {eligibleCount} eligible {eligibleCount === 1 ? "entry" : "entries"}{" "}
          in the draw pool
        </div>

        {/* Winner reveal */}
        {winner && (
          <div
            className="fade-in"
            style={{
              background: "#111",
              border: "1px solid #b8922a",
              borderRadius: 14,
              padding: "1.5rem",
              margin: "0 auto 1.5rem",
              maxWidth: 340,
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#5a4e2a",
                marginBottom: 8,
              }}
            >
              Winner
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: "#e8c96b",
                fontFamily: "'Cormorant Garamond', serif",
                marginBottom: 4,
              }}
            >
              {winner.client_name}
            </div>
            <div style={{ fontSize: 13, color: "#7a6a3a", marginBottom: 8 }}>
              {winner.ref} · {winner.client_id}
            </div>
            <div style={{ fontSize: 12, color: "#5a4e2a" }}>
              {winner.product} · Completed {winner.completion_date}
              {winner.entry_type === "referral" &&
                ` · Referred by ${winner.referrer_name}`}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {status !== "done" && (
            <button
              className="btn-gold"
              onClick={startDraw}
              disabled={status === "spinning"}
            >
              {status === "spinning" ? "Drawing..." : "Start draw"}
            </button>
          )}
          {status !== "ready" && (
            <button className="btn-ghost" onClick={reset}>
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="card">
        <div className="section-title">Draw options</div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label className="label">Eligible pool</label>
            <select
              className="input"
              value={pool}
              onChange={(e) => setPool(e.target.value)}
            >
              <option value="checkedin">Checked-in only (recommended)</option>
              <option value="all">All active entries</option>
            </select>
          </div>
          <div>
            <label className="label">Exclude entry ref (optional)</label>
            <input
              className="input"
              value={exclude}
              onChange={(e) => setExclude(e.target.value)}
              placeholder="e.g. CAP-2026-00001"
            />
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
