"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f8fafc",
          color: "#0f172a",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>App error</h2>
          <p style={{ color: "#64748b", marginBottom: 16 }}>
            {error.message || "Something went wrong."}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#0f766e",
              color: "white",
              border: 0,
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
