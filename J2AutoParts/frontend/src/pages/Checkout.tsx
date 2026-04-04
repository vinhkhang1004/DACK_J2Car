import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";
import { api, type OrderRequest } from "../api";

export default function Checkout() {
  const { user } = useAuth();
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="container" style={{ paddingTop: "6rem", textAlign: "center" }}>
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p className="muted">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
        <Link to="/san-pham" className="btn btn-primary" style={{ marginTop: "2rem" }}>
          Khám phá phụ tùng
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    const request: OrderRequest = {
      shippingAddress: address,
      phone: phone,
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    try {
      await api.post("/orders", request);
      clearCart();
      navigate("/profile", { state: { msg: "Đặt hàng thành công! Đơn hàng của bạn đang được xử lý." } });
    } catch (ex: any) {
      setErr(ex.response?.data?.message || "Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Thanh toán <span className="text-gradient">Đơn hàng</span></h1>
        <p className="muted">Vui lòng kiểm tra lại giỏ hàng và cung cấp thông tin giao hàng.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "4rem", alignItems: "start" }}>
        {/* Left: Shipping Form */}
        <div>
          <form className="card" onSubmit={handleSubmit} style={{ padding: "2.5rem" }}>
            <h3 style={{ marginTop: 0, marginBottom: "2rem" }}>Thông tin giao hàng</h3>
            
            {err && <div className="error-banner" style={{ marginBottom: "2rem" }}>{err}</div>}

            <div className="field">
              <label>Địa chỉ nhận hàng (Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố)</label>
              <textarea 
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                required 
                rows={3}
                placeholder="VD: 123 Đường ABC, Quận 1, TP. HCM"
              />
            </div>

            <div className="field">
              <label>Số điện thoại liên hệ</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                required 
                placeholder="VD: 0901234567"
              />
            </div>

            <div style={{ marginTop: "3rem", padding: "1.5rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.6 }} className="muted">
                Bằng cách nhấp vào "Xác nhận đặt hàng", bạn đồng ý với các điều khoản dịch vụ và chính sách bảo mật của J2 Auto Parts. Đơn hàng của bạn sẽ được xử lý ngay lập tức.
              </p>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: "100%", height: "60px", marginTop: "2rem", fontSize: "1.1rem", fontWeight: 800 }}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
            </button>
            
            <Link to="/cart" className="btn btn-ghost" style={{ width: "100%", marginTop: "1rem", textAlign: "center", display: "block" }}>
              Quay lại giỏ hàng
            </Link>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div style={{ position: "sticky", top: "100px" }}>
          <div className="card" style={{ padding: "2rem" }}>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Tóm tắt đơn hàng</h3>
            
            <div style={{ display: "grid", gap: "1.25rem", marginBottom: "2rem" }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                   <div style={{ width: 60, height: 60, borderRadius: 8, overflow: "hidden", background: "var(--bg-lighter)" }}>
                     <img src={item.productImageUrl || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                   </div>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{item.productName}</div>
                     <div className="muted" style={{ fontSize: "0.85rem" }}>x{item.quantity}</div>
                   </div>
                   <div style={{ fontWeight: 700 }}>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.unitPrice * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span className="muted">Tạm tính</span>
                <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <span className="muted">Phí vận chuyển</span>
                <span style={{ color: "#22c55e", fontWeight: 600 }}>MIỄN PHÍ</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Tổng cộng</span>
                <span style={{ fontWeight: 900, fontSize: "1.8rem", color: "var(--accent)" }}>
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total)}
                </span>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#22c55e", fontSize: "0.85rem", fontWeight: 700 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              GIAO DỊCH AN TOÀN & BẢO MẬT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
