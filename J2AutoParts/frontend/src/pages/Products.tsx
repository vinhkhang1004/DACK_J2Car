import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, type Category, type Paged, type Product } from "../api";

function formatPrice(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "0") || 0;
  const q = searchParams.get("q") ?? "";
  const cat = searchParams.get("categoryId") ?? "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<Paged<Product> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void api.get<Category[]>("/categories").then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, size: 12, sort: "name,asc" };
    if (q.trim()) params.q = q.trim();
    if (cat) params.categoryId = Number(cat);
    void api
      .get<Paged<Product>>("/products", { params })
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [page, q, cat]);

  function handleCategoryClick(id: string) {
    const next = new URLSearchParams(searchParams);
    next.set("page", "0");
    if (id === cat) next.delete("categoryId");
    else next.set("categoryId", id);
    setSearchParams(next);
  }

  function goPage(p: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
  }

  const totalPages = data?.totalPages ?? 1;
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="container" style={{ paddingBottom: "6rem" }}>
      {/* Page Header */}
      <header style={{ marginTop: "2rem", marginBottom: "4rem" }}>
        <div className="badge-precision" style={{ marginBottom: "1rem" }}>
          INVENTORY CATALOG V2.4
        </div>
        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, margin: 0 }}>
          High-Performance <span className="text-gradient">Components</span>
        </h1>
        <p className="muted" style={{ fontSize: "1.1rem", maxWidth: "600px", marginTop: "1rem" }}>
          Thiết bị được chế tạo chính xác cho những người đam mê hiện đại. Lọc theo hệ thống, thương hiệu hoặc thông số hiệu suất để tìm mảnh ghép hoàn hảo.
        </p>
      </header>

      <div className="products-grid-layout">
        {/* Sidebar Filters */}
        <aside className="sidebar-filters">
          <div className="filter-group">
            <h4>Hệ thống (Systems)</h4>
            <ul className="category-filter-list">
              <li
                className={`category-filter-item ${!cat ? "active" : ""}`}
                onClick={() => handleCategoryClick("")}
              >
                <span>Tất cả</span>
                <span className="category-count">
                  {categories.reduce((acc, c) => acc + (c.productCount || 0), 0)}
                </span>
              </li>
              {categories.map((c) => (
                <li
                  key={c.id}
                  className={`category-filter-item ${cat === String(c.id) ? "active" : ""}`}
                  onClick={() => handleCategoryClick(String(c.id))}
                >
                  <span>{c.name}</span>
                  <span className="category-count">{c.productCount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h4>Thương hiệu (Brands)</h4>
            {[
              "Brembo Racing",
              "Mishimoto Tech",
              "Garrett Motion",
              "Ohlins Dynamics",
            ].map((brand) => (
              <label key={brand} className="brand-checkbox">
                <input type="checkbox" style={{ accentColor: "var(--accent)" }} />
                <span>{brand}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Khoảng giá (Price Range)</h4>
            <div style={{ paddingRight: "1rem" }}>
              <input type="range" min="0" max="50000000" step="1000000" />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginTop: "0.75rem" }} className="muted">
                <span>0đ</span>
                <span>50tr+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <span className="muted" style={{ fontSize: "0.95rem" }}>
              Hiển thị {data?.totalElements ?? 0} kết quả
            </span>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div className="page-num active" style={{ width: 36, height: 36 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </div>
              <div className="page-num" style={{ width: 36, height: 36 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </div>
            </div>
          </div>

          {loading && <p className="muted">Đang tải danh sách...</p>}

          <div className="grid-products" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
            {data?.content.map((p, idx) => (
              <div key={p.id} className="product-card-premium">
                <Link to={`/san-pham/${p.id}`} className="card-image-wrap">
                  <img src={p.imageUrl || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800"} alt={p.name} />
                  <div className={`badge-status ${idx % 3 === 0 ? "badge-new" : idx % 5 === 0 ? "badge-low" : "badge-in-stock"}`}>
                    {idx % 3 === 0 ? "NEW ARRIVAL" : idx % 5 === 0 ? "LOW STOCK" : "IN STOCK"}
                  </div>
                </Link>
                <div className="card-body">
                  <span className="product-tag">{p.categoryName}</span>
                  <Link to={`/san-pham/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <h3 style={{ fontSize: "1.15rem", margin: "0.25rem 0 0.75rem", lineHeight: 1.3, fontWeight: 700 }}>
                      {p.name}
                    </h3>
                  </Link>
                  <p className="muted" style={{ fontSize: "0.85rem", margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    Cấu tạo từ hợp kim chất lượng cao, thiết kế tối ưu cho hiệu năng và độ bền vượt trội. SKU: {p.sku}
                  </p>
                  
                  <div style={{ display: "flex", gap: "2px", marginTop: "1rem" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < 4 ? "var(--accent)" : "rgba(255,107,53,0.2)"} stroke="none">
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a.53.53 0 0 0 .4.288l5.165.75c.43.063.602.593.29.897l-3.737 3.642a.53.53 0 0 0-.152.47l.882 5.144c.073.428-.376.755-.76.553l-4.62-2.428a.53.53 0 0 0-.493 0l-4.62 2.428c-.384.202-.833-.125-.76-.553l.882-5.144a.53.53 0 0 0-.152-.47L3.33 8.91c-.312-.304-.14-.834.29-.896l5.165-.75a.53.53 0 0 0 .4-.289l2.31-4.68z" />
                      </svg>
                    ))}
                    <span style={{ fontSize: "0.75rem", marginLeft: "4px", fontWeight: 700 }}>4.0</span>
                  </div>

                  <div className="card-price-row">
                    <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "white" }}>
                      {formatPrice(p.price)}
                    </span>
                    <button className="btn-add-cart">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && data?.content.length === 0 && (
            <p className="muted" style={{ textAlign: "center", marginTop: "4rem" }}>Không tìm thấy sản phẩm phù hợp.</p>
          )}

          {/* Numbered Pagination */}
          {totalPages > 1 && (
            <div className="pagination-numbered">
              <button
                className={`page-num ${page === 0 ? "disabled" : ""}`}
                onClick={() => page > 0 && goPage(page - 1)}
                disabled={page === 0}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              
              {pages.map((p) => (
                <button
                  key={p}
                  className={`page-num ${page === p ? "active" : ""}`}
                  onClick={() => goPage(p)}
                >
                  {p + 1}
                </button>
              ))}

              <button
                className={`page-num ${page === totalPages - 1 ? "disabled" : ""}`}
                onClick={() => page < totalPages - 1 && goPage(page + 1)}
                disabled={page === totalPages - 1}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

