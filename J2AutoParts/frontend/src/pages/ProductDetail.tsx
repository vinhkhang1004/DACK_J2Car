import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { api, type Product, type Review, type ReviewRequestPayload } from "../api";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";

function formatPrice(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState<Product | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState("");
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewInput, setReviewInput] = useState("");
  const [ratingInput, setRatingInput] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

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

    void api
      .get<Review[]>(`/reviews/product/${id}`)
      .then((r) => setReviews(r.data))
      .catch(console.error);
  }, [id]);

  const fetchReviews = async () => {
    if (!id) return;
    try {
      const res = await api.get<Review[]>(`/reviews/product/${id}`);
      setReviews(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p) return;
    try {
      const payload: ReviewRequestPayload = {
        productId: p.id,
        rating: ratingInput,
        comment: reviewInput
      };
      if (editingReviewId) {
        await api.put(`/reviews/${editingReviewId}`, payload);
        setEditingReviewId(null);
      } else {
        await api.post("/reviews", payload);
      }
      setReviewInput("");
      setRatingInput(5);
      await fetchReviews();
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá", err);
      alert("Đã có lỗi xảy ra khi gửi đánh giá!");
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xoá đánh giá này?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      await fetchReviews();
    } catch (err) {
      console.error(err);
      alert("Xoá đánh giá thất bại.");
    }
  };

  const handleEditClick = (r: Review) => {
    setEditingReviewId(r.id);
    setRatingInput(r.rating);
    setReviewInput(r.comment);
  };

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

  // Parse specifications: "Label: Value" per line
  const specs = (p.specifications || "")
    .split("\n")
    .map(line => {
      const parts = line.split(":");
      if (parts.length < 2) return null;
      return { 
        label: parts[0].trim(), 
        value: parts.slice(1).join(":").trim() 
      };
    })
    .filter((s): s is { label: string; value: string } => s !== null);

  // Take first 4 for the core grid, or empty array
  const coreSpecs = specs.slice(0, 4);

  // Use actual images from the product
  const thumbnails = [
    p.imageUrl || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800",
    ...(p.additionalImageUrls || [])
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
              {Array.from({ length: 5 }).map((_, i) => {
                const avg = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;
                return (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < Math.round(avg) ? "var(--accent)" : "rgba(255,107,53,0.2)"} stroke="none">
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a.53.53 0 0 0 .4.288l5.165.75c.43.063.602.593.29.897l-3.737 3.642a.53.53 0 0 0-.152.47l.882 5.144c.073.428-.376.755-.76.553l-4.62-2.428a.53.53 0 0 0-.493 0l-4.62 2.428c-.384.202-.833-.125-.76-.553l.882-5.144a.53.53 0 0 0-.152-.47L3.33 8.91c-.312-.304-.14-.834.29-.896l5.165-.75a.53.53 0 0 0 .4-.289l2.31-4.68z" />
                  </svg>
                );
              })}
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "Chưa có"} ({reviews.length} đánh giá)
            </span>
          </div>

          <p className="muted" style={{ fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "2.5rem", whiteSpace: "pre-line" }}>
            {p.description || "Phụ tùng chất lượng cao được thiết kế tỉ mỉ để đảm bảo hiệu suất và độ bền tối đa cho phương tiện của bạn."}
          </p>

          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "2rem" }}>
            {p.discountPrice && p.discountPrice > 0 ? (
              <>
                <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>{formatPrice(p.discountPrice)}</span>
                <span className="muted" style={{ textDecoration: "line-through", fontSize: "1rem" }}>{formatPrice(p.price)}</span>
              </>
            ) : (
              <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>{formatPrice(p.price)}</span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              background: "rgba(255,255,255,0.05)", 
              borderRadius: "8px",
              padding: "0.25rem"
            }}>
              <button 
                className="btn btn-ghost" 
                style={{ width: 40, height: 40, padding: 0 }}
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                -
              </button>
              <span style={{ width: 40, textAlign: "center", fontWeight: 700 }}>{qty}</span>
              <button 
                className="btn btn-ghost" 
                style={{ width: 40, height: 40, padding: 0 }}
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ height: "56px", fontSize: "1rem", fontWeight: 700, flex: 1 }}
              onClick={() => void addToCart(p.id, qty)}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
          <button className="btn btn-ghost" style={{ height: "56px", width: "100%", background: "rgba(255,255,255,0.03)", marginBottom: "2rem" }}>
            Thêm vào danh sách ước
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem", color: "#00deff", fontWeight: 600 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00deff", boxShadow: "0 0 10px #00deff" }}></div>
            CÓ SẴN TRONG KHO ({p.stockQuantity} sản phẩm) - GIAO HÀNG TRONG 24H
          </div>

          {coreSpecs.length > 0 && (
            <div className="core-spec-grid">
              {coreSpecs.map((s, i) => (
                <div key={i} className="spec-item-box">
                  <span className="label">{s.label}</span>
                  <span className="value">{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Split */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", marginTop: "6rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", marginBottom: "2.5rem", borderLeft: "4px solid var(--accent)", paddingLeft: "1.5rem" }}>
            Thông số kỹ thuật
          </h2>
          {specs.length > 0 ? (
            <div className="tech-specs-list">
              {specs.map((item, i) => (
                <div key={i} className="tech-spec-row">
                  <span className="label">{item.label}</span>
                  <span className="value">{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">Liên hệ để biết thêm thông số kỹ thuật chi tiết.</p>
          )}

        </div>

        <div>
          <h2 style={{ fontSize: "2rem", marginBottom: "2.5rem", borderLeft: "4px solid #00deff", paddingLeft: "1.5rem" }}>
            Xe tương thích
          </h2>
          {p.compatibility ? (
            <>
              <div className="compatibility-card">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                Tương thích hoàn hảo với các cấu hình được liệt kê.
              </div>
              <div style={{ 
                whiteSpace: "pre-line", 
                lineHeight: 1.6, 
                fontSize: "1rem", 
                color: "var(--text)", 
                opacity: 0.8,
                background: "rgba(255,255,255,0.02)",
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid var(--border)"
              }}>
                {p.compatibility}
              </div>
            </>
          ) : (
            <p className="muted">Vui lòng cung cấp số VIN để kiểm tra độ tương thích chính xác.</p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: "6rem", marginBottom: "6rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", borderLeft: "4px solid var(--accent)", paddingLeft: "1.5rem" }}>
          Đánh giá & Bình luận
        </h2>
        
        {/* Form */}
        {user ? (
          <form className="review-form" onSubmit={handleReviewSubmit} style={{ marginBottom: "3rem", background: "rgba(255,255,255,0.03)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>{editingReviewId ? "Sửa đánh giá của bạn" : "Viết đánh giá của bạn"}</h3>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill={i < ratingInput ? "var(--accent)" : "rgba(255,255,255,0.1)"} stroke="none" style={{ cursor: "pointer", transition: "fill 0.2s" }} onClick={() => setRatingInput(i + 1)}>
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a.53.53 0 0 0 .4.288l5.165.75c.43.063.602.593.29.897l-3.737 3.642a.53.53 0 0 0-.152.47l.882 5.144c.073.428-.376.755-.76.553l-4.62-2.428a.53.53 0 0 0-.493 0l-4.62 2.428c-.384.202-.833-.125-.76-.553l.882-5.144a.53.53 0 0 0-.152-.47L3.33 8.91c-.312-.304-.14-.834.29-.896l5.165-.75a.53.53 0 0 0 .4-.289l2.31-4.68z" />
                </svg>
              ))}
            </div>
            <textarea 
              value={reviewInput}
              onChange={(e) => setReviewInput(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              style={{ width: "100%", minHeight: "100px", padding: "1rem", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", color: "var(--text)", marginBottom: "1.5rem", resize: "vertical" }}
              required
            ></textarea>
            <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className="btn btn-primary">
                {editingReviewId ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                </button>
                {editingReviewId && (
                <button type="button" className="btn btn-ghost" onClick={() => { setEditingReviewId(null); setReviewInput(""); setRatingInput(5); }}>
                    Huỷ
                </button>
                )}
            </div>
          </form>
        ) : (
          <div style={{ marginBottom: "3rem", padding: "2rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px dashed var(--border)", textAlign: "center" }}>
            <p className="muted" style={{ marginBottom: "1rem" }}>Vui lòng đăng nhập để viết đánh giá.</p>
            <Link to="/dang-nhap" className="btn btn-outline" style={{ display: "inline-block" }}>Đăng nhập ngay</Link>
          </div>
        )}

        {/* List */}
        {reviews.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {reviews.map((r) => (
              <div key={r.id} style={{ padding: "1.5rem", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <h4 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem", fontWeight: 700 }}>{r.userName}</h4>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < r.rating ? "var(--accent)" : "rgba(255,255,255,0.1)"} stroke="none">
                          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a.53.53 0 0 0 .4.288l5.165.75c.43.063.602.593.29.897l-3.737 3.642a.53.53 0 0 0-.152.47l.882 5.144c.073.428-.376.755-.76.553l-4.62-2.428a.53.53 0 0 0-.493 0l-4.62 2.428c-.384.202-.833-.125-.76-.553l.882-5.144a.53.53 0 0 0-.152-.47L3.33 8.91c-.312-.304-.14-.834.29-.896l5.165-.75a.53.53 0 0 0 .4-.289l2.31-4.68z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="muted" style={{ fontSize: "0.85rem" }}>
                    {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <p style={{ margin: 0, lineHeight: 1.6, color: "var(--text)", opacity: 0.9 }}>
                  {r.comment}
                </p>
                {user && user.id === r.userId && (
                  <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                    <button onClick={() => handleEditClick(r)} className="btn btn-ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 1rem", border: "1px solid var(--border)" }}>Sửa</button>
                    <button onClick={() => handleDeleteReview(r.id)} className="btn btn-ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 1rem", border: "1px solid rgba(255, 107, 53, 0.5)", color: "var(--accent)" }}>Xoá</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">Chưa có đánh giá nào cho sản phẩm này.</p>
        )}
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

