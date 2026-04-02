import { type FormEvent, useEffect, useState } from "react";
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
  const [localQ, setLocalQ] = useState(q);

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

  function applyFilters(e: FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams();
    next.set("page", "0");
    if (localQ.trim()) next.set("q", localQ.trim());
    if (cat) next.set("categoryId", cat);
    setSearchParams(next);
  }

  function goPage(p: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
  }

  return (
    <div className="container">
      <h1 style={{ marginTop: 0 }}>Sản phẩm</h1>
      <form
        onSubmit={applyFilters}
        className="card"
        style={{ marginBottom: "1.5rem", display: "grid", gap: "1rem" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            alignItems: "end",
          }}
        >
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="cat">Danh mục</label>
            <select
              id="cat"
              value={cat}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                next.set("page", "0");
                if (e.target.value) next.set("categoryId", e.target.value);
                else next.delete("categoryId");
                setSearchParams(next);
              }}
            >
              <option value="">Tất cả</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.productCount})
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="q">Từ khóa (tên / SKU)</label>
            <input id="q" value={localQ} onChange={(e) => setLocalQ(e.target.value)} placeholder="VD: Bosch" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: 44 }}>
            Tìm kiếm
          </button>
        </div>
      </form>

      {loading && <p className="muted">Đang tải danh sách…</p>}
      {!loading && data && (
        <>
          <div className="grid-products">
            {data.content.map((p) => (
              <Link key={p.id} to={`/san-pham/${p.id}`} className="card" style={{ overflow: "hidden" }}>
                <div
                  style={{
                    aspectRatio: "4/3",
                    background: "#0f1218",
                    margin: "-1.25rem -1.25rem 0.75rem",
                    backgroundImage: p.imageUrl ? `url(${p.imageUrl})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="badge" style={{ marginBottom: "0.35rem" }}>
                  {p.categoryName}
                </div>
                <h2 style={{ fontSize: "1rem", margin: "0 0 0.35rem", lineHeight: 1.35 }}>{p.name}</h2>
                <p className="muted" style={{ fontSize: "0.8rem", margin: "0 0 0.5rem" }}>
                  SKU: {p.sku}
                </p>
                <p style={{ fontWeight: 700, margin: 0, color: "#ffb899" }}>{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
          {data.content.length === 0 && <p className="muted">Không có sản phẩm phù hợp.</p>}
          <div className="pager">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={page <= 0}
              onClick={() => goPage(page - 1)}
            >
              ← Trước
            </button>
            <span className="muted">
              Trang {page + 1} / {Math.max(1, data.totalPages)} — {data.totalElements} sản phẩm
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={data.last}
              onClick={() => goPage(page + 1)}
            >
              Sau →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
