export default function Footer({isDark}) {
  return (
    <footer
        className="mt-auto border-t"
      style={{
        backgroundColor: isDark
          ? "var(--bg-dark)"
          : "#c2c1c1",
        color: isDark
          ? "var(--text-dark)"
          : "var(--text-light)",
        borderColor: isDark
          ? "rgb(123, 128, 135)"
          : "rgba(0,0,0,0.2)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm">
        © {new Date().getFullYear()} KnowMotion. All rights reserved.
        <br />
        Designed & Developed by{" "}
        <span
          style={{
            fontWeight: 500,
            color: isDark
              ? "var(--text-dark)"
              : "var(--text-light)",
          }}
        >
          Muhammad Nashef
        </span>
      </div>
    </footer>
  );
}
