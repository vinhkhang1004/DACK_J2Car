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

  useEffect(() => {
    if (!id) return;
    void api
      .get<Product>(`/products/${id}`)
      .then((r) => setP(r.data))
      .catch((e) => {
        if (axios.isAxiosError(e) && e.response?.status === 400) setErr("Không tìm thấy sản phẩm");
        else setErr("Không tải được dữ liệu");
      });
  }, [id]);

  if (err) {
    return (
      <div className="container">
        <div className="error-banner">{err}</div>
        <Link to="/san-pham" className="btn btn-ghost">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="container muted">
        <p>Đang tải…</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/san-pham" className="muted" style={{ fontSize: "0.9rem" }}>
        ← Sản phẩm
      </Link>
      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        <div
          className="card"
          style={{
            padding: 0,
            overflow: "hidden",
            minHeight: 280,
            background: "#0f1218",
            backgroundImage: p.imageUrl ? `url(${p.imageUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div>
          <div className="badge">{p.categoryName}</div>
          <h1 style={{ margin: "0.5rem 0" }}>{p.name}</h1>
          <p className="muted" style={{ margin: "0 0 0.5rem" }}>
            SKU: <strong style={{ color: "var(--text)" }}>{p.sku}</strong>
          </p>
          <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ffb899", margin: "0.5rem 0 1rem" }}>
            {formatPrice(p.price)}
          </p>
          <p className="muted" style={{ margin: "0 0 1rem" }}>
            Tồn kho: <strong style={{ color: "var(--text)" }}>{p.stockQuantity}</strong>
          </p>
          {p.description && (
            <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{p.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
