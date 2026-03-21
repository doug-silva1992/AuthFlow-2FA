import { useState, useEffect, useRef } from "react";

const QR_VALUE = "https://yourwebsite.com/signup";

function QRCodeSVG({ value, size = 200 }) {
  // Simple QR code visual representation using a pattern
  // Using a decorative QR-like grid pattern
  const cells = 21;
  const cellSize = size / cells;

  // Deterministic pattern based on value string
  const hash = value.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pattern = [];
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      // Finder patterns (corners)
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= cells - 8;
      const inBottomLeft = r >= cells - 8 && c < 8;

      if (inTopLeft || inTopRight || inBottomLeft) {
        const fr = inTopLeft ? r : inTopRight ? r : r - (cells - 8);
        const fc = inTopLeft ? c : inTopRight ? c - (cells - 8) : c;
        const border = fr === 0 || fr === 6 || fc === 0 || fc === 6;
        const inner = fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4;
        if (border || inner) {
          pattern.push({ r, c, dark: true });
          continue;
        }
        pattern.push({ r, c, dark: false });
        continue;
      }

      // Data cells - pseudo-random but deterministic
      const val = (r * cells + c + hash * 7 + r * 3 + c * 11) % 17;
      pattern.push({ r, c, dark: val < 8 });
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {pattern.map(({ r, c, dark }) => (
        <rect
          key={`${r}-${c}`}
          x={c * cellSize}
          y={r * cellSize}
          width={cellSize}
          height={cellSize}
          fill={dark ? "#1a1a2e" : "transparent"}
        />
      ))}
    </svg>
  );
}

export default function QRCodeSignup() {
  const [copied, setCopied] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(QR_VALUE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={styles.page}>
      <style>{css}</style>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style={styles.title}>Sign up</h1>
          <p style={styles.subtitle}>Scan the QR Code to create your account</p>
        </div>

        {/* QR Code Container */}
        <div style={styles.qrContainer}>
          <div style={styles.qrFrame} className={pulse ? "qr-pulse" : ""}>
            <div style={styles.cornerTL} />
            <div style={styles.cornerTR} />
            <div style={styles.cornerBL} />
            <div style={styles.cornerBR} />
            <div style={styles.qrInner}>
              <QRCodeSVG value={QR_VALUE} size={180} />
            </div>
          </div>


        </div>

        {/* Info */}
        <div style={styles.infoBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={styles.infoText}>
            Open your camera app and point it at the QR code
          </span>
        </div>

        {/* URL + Copy */}
        <div style={styles.urlRow}>
          <span style={styles.urlText}>{QR_VALUE}</span>
          <button style={styles.copyBtn} onClick={handleCopy}>
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            )}
          </button>
        </div>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine} />
        </div>

        {/* CTA Button */}
        <button style={styles.signupBtn} className="signup-btn">
          SIGN UP WITH EMAIL
        </button>

        {/* Footer link */}
        <p style={styles.footerLink}>
          Already have an account?{" "}
          <a href="#" style={styles.link}>Sign in</a>
        </p>

        {/* Copyright */}
        <p style={styles.copyright}>Copyright © Your Website 2026.</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f7",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    padding: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "36px 40px 28px",
    width: "100%",
    maxWidth: "460px",
    boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "28px",
  },
  iconWrapper: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #e91e8c, #c2185b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "14px",
    boxShadow: "0 4px 16px rgba(233,30,140,0.3)",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 6px",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#888",
    margin: 0,
    textAlign: "center",
  },
  qrContainer: {
    position: "relative",
    marginBottom: "20px",
    overflow: "hidden",
    borderRadius: "16px",
  },
  qrFrame: {
    position: "relative",
    padding: "20px",
    background: "#fafafa",
    border: "1px solid #eee",
    borderRadius: "16px",
  },
  qrInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cornerTL: {
    position: "absolute", top: 8, left: 8,
    width: 20, height: 20,
    borderTop: "3px solid #e91e8c",
    borderLeft: "3px solid #e91e8c",
    borderRadius: "4px 0 0 0",
  },
  cornerTR: {
    position: "absolute", top: 8, right: 8,
    width: 20, height: 20,
    borderTop: "3px solid #e91e8c",
    borderRight: "3px solid #e91e8c",
    borderRadius: "0 4px 0 0",
  },
  cornerBL: {
    position: "absolute", bottom: 8, left: 8,
    width: 20, height: 20,
    borderBottom: "3px solid #e91e8c",
    borderLeft: "3px solid #e91e8c",
    borderRadius: "0 0 0 4px",
  },
  cornerBR: {
    position: "absolute", bottom: 8, right: 8,
    width: 20, height: 20,
    borderBottom: "3px solid #e91e8c",
    borderRight: "3px solid #e91e8c",
    borderRadius: "0 0 4px 0",
  },

  infoBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    background: "#fff0f7",
    border: "1px solid #fcd1e8",
    borderRadius: "10px",
    padding: "10px 14px",
    marginBottom: "16px",
    width: "100%",
    boxSizing: "border-box",
  },
  infoText: {
    fontSize: "13px",
    color: "#666",
    lineHeight: 1.5,
  },
  urlRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#f5f5f7",
    border: "1px solid #e8e8e8",
    borderRadius: "10px",
    padding: "10px 12px",
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "20px",
  },
  urlText: {
    flex: 1,
    fontSize: "13px",
    color: "#555",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  copyBtn: {
    background: "#1a1a2e",
    border: "none",
    borderRadius: "6px",
    padding: "6px 8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    marginBottom: "16px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e8e8e8",
  },
  dividerText: {
    fontSize: "13px",
    color: "#aaa",
  },
  signupBtn: {
    width: "100%",
    padding: "15px",
    background: "linear-gradient(135deg, #1565c0, #1976d2)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.8px",
    cursor: "pointer",
    marginBottom: "16px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 14px rgba(21,101,192,0.35)",
  },
  footerLink: {
    fontSize: "14px",
    color: "#888",
    margin: "0 0 16px",
  },
  link: {
    color: "#1976d2",
    textDecoration: "none",
    fontWeight: "500",
  },
  copyright: {
    fontSize: "12px",
    color: "#bbb",
    margin: 0,
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

@keyframes qrPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(233,30,140,0.15); }
    50% { box-shadow: 0 0 0 8px rgba(233,30,140,0); }
  }

  .qr-pulse {
    animation: qrPulse 2s ease-in-out;
  }

  .signup-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(21,101,192,0.45) !important;
  }

  .signup-btn:active {
    transform: translateY(0);
  }
`;
