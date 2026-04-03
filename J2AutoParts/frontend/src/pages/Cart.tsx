import { Link } from "react-router-dom";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";

function formatPrice(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export default function Cart() {
  const { user } = useAuth();
  const { cart, itemCount, totalAmount, updateQuantity, removeItem, clearCart, loading } = useCart();

  if (!user) {
    return (
      <div className="container" style={{ paddingTop: "8rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Bạn chưa đăng nhập</h2>
        <p className="muted" style={{ marginBottom: "2rem" }}>Vui lòng đăng nhập để xem và quản lý giỏ hàng của bạn.</p>
        <Link to="/dang-nhap" className="btn btn-primary" style={{ padding: "1rem 2rem" }}>Đăng nhập ngay</Link>
      </div>
    );
  }

  if (loading && cart.length === 0) {
    return (
      <div className="container" style={{ paddingTop: "8rem", textAlign: "center" }}>
        <p className="muted">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ paddingTop: "8rem", textAlign: "center" }}>
        <div style={{ 
          width: 80, 
          height: 80, 
          borderRadius: "50%", 
          background: "rgba(255,255,255,0.03)", 
          display: "grid", 
          placeItems: "center", 
          margin: "0 auto 2rem" 
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.062 2h2.292l2.333 12.571a2 2 0 0 0 2 1.429h9.882a2 2 0 0 0 2-1.429l1.429-7.571h-14.882" />
          </svg>
        </div>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Giỏ hàng trống</h2>
        <p className="muted" style={{ marginBottom: "2.5rem" }}>Bạn chưa thêm sản phẩm nào vào giỏ hàng của mình.</p>
        <Link to="/san-pham" className="btn btn-primary" style={{ padding: "1rem 2.5rem" }}>Khám phá phụ tùng</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "4rem", paddingBottom: "8rem" }}>
      <header style={{ marginBottom: "3rem" }}>
        <div className="badge-precision" style={{ marginBottom: "0.75rem" }}>
          KINETIC SHOPPING EXPERIENCE
        </div>
        <h1 style={{ fontSize: "3rem", fontWeight: 800 }}>Giỏ hàng <span className="text-gradient">của bạn</span></h1>
        <p className="muted">Bạn đang có {itemCount} sản phẩm trong danh sách chuẩn bị đặt hàng.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "4rem", alignItems: "start" }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="data-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: "1.5rem" }}>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => {
                const effectivePrice = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.unitPrice;
                return (
                  <tr key={item.id}>
                    <td style={{ padding: "1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                        <div style={{ 
                          width: 80, 
                          height: 80, 
                          borderRadius: 12, 
                          overflow: "hidden", 
                          background: "var(--bg-lighter)",
                          border: "1px solid var(--border)",
                          flexShrink: 0
                        }}>
                          <img 
                            src={item.productImageUrl || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200"} 
                            alt={item.productName} 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: "1rem" }}>{item.productName}</h4>
                          <span className="muted" style={{ fontSize: "0.75rem", fontWeight: 600 }}>SKU: PRD-{item.productId}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 700 }}>{formatPrice(effectivePrice)}</span>
                        {item.discountPrice && item.discountPrice > 0 && (
                          <span className="muted" style={{ fontSize: "0.8rem", textDecoration: "line-through" }}>
                            {formatPrice(item.unitPrice)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ 
                        display: "inline-flex", 
                        alignItems: "center", 
                        background: "rgba(255,255,255,0.03)", 
                        borderRadius: "6px",
                        padding: "2px"
                      }}>
                        <button 
                          className="btn btn-ghost" 
                          style={{ width: 32, height: 32, padding: 0 }}
                          onClick={() => void updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span style={{ width: 32, textAlign: "center", fontWeight: 700, fontSize: "0.9rem" }}>{item.quantity}</span>
                        <button 
                          className="btn btn-ghost" 
                          style={{ width: 32, height: 32, padding: 0 }}
                          onClick={() => void updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stockQuantity}
                        >
                          +
                        </button>
                      </div>
                      {item.quantity >= item.stockQuantity && (
                        <div style={{ fontSize: "0.65rem", color: "#ffb899", marginTop: "4px" }}>Đã đạt giới hạn kho</div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: "white" }}>{formatPrice(effectivePrice * item.quantity)}</span>
                    </td>
                    <td style={{ paddingRight: "1.5rem", textAlign: "right" }}>
                      <button 
                        className="btn btn-ghost" 
                        style={{ color: "var(--muted)", padding: "0.5rem" }}
                        onClick={() => void removeItem(item.id)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: "1.5rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
             <Link to="/san-pham" className="btn btn-ghost" style={{ fontSize: "0.85rem" }}>← Tiếp tục mua sắm</Link>
             <button className="btn btn-ghost" style={{ fontSize: "0.85rem", color: "#ffb899" }} onClick={() => void clearCart()}>Xóa tất cả</button>
          </div>
        </div>

        <div style={{ position: "sticky", top: "100px" }}>
          <div className="card">
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Tổng kết đơn hàng</h3>
            <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="muted">Số lượng</span>
                <span>{itemCount} sản phẩm</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="muted">Tạm tính</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="muted">Vận chuyển</span>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>Miễn phí</span>
              </div>
              <div style={{ 
                marginTop: "1rem", 
                paddingTop: "1.25rem", 
                borderTop: "1px solid var(--border)",
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "baseline"
              }}>
                <span style={{ fontWeight: 700 }}>Tổng tiền</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)" }}>{formatPrice(totalAmount)}</span>
              </div>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: "100%", height: "56px", fontSize: "1rem", fontWeight: 700 }}
              onClick={() => alert("Tính năng thanh toán đang được phát triển!")}
            >
              Tiến hành đặt hàng
            </button>
            <p className="muted" style={{ fontSize: "0.7rem", textAlign: "center", marginTop: "1rem" }}>
               Bằng cách đặt hàng, bạn đồng ý với các điều khoản và quy định của J2 Auto Parts.
            </p>
          </div>
          
          <div style={{ 
            marginTop: "1.5rem", 
            padding: "1.5rem", 
            background: "rgba(0,222,255,0.03)", 
            borderRadius: "12px", 
            border: "1px dashed rgba(0,222,255,0.2)",
            display: "flex",
            gap: "1rem",
            alignItems: "center"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00deff" strokeWidth="2">
              <path d="m12 14 4-4-4-4M3 3h4.632c1.077 0 1.996.793 2.148 1.859l.3 2.141M3.333 13.5l1.667 9H19l1.667-9M12 21v-4" />
            </svg>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#00deff", lineHeight: 1.4 }}>
              <strong>KINETIC PRIORITY:</strong> Bạn đã đủ điều kiện được giao hàng ưu tiên trong 12h.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
