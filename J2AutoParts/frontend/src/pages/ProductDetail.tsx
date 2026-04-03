import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { api, type Product } from "../api";

function formatPrice(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState<Product | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState("");

  useEffect(() => {
    if (!id) return;
    void api
      .get<Product>(`/products/${id}`)
      .then((r) => {
        setP(r.data);
        setActiveImg(r.data.imageUrl || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200");
      })
      .catch((e) => {
        if (axios.isAxiosError(e) && e.response?.status === 400) setErr("Không tìm thấy sản phẩm");
        else setErr("Không tải được dữ liệu");
      });
  }, [id]);

  if (err) {
    return (
      <div className="container" style={{ paddingTop: "4rem" }}>
        <div className="error-banner">{err}</div>
        <Link to="/san-pham" className="btn btn-ghost">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="container muted" style={{ paddingTop: "4rem" }}>
        <p>Đang tải dữ liệu kỹ thuật...</p>
      </div>
    );
  }

  // Common thumbnails for detail look
  const thumbnails = [
    p.imageUrl || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800"
  ];

  return (
    <div className="container" style={{ paddingBottom: "8rem" }}>
      {/* Breadcrumbs */}
      <nav style={{ padding: "2rem 0", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--muted)" }}>
        <Link to="/" style={{ color: "inherit" }}>TRANG CHỦ</Link>
        <span style={{ margin: "0 0.75rem" }}>/</span>
        <Link to="/san-pham" style={{ color: "inherit" }}>{p.categoryName.toUpperCase()}</Link>
        <span style={{ margin: "0 0.75rem" }}>/</span>
        <span style={{ color: "var(--text)" }}>{p.name.toUpperCase()}</span>
      </nav>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "4rem", marginTop: "2rem", alignItems: "start" }}>
        {/* Left: Gallery */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="main-image-wrap">
            <div className="badge-status badge-new" style={{ top: "1.5rem", left: "1.5rem" }}>
              KINETIC SERIES
            </div>
            <img src={activeImg} alt={p.name} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {thumbnails.map((t, idx) => (
              <div 
                key={idx} 
                className={`thumb-item ${activeImg === t ? "active" : ""}`}
                onClick={() => setActiveImg(t)}
              >
                <img src={t} alt="Thumbnail" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="detail-info">
          <div className="badge-precision" style={{ marginBottom: "1.5rem" }}>
            SKU: {p.sku}
          </div>
          <h1 style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1.1, margin: "0 0 1rem" }}>
            {p.name.split(' ').slice(0, -1).join(' ')} <span className="text-gradient">{p.name.split(' ').slice(-1)}</span>
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < 4 ? "var(--accent)" : "rgba(255,107,53,0.2)"} stroke="none">
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a.53.53 0 0 0 .4.288l5.165.75c.43.063.602.593.29.897l-3.737 3.642a.53.53 0 0 0-.152.47l.882 5.144c.073.428-.376.755-.76.553l-4.62-2.428a.53.53 0 0 0-.493 0l-4.62 2.428c-.384.202-.833-.125-.76-.553l.882-5.144a.53.53 0 0 0-.152-.47L3.33 8.91c-.312-.304-.14-.834.29-.896l5.165-.75a.53.53 0 0 0 .4-.289l2.31-4.68z" />
                </svg>
              ))}
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>4.8 (124 đánh giá)</span>
          </div>

          <p className="muted" style={{ fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
            Được thiết kế để tản nhiệt tối ưu và giảm thiểu hiện tượng mất phanh. Dòng sản phẩm Kinetic của chúng tôi sở hữu cấu trúc vật liệu carbon cao cấp, đảm bảo độ bền tối đa trong điều kiện vận hành khắc nghiệt trên đường đua và đường phố.
          </p>

          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "2rem" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>{formatPrice(p.price)}</span>
            <span className="muted" style={{ textDecoration: "line-through", fontSize: "1rem" }}>{formatPrice(p.price * 1.2)}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
            <button className="btn btn-primary" style={{ height: "56px", fontSize: "1rem", fontWeight: 700 }}>
              Thêm vào giỏ hàng
            </button>
            <button className="btn btn-ghost" style={{ height: "56px", background: "rgba(255,255,255,0.03)" }}>
              Thêm vào danh sách ước
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem", color: "#00deff", fontWeight: 600 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00deff", boxShadow: "0 0 10px #00deff" }}></div>
            CÓ SẴN TRONG KHO ({p.stockQuantity} sản phẩm) - GIAO HÀNG TRONG 24H
          </div>

          <div className="core-spec-grid">
            <div className="spec-item-box">
              <span className="label">Chất liệu</span>
              <span className="value">G3000 Gray Iron</span>
            </div>
            <div className="spec-item-box">
              <span className="label">Đường kính</span>
              <span className="value">355mm (14.0")</span>
            </div>
            <div className="spec-item-box">
              <span className="label">Kiểu rãnh</span>
              <span className="value">Pillar Vane</span>
            </div>
            <div className="spec-item-box">
              <span className="label">Hoàn thiện</span>
              <span className="value">Silver Zinc Plated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Split */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", marginTop: "6rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", marginBottom: "2.5rem", borderLeft: "4px solid var(--accent)", paddingLeft: "1.5rem" }}>
            Thông số kỹ thuật
          </h2>
          <div className="tech-specs-list">
            {[
              { label: "Mã linh kiện", value: p.sku },
              { label: "Vị trí lắp", value: "Trước Trái / Phải" },
              { label: "Kiểu bu lông", value: "5 x 114.3mm" },
              { label: "Độ dày danh định", value: "32.0mm" },
              { label: "Trọng lượng", value: "24.5 lbs" },
              { label: "Xử lý bề mặt", value: "Anti-Corrosive E-Coat" },
            ].map(item => (
              <div key={item.label} className="tech-spec-row">
                <span className="label">{item.label}</span>
                <span className="value">{item.value}</span>
              </div>
            ))}
          </div>
          {p.description && (
            <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid var(--border)" }}>
               <h4 style={{ margin: "0 0 1rem", fontSize: "0.9rem", color: "var(--accent)" }}>Thông tin bổ sung từ Admin:</h4>
               <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.5, opacity: 0.8 }}>{p.description}</p>
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: "2rem", marginBottom: "2.5rem", borderLeft: "4px solid #00deff", paddingLeft: "1.5rem" }}>
            Xe tương thích
          </h2>
          <div className="compatibility-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Tương thích hoàn hảo với các cấu hình Performance Pack.
          </div>
          
          {[
            { model: "BMW M3 (F80)", years: "2014 - 2018", tag: "EXACT FIT" },
            { model: "BMW M4 (F82/F83)", years: "2014 - 2020", tag: "EXACT FIT" },
            { model: "Toyota Supra (A90)", years: "2020 - Hiện tại", tag: "EXACT FIT" },
            { model: "BMW 340i (F30)", years: "M-Sport Brakes Only", tag: "REQUIRES ADAPTER" },
          ].map((item, idx) => (
            <div key={idx} className="vehicle-item">
              <div className="vehicle-info">
                <h5>{item.model}</h5>
                <span>{item.years}</span>
              </div>
              <div className="tag-fit" style={item.tag === "REQUIRES ADAPTER" ? { color: "#ffb899" } : {}}>
                {item.tag}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lab Promo Section */}
      <div className="lab-promo-section">
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--accent)", letterSpacing: "0.15em" }}>
            THE KINETIC ENGINEERING LAB
          </span>
          <h2 style={{ fontSize: "3.5rem", fontWeight: 800, margin: "1rem 0 2rem", lineHeight: 1 }}>
            Vượt xa tiêu chuẩn <span className="text-gradient">OEM.</span>
          </h2>
          <p className="muted" style={{ fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "3rem" }}>
            Chúng tôi không chỉ thay thế phụ tùng; chúng tôi định nghĩa lại chúng. Mọi linh kiện trong dòng Kinetic đều trải qua các thử nghiệm ứng suất nhiệt nghiêm ngặt và phân tích cấu trúc âm học để đảm bảo hoạt động hoàn hảo trong những điều kiện mà linh kiện tiêu chuẩn có thể bị hỏng.
          </p>
          <button className="btn btn-ghost" style={{ border: "1px solid var(--border)", padding: "1rem 2rem" }}>
            Khám phá báo cáo kỹ thuật →
          </button>
        </div>
        <div style={{ position: "relative" }}>
          <img 
            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200" 
            className="blueprint-img" 
            alt="Engineering Lab" 
            style={{ opacity: 0.8, filter: "grayscale(1) brightness(0.6)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 30%, var(--bg) 100%)", pointerEvents: "none" }}></div>
        </div>
      </div>
    </div>
  );
}

