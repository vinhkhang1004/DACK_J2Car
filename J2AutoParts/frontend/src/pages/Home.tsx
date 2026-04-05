import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-home" style={{ backgroundImage: "url('/images/hero-bg.png')" }}>
        <div className="container hero-content">
          <div className="badge-precision" style={{ background: "rgba(255, 107, 53, 0.15)", color: "#ff8c5a" }}>
            PHÒNG THÍ NGHIỆM PHỤ TÙNG CAO CẤP
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.2rem)", fontWeight: 800, margin: "1rem 0" }}>
            Tra cứu & mua bán <br />
            phụ tùng ô tô — <span className="text-gradient">nhanh, rõ ràng, có phân quyền.</span>
          </h1>
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <Link to="/san-pham" className="btn btn-primary" style={{ padding: "0.8rem 2rem" }}>
              Xem sản phẩm
            </Link>
          </div>

          <div className="hero-search-bar" style={{ marginTop: "4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingLeft: "1.5rem" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h10" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
              <input type="text" placeholder="Hãng xe, đời xe..." style={{ padding: 0 }} />
            </div>
            <div
              style={{
                width: 1,
                height: "24px",
                background: "var(--border)",
                alignSelf: "center",
              }}
            ></div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingLeft: "1.5rem", flex: 1.5 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <input type="text" placeholder="Mã phụ tùng (VIN, OEM)..." style={{ padding: 0 }} />
            </div>
            <button
              className="btn btn-primary"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                padding: 0,
                alignSelf: "center",
                marginRight: "6px",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Technical Specs Box */}
        <div className="tech-spec-box">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Thông số kỹ thuật</span>
            <div
              style={{
                padding: "2px 8px",
                borderRadius: 4,
                background: "rgba(0, 222, 255, 0.2)",
                color: "#00deff",
                fontSize: "0.6rem",
                fontWeight: 700,
              }}
            >
              XÁC THỰC OEM
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { label: "Turbo Pressure", value: "2.4 BAR" },
              { label: "Flow Capacity", value: "850 CFM" },
              { label: "Response Time", value: "14ms" },
            ].map((spec) => (
              <div key={spec.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span className="muted">{spec.label}</span>
                <span style={{ fontWeight: 700 }}>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="category-section container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
          <div>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Danh mục phụ tùng</h2>
            <p className="muted" style={{ maxWidth: 460 }}>
              Khám phá kho phụ tùng chính hãng với hơn 50,000 mã linh kiện từ các nhà sản xuất hàng đầu.
            </p>
          </div>
          <Link to="/san-pham" style={{ color: "var(--accent)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Xem tất cả danh mục
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {[
            {
              title: "Brakes",
              desc: "Hệ thống phanh, đĩa phanh, má phanh chính hãng.",
              img: "/images/brakes.png",
              links: ["Ceramic Discs", "ABS Sensors"],
            },
            {
              title: "Engine",
              desc: "Linh kiện động cơ, piston, turbo và gioăng máy.",
              img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800",
              links: ["Turbochargers", "Valves & Seals"],
            },
            {
              title: "Suspension",
              desc: "Giảm xóc, lò xo và các chi tiết gầm xe.",
              img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800",
              links: ["Coilovers", "Control Arms"],
            },
            {
              title: "Transmission",
              desc: "Hộp số, ly hợp và các bộ phận truyền động.",
              img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
              links: ["Clutch Kits", "Gear Sets"],
            },
          ].map((cat) => (
            <div key={cat.title} className="category-card" style={{ backgroundImage: `url('${cat.img}')` }}>
              <div className="category-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1.5rem", margin: 0 }}>{cat.title}</h3>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.1)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="3" />
                      <circle cx="19" cy="5" r="2" />
                      <circle cx="5" cy="19" r="2" />
                      <path d="M7 17l10-10" />
                    </svg>
                  </div>
                </div>
                <p className="muted" style={{ fontSize: "0.85rem", margin: "1rem 0" }}>
                  {cat.desc}
                </p>
                <ul className="category-links">
                  {cat.links.map((link) => (
                    <li key={link}>
                      <Link
                        to="/san-pham"
                        style={{ fontSize: "0.8rem", color: "white", display: "flex", alignItems: "center", gap: "0.5rem" }}
                      >
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" }}></div>
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lab Section */}
      <section className="container lab-section">
        <div className="lab-image">
          <img
            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200"
            alt="Lab"
            style={{ width: "100%", height: "500px", objectFit: "cover", display: "block" }}
          />
          <div className="lab-badge">
            <h4 style={{ fontSize: "2.5rem", margin: 0, fontWeight: 800 }}>99.9%</h4>
            <p className="muted" style={{ fontSize: "0.9rem", margin: 0 }}>
              Độ chính xác tương thích mã phụ tùng.
            </p>
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "2rem", lineHeight: 1.1 }}>
            Kỹ thuật chính xác từ <br /> <span className="text-gradient">phòng Lab.</span>
          </h2>
          <p className="muted" style={{ fontSize: "1.1rem", marginBottom: "3rem", lineHeight: 1.6 }}>
            Tại J2 Auto Parts, chúng tôi không chỉ bán phụ tùng. Chúng tôi cung cấp giải pháp kỹ thuật số giúp bạn tra
            cứu chính xác linh kiện cho từng dòng xe cụ thể, loại bỏ rủi ro mua sai hàng.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: "rgba(255,107,53,0.1)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <div>
                <strong style={{ display: "block", marginBottom: "0.25rem" }}>Bảo hành 1:1</strong>
                <span className="muted" style={{ fontSize: "0.85rem" }}>
                  Đổi trả nhanh chóng nếu lỗi.
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: "rgba(0, 222, 255, 0.1)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00deff" strokeWidth="2.5">
                  <path d="M5 18h14M5 22h14M2 8h20M2 12h20" />
                  <path d="M12 2v20M9 22v-4M15 22v-4" />
                </svg>
              </div>
              <div>
                <strong style={{ display: "block", marginBottom: "0.25rem" }}>Vận chuyển hỏa tốc</strong>
                <span className="muted" style={{ fontSize: "0.85rem" }}>
                  Giao hàng trong 2-4h nội thành.
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/about"
            style={{ color: "var(--accent)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            Tìm hiểu về quy trình kiểm định
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

