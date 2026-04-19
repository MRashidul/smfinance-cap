import React, { useState } from "react";
import { getEntryByRef, checkInEntry } from "../lib/store";
import { format } from "date-fns";

export default function AdminScanVerify() {
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [checkinInput, setCheckinInput] = useState("");
  const [checkinMsg, setCheckinMsg] = useState(null);

  const doVerify = async () => {
    const ref = verifyInput.trim().toUpperCase();

    try {
      const entry = await getEntryByRef(ref);
      setVerifyResult({ entry, ref });
    } catch {
      setVerifyResult({ entry: null, ref });
    }
  };

  const doCheckin = async () => {
    const ref = checkinInput.trim().toUpperCase();

    let existing;
    try {
      existing = await getEntryByRef(ref);
    } catch {
      setCheckinMsg({ type: "error", text: `No entry found: ${ref}` });
      return;
    }

    if (!existing) {
      setCheckinMsg({ type: "error", text: `No entry found: ${ref}` });
      return;
    }

    if (existing.checked_in) {
      setCheckinMsg({
        type: "warn",
        text: `${existing.client_name} is already checked in.`,
      });
      return;
    }

    await checkInEntry(ref);

    setCheckinMsg({
      type: "success",
      text: `${existing.client_name} (${ref}) checked in successfully.`,
    });

    setCheckinInput("");
  };
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
            marginBottom: 4,
          }}
        >
          Admin
        </div>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: "#e8c96b",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          Scan & verify
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Verify */}
        <div className="card">
          <div className="section-title">Verify entry</div>
          <div
            style={{
              fontSize: 12,
              color: "#5a4e2a",
              marginBottom: 14,
              lineHeight: 1.6,
            }}
          >
            Enter or scan an entry reference to confirm it is a valid registered
            entry in the CAP 2026 programme.
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input
              className="input"
              style={{ flex: 1 }}
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doVerify()}
              placeholder="e.g. CAP-2026-00001"
            />
            <button className="btn-gold" onClick={doVerify}>
              Verify
            </button>
          </div>

          {verifyResult && (
            <div
              className="fade-in"
              style={{
                padding: 14,
                borderRadius: 10,
                background: verifyResult.entry ? "#0f1f0f" : "#1f0f0f",
                border: `0.5px solid ${verifyResult.entry ? "#1a4a1a" : "#4a1a1a"}`,
              }}
            >
              {verifyResult.entry ? (
                <>
                  <div
                    style={{
                      fontWeight: 500,
                      color: "#4a9a4a",
                      marginBottom: 10,
                      fontSize: 13,
                    }}
                  >
                    Valid entry confirmed
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                      fontSize: 12,
                    }}
                  >
                    {[
                      ["Entry ref", verifyResult.entry.ref],
                      ["Client", verifyResult.entry.client_name],
                      ["Client ID", verifyResult.entry.client_id],
                      ["Product", verifyResult.entry.product],
                      [
                        "Completed",
                        fmtDate(verifyResult.entry.completion_date),
                      ],
                      [
                        "Status",
                        verifyResult.entry.checked_in ? "Checked in" : "Active",
                      ],
                      verifyResult.entry.entry_type === "referral"
                        ? ["Referred by", verifyResult.entry.referrer_name]
                        : null,
                    ]
                      .filter(Boolean)
                      .map(([l, v]) => (
                        <div key={l}>
                          <span style={{ color: "#3a6a3a" }}>{l}: </span>
                          <span style={{ color: "#8aba8a" }}>{v}</span>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      fontWeight: 500,
                      color: "#aa4a4a",
                      marginBottom: 4,
                      fontSize: 13,
                    }}
                  >
                    Entry not found
                  </div>
                  <div style={{ fontSize: 12, color: "#7a3a3a" }}>
                    No entry matching "{verifyResult.ref}" exists in this
                    programme period.
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Check in */}
        <div className="card">
          <div className="section-title">Annual Dinner check-in</div>
          <div
            style={{
              fontSize: 12,
              color: "#5a4e2a",
              marginBottom: 14,
              lineHeight: 1.6,
            }}
          >
            Scan a client's QR code at the Annual Dinner to mark them as
            present. Only checked-in entries are eligible for the live draw.
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input
              className="input"
              style={{ flex: 1 }}
              value={checkinInput}
              onChange={(e) => setCheckinInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doCheckin()}
              placeholder="Scan or enter entry ref"
              autoFocus
            />
            <button className="btn-gold" onClick={doCheckin}>
              Check in
            </button>
          </div>

          {checkinMsg && (
            <div
              className="fade-in"
              style={{
                padding: 12,
                borderRadius: 8,
                fontSize: 13,
                background:
                  checkinMsg.type === "success"
                    ? "#0f1f0f"
                    : checkinMsg.type === "error"
                      ? "#1f0f0f"
                      : "#1a1400",
                color:
                  checkinMsg.type === "success"
                    ? "#4a9a4a"
                    : checkinMsg.type === "error"
                      ? "#aa4a4a"
                      : "#c9a227",
                border: `0.5px solid ${checkinMsg.type === "success" ? "#1a4a1a" : checkinMsg.type === "error" ? "#4a1a1a" : "#2a2010"}`,
              }}
            >
              {checkinMsg.text}
            </div>
          )}

          <div
            style={{
              marginTop: 20,
              padding: 12,
              background: "#111",
              borderRadius: 8,
              border: "0.5px solid #1e1a0e",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#3a2e10",
                marginBottom: 6,
              }}
            >
              QR scanner tip
            </div>
            <div style={{ fontSize: 12, color: "#4a3e1a", lineHeight: 1.6 }}>
              In the live deployment, connect a USB barcode/QR scanner — it acts
              as a keyboard and auto-submits when it reads a code. No button
              click needed. Or use a mobile QR reader app pointed at the
              client's phone screen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
