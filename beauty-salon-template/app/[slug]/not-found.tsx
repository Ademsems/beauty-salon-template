/**
 * app/[slug]/not-found.tsx
 * Shown when a slug has no matching CSV row.
 */

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        fontFamily: "'DM Sans', sans-serif",
        color: "#9a9590",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "5rem",
          fontWeight: 400,
          color: "#c9a96e",
          lineHeight: 1,
        }}
      >
        404
      </p>
      <p style={{ fontSize: "1.125rem", color: "#f0ede8" }}>
        Salon not found
      </p>
      <p style={{ fontSize: "0.875rem" }}>
        This salon page doesn't exist or hasn't been set up yet.
      </p>
      <a
        href="/"
        style={{
          marginTop: "1rem",
          padding: "0.75rem 2rem",
          border: "1px solid #c9a96e",
          color: "#c9a96e",
          textDecoration: "none",
          fontSize: "0.6875rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        Go Home
      </a>
    </div>
  );
}
