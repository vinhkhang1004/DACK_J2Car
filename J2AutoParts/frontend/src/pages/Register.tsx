import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
import type { ApiError } from "../api";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setPending(true);
    try {
      await register(email.trim(), password, fullName.trim());
      nav("/");
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        const data = ex.response?.data as ApiError | undefined;
        setErr(data?.message ?? "Đăng ký thất bại");
      } else setErr("Lỗi không xác định");
    } finally {
      setPending(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Auth Header */}
      <header
        style={{
          padding: "1.5rem 4rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
          <span style={{ fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.03em" }}>J2 Auto Parts</span>
        </Link>
        <span className="muted" style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em" }}>
          Kinetic Engineering Lab
        </span>
      </header>

      <main className="auth-container">
        {/* Hero Section */}
        <div className="auth-hero">
          <div className="badge-precision">Truy cập chính xác</div>
          <h1>
            Tham gia <br />
            <span className="text-gradient">Mạng lưới ưu tú.</span>
          </h1>
          <p className="muted" style={{ fontSize: "1.1rem", maxWidth: "480px", marginBottom: "2rem" }}>
            Tạo hồ sơ kỹ thuật của bạn để truy cập danh mục đầy đủ các phụ tùng chính xác và giá dành riêng cho thành viên.
          </p>

          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon" style={{ background: "rgba(255, 107, 53, 0.1)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2.5">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.5-1 1-4c2 1 3 2 4 4z" />
                  <path d="M12 15v5s1-.5 4-1c-1-2-2-3-4-4z" />
                </svg>
              </div>
              <strong style={{ display: "block", marginBottom: "0.25rem" }}>Giao hàng ngày mai</strong>
              <span className="muted" style={{ fontSize: "0.85rem" }}>
                Logistics toàn cầu với tốc độ cơ khí.
              </span>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{ background: "rgba(0, 222, 255, 0.1)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00deff" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <strong style={{ display: "block", marginBottom: "0.25rem" }}>Đảm bảo OEM</strong>
              <span className="muted" style={{ fontSize: "0.85rem" }}>
                Phụ tùng đã xác minh với chính sách bảo hành trọn đời.
              </span>
            </div>
          </div>
        </div>

        {/* Card Section */}
        <div className="auth-card-section">
          <form className="glass-card" onSubmit={onSubmit} style={{ maxWidth: 520 }}>
            <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Tạo tài khoản</h2>
            <p className="muted" style={{ marginBottom: "2rem" }}>
              Điền thông tin của bạn để tham gia phòng thí nghiệm.
            </p>

            {err && <div className="error-banner">{err}</div>}

            <div className="input-group">
              <label>Họ và tên</label>
              <div className="input-wrapper">
                <span className="icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  minLength={2}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Địa chỉ Email</label>
              <div className="input-wrapper">
                <span className="icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="engineering@j2.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Mật khẩu</label>
              <div className="input-wrapper">
                <span className="icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={pending} style={{ width: "100%", height: "52px", marginTop: "1rem" }}>
              {pending ? "Đang tạo tài khoản..." : "Đăng ký ngay"}
            </button>

            <div className="divider">HOẶC ĐĂNG KÝ VỚI</div>

            <div className="social-btns">
              <button type="button" className="btn btn-social">
                <img src="https://www.google.com/favicon.ico" alt="GG" style={{ width: 16, marginRight: 8 }} />
                Google
              </button>
              <button type="button" className="btn btn-social">
                <img src="https://www.apple.com/favicon.ico" alt="AP" style={{ width: 16, marginRight: 8 }} />
                Apple
              </button>
            </div>

            <p className="muted" style={{ textAlign: "center", fontSize: "0.85rem", marginTop: "2rem" }}>
              Đã có tài khoản?{" "}
              <Link to="/dang-nhap" style={{ color: "var(--accent)", fontWeight: 700 }}>
                Đăng nhập tại đây
              </Link>
            </p>
          </form>
        </div>
      </main>

      {/* Auth Footer */}
      <footer className="auth-footer">
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr",
            gap: "4rem",
            width: "100%",
            maxWidth: "none",
          }}
        >
          <div>
            <h3 style={{ marginBottom: "1rem" }}>J2 Auto Parts</h3>
            <p className="muted" style={{ maxWidth: 240, fontSize: "0.9rem" }}>
              Gia công phụ tùng chính xác cho nền công nghiệp ô tô hiện đại.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Danh mục
            </h4>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "0.9rem" }} className="muted">
              <li style={{ marginBottom: "0.5rem" }}>Brakes</li>
              <li style={{ marginBottom: "0.5rem" }}>Engine</li>
              <li style={{ marginBottom: "0.5rem" }}>Suspension</li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Hỗ trợ
            </h4>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "0.9rem" }} className="muted">
              <li style={{ marginBottom: "0.5rem" }}>Truyền động</li>
              <li style={{ marginBottom: "0.5rem" }}>Hiệu năng</li>
              <li style={{ marginBottom: "0.5rem" }}>Chính sách bảo mật</li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Bản tin
            </h4>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email"
                placeholder="Cập nhật mới..."
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "0.5rem 1rem",
                  color: "white",
                  flex: 1,
                }}
              />
              <button className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>
                Gửi
              </button>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "4rem", display: "flex", justifyContent: "space-between" }} className="muted">
          <span style={{ fontSize: "0.75rem" }}>© 2024 J2 AUTO PARTS. KINETIC ENGINEERING LAB.</span>
          <div style={{ display: "flex", gap: "1rem" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <circle cx="11.5" cy="11.5" r="2.5" />
              <path d="M11.5 14v3.5" />
              <path d="M15 14v3.5" />
            </svg>
          </div>
        </div>
      </footer>
    </div>
  );
}

