import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <section
        style={{
          padding: "2.5rem 0 1rem",
          display: "grid",
          gap: "1.25rem",
          maxWidth: 640,
        }}
      >
        <span className="badge">Phụ tùng chính hãng & OEM</span>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", margin: 0, letterSpacing: "-0.03em" }}>
          Tra cứu & mua bán phụ tùng ô tô — nhanh, rõ ràng, có phân quyền.
        </h1>
        <p className="muted" style={{ fontSize: "1.05rem", margin: 0 }}>
          Hệ thống gồm đăng ký / đăng nhập (khách & quản trị), danh mục và sản phẩm có phân trang, API
          REST Spring Boot + giao diện React.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
          <Link to="/san-pham" className="btn btn-primary">
            Xem sản phẩm
          </Link>
          <Link to="/dang-ky" className="btn btn-ghost">
            Tạo tài khoản khách hàng
          </Link>
        </div>
      </section>
      <section
        style={{
          marginTop: "2.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {[
          { t: "Phân quyền", d: "ROLE_ADMIN quản lý danh mục & SP; ROLE_CUSTOMER xem & mua." },
          { t: "JPA & MySQL", d: "Quan hệ User↔Role, Product↔Category, seed dữ liệu mẫu." },
          { t: "Giao diện", d: "Template hiện đại, phân trang, lọc theo danh mục & từ khóa." },
        ].map((x) => (
          <div key={x.t} className="card">
            <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.05rem" }}>{x.t}</h3>
            <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
              {x.d}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
