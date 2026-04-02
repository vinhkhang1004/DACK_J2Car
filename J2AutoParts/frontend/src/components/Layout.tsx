import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: isActive ? "#ff6b35" : "#8b97a8",
  fontWeight: isActive ? 600 : 500,
});

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(12, 14, 18, 0.9)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="container header-inner">
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg,#ff6b35,#ff9d6c)",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                color: "#0c0e12",
                fontSize: "0.75rem",
              }}
            >
              J2
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>J2 Auto Parts</span>
          </Link>

          <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
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

          <div className="header-search">
            <input type="text" placeholder="Tìm kiếm phụ tùng..." />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexShrink: 0 }}>
            <Link to={user ? "/profile" : "/dang-nhap"} style={{ color: "var(--muted)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
            <Link to="/cart" style={{ color: "var(--muted)", position: "relative" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.062 2h2.292l2.333 12.571a2 2 0 0 0 2 1.429h9.882a2 2 0 0 0 2-1.429l1.429-7.571h-14.882" />
              </svg>
            </Link>
            {user && (
              <button
                type="button"
                className="btn btn-ghost"
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                onClick={() => logout()}
              >
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer className="auth-footer" style={{ marginTop: "4rem", background: "var(--bg)" }}>
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr",
            gap: "4rem",
            paddingBottom: "4rem",
          }}
        >
          <div>
            <h3 style={{ marginBottom: "1rem" }}>J2 Auto Parts</h3>
            <p className="muted" style={{ maxWidth: 240, fontSize: "0.9rem" }}>
              Kinetic Engineering Lab. Nền tảng thương mại điện tử phụ tùng ô tô hàng đầu khu vực.
            </p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </div>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: "1.25rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Sản phẩm
            </h4>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "0.9rem" }} className="muted">
              <li style={{ marginBottom: "0.6rem" }}>Brakes</li>
              <li style={{ marginBottom: "0.6rem" }}>Engine</li>
              <li style={{ marginBottom: "0.6rem" }}>Suspension</li>
              <li style={{ marginBottom: "0.6rem" }}>Transmission</li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: "1.25rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Hỗ trợ
            </h4>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "0.9rem" }} className="muted">
              <li style={{ marginBottom: "0.6rem" }}>Chính sách bảo mật</li>
              <li style={{ marginBottom: "0.6rem" }}>Hướng dẫn tra cứu</li>
              <li style={{ marginBottom: "0.6rem" }}>Hệ thống phân quyền</li>
              <li style={{ marginBottom: "0.6rem" }}>Đối tác chiến lược</li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: "1.25rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Bản tin kỹ thuật
            </h4>
            <p className="muted" style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>
              Nhận thông báo về các dòng phụ tùng mới nhất và ưu đãi đặc quyền.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email"
                placeholder="Email của bạn"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "0.5rem 1rem",
                  color: "white",
                  flex: 1,
                  fontSize: "0.85rem",
                }}
              />
              <button className="btn btn-primary" style={{ padding: "0.5rem 0.75rem" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          className="container muted"
          style={{
            paddingTop: "2rem",
            paddingBottom: "2rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "0.75rem" }}>© 2024 J2 AUTO PARTS. KINETIC ENGINEERING LAB.</span>
          <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.75rem" }}>
            <span>Chính sách bảo mật</span>
            <span>Điều khoản dịch vụ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

