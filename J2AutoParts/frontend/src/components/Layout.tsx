import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: isActive ? "#ff6b35" : "#8b97a8",
  fontWeight: isActive ? 600 : 500,
});

export default function Layout() {
  const { user, logout, isAdmin, loading } = useAuth();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(12, 14, 18, 0.85)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBlock: "1rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg,#ff6b35,#ffb347)",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                color: "#0c0e12",
                fontSize: "0.85rem",
              }}
            >
              J2
            </span>
            <span style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>J2 Auto Parts</span>
          </Link>
          <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
            <NavLink to="/" end style={navLinkStyle}>
              Trang chủ
            </NavLink>
            <NavLink to="/san-pham" style={navLinkStyle}>
              Sản phẩm
            </NavLink>
            {isAdmin && (
              <NavLink to="/quan-tri" style={navLinkStyle}>
                Quản trị
              </NavLink>
            )}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {loading ? (
              <span className="muted" style={{ fontSize: "0.9rem" }}>
                Đang tải…
              </span>
            ) : user ? (
              <>
                <span className="muted" style={{ fontSize: "0.9rem" }}>
                  Xin chào, <strong style={{ color: "var(--text)" }}>{user.fullName}</strong>
                </span>
                <button type="button" className="btn btn-ghost" onClick={() => logout()}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/dang-nhap" className="btn btn-ghost">
                  Đăng nhập
                </Link>
                <Link to="/dang-ky" className="btn btn-primary">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main style={{ flex: 1, paddingBlock: "2rem" }}>
        <Outlet />
      </main>
      <footer style={{ borderTop: "1px solid var(--border)", padding: "1.5rem 0", marginTop: "auto" }}>
        <div className="container muted" style={{ fontSize: "0.875rem" }}>
          © {new Date().getFullYear()} J2 Auto Parts — Tra cứu & mua bán phụ tùng ô tô.
        </div>
      </footer>
    </div>
  );
}
