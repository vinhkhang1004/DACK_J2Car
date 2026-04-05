import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { api, type Order, type Product } from "../api";
import { useCart } from "../CartContext";

type Tab = "profile" | "orders" | "wishlist";

function formatPrice(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    PENDING: { bg: "rgba(255,165,0,0.15)", color: "#ffa500", label: "Chờ xử lý" },
    SHIPPED: { bg: "rgba(0,191,255,0.15)", color: "#00bfff", label: "Đang giao" },
    COMPLETED: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", label: "Hoàn thành" },
    CANCELLED: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", label: "Đã hủy" },
  };
  const s = styles[status] || styles.PENDING;
  return (
    <span style={{ 
      background: s.bg, 
      color: s.color, 
      padding: "0.25rem 0.75rem", 
      borderRadius: "100px", 
      fontSize: "0.75rem", 
      fontWeight: 800,
      border: `1px solid ${s.color}33`
    }}>
      {s.label}
    </span>
  );
};

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const location = useLocation();
  const [tab, setTab] = useState<Tab>("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Edit Profile States
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [msg, setMsg] = useState<string | null>(location.state?.msg || null);
  const [err, setErr] = useState<string | null>(null);
  
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    if (tab === "orders") {
      void api.get<Order[]>("/orders").then(r => setOrders(r.data));
    } else if (tab === "wishlist") {
      void api.get<Product[]>("/wishlists").then(r => setWishlist(r.data));
    }
  }, [tab]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null);
    try {
      await api.put("/auth/profile", { fullName, phone, address });
      await refreshProfile();
      setMsg("Cập nhật thông tin thành công");
    } catch (ex: any) {
      setErr("Lỗi cập nhật hồ sơ");
    }
  }

  async function handleCancelOrder(orderId: number) {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không? Quá trình này không thể hoàn tác.")) return;
    setErr(null);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      const r = await api.get<Order[]>("/orders");
      setOrders(r.data);
      setMsg("Đã hủy đơn hàng thành công. Tồn kho đã được hoàn lại.");
    } catch (ex: any) {
      setErr(ex.response?.data?.message || "Lỗi khi hủy đơn hàng");
    }
  }

  async function handleRemoveWishlist(productId: number) {
    try {
      await api.post(`/wishlists/${productId}`);
      setWishlist(wishlist.filter(p => p.id !== productId));
      setMsg("Đã xoá khỏi danh sách yêu thích");
    } catch (e) {
      setErr("Lỗi khi xoá phẩm khỏi danh sách yêu thích");
    }
  }

  return (
    <div className="container" style={{ paddingTop: "4rem", paddingBottom: "6rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <header style={{ marginBottom: "3rem", textAlign: "center", width: "100%" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Tài khoản của <span className="text-gradient">{user?.fullName.split(' ')[0]}</span></h1>
        <p className="muted">Quản lý thông tin cá nhân và quản lý đơn hàng của bạn.</p>
      </header>

      {msg && <div className="success-banner" style={{ marginBottom: "2.5rem", width: "100%", maxWidth: "800px" }}>{msg}</div>}
      {err && <div className="error-banner" style={{ marginBottom: "2.5rem", width: "100%", maxWidth: "800px" }}>{err}</div>}

      <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem", background: "rgba(255,255,255,0.02)", padding: "0.5rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
        <button 
          onClick={() => setTab("profile")}
          className={`btn ${tab === "profile" ? "btn-primary" : "btn-ghost"}`}
          style={{ padding: "0.75rem 2rem" }}
        >
          Thông tin cá nhân
        </button>
        <button 
          onClick={() => setTab("orders")}
          className={`btn ${tab === "orders" ? "btn-primary" : "btn-ghost"}`}
          style={{ padding: "0.75rem 2rem" }}
        >
          Đơn hàng của tôi
        </button>
        <button 
          onClick={() => setTab("wishlist")}
          className={`btn ${tab === "wishlist" ? "btn-primary" : "btn-ghost"}`}
          style={{ padding: "0.75rem 2rem" }}
        >
          Danh sách yêu thích
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: "800px" }}>
        {tab === "profile" && (
          <form className="card" onSubmit={handleUpdateProfile} style={{ padding: "3rem" }}>
            <h3 style={{ marginTop: 0, marginBottom: "2rem" }}>Chỉnh sửa thông tin</h3>
            <div className="field">
              <label>Họ và tên</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className="field">
              <label>Địa chỉ Email</label>
              <input value={user?.email} disabled style={{ opacity: 0.6 }} />
            </div>
            <div className="field">
              <label>Số điện thoại</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="09xx xxx xxx" />
            </div>
            <div className="field">
              <label>Địa chỉ mặc định</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} placeholder="Số nhà, tên đường, phường/xã..." />
            </div>
            <button className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>Lưu thay đổi</button>
          </form>
        )}

        {tab === "orders" && (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {orders.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
                <p className="muted">Bạn chưa có đơn hàng nào.</p>
                <Link to="/san-pham" className="btn btn-ghost" style={{ marginTop: "1rem" }}>Bắt đầu mua sắm ngay</Link>
              </div>
            ) : (
              orders.map(o => (
                <div key={o.id} className="card" style={{ padding: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                    <div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.25rem" }}>MÃ ĐƠN: #ORD-{o.id}</div>
                      <div className="muted" style={{ fontSize: "0.85rem" }}>Ngày đặt: {new Date(o.orderDate).toLocaleDateString("vi-VN")}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      {o.status === "PENDING" && (
                        <button 
                          className="btn btn-ghost" 
                          style={{ color: "#ef4444", fontSize: "0.75rem", padding: "0.4rem 0.8rem", height: "auto" }}
                          onClick={() => handleCancelOrder(o.id)}
                        >
                          Hủy đơn hàng
                        </button>
                      )}
                      <StatusBadge status={o.status} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: "1.25rem", marginBottom: "2rem" }}>
                    {o.items.map(item => (
                      <div key={item.id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <img 
                          src={item.productImageUrl || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&q=80"} 
                          style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover", background: "var(--bg-lighter)" }} 
                          alt={item.productName}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{item.productName}</div>
                          <div className="muted" style={{ fontSize: "0.85rem" }}>x{item.quantity} - {formatPrice(item.unitPrice)}</div>
                        </div>
                        <div style={{ fontWeight: 700 }}>{formatPrice(item.unitPrice * item.quantity)}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div style={{ maxWidth: "70%" }}>
                      <div className="muted" style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.5rem" }}>Địa chỉ giao hàng</div>
                      <div style={{ fontSize: "0.85rem", lineHeight: 1.5, opacity: 0.9 }}>{o.shippingAddress}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="muted" style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.25rem" }}>Tổng thanh toán</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--accent)" }}>{formatPrice(o.totalAmount)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "wishlist" && (
          <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "1fr" }}>
            {wishlist.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
                <p className="muted">Danh sách yêu thích của bạn đang trống.</p>
                <Link to="/san-pham" className="btn btn-ghost" style={{ marginTop: "1rem" }}>Khám phá phụ tùng</Link>
              </div>
            ) : (
              wishlist.map(p => (
                <div key={p.id} className="card" style={{ padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
                  <img 
                    src={p.imageUrl || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&q=80"} 
                    style={{ width: 100, height: 100, borderRadius: 8, objectFit: "cover", background: "var(--bg-lighter)" }} 
                    alt={p.name}
                  />
                  <div style={{ flex: 1 }}>
                    <Link to={`/san-pham/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <h4 style={{ margin: "0 0 0.5rem", fontSize: "1.2rem", fontWeight: 700 }}>{p.name}</h4>
                    </Link>
                    <div style={{ color: "var(--accent)", fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                      {formatPrice(p.discountPrice || p.price)}
                    </div>
                    <div className="muted" style={{ fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {p.description}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: "150px" }}>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => void addToCart(p.id, 1)}
                    >
                      Thêm vào giỏ
                    </button>
                    <button 
                      className="btn btn-ghost" 
                      onClick={() => handleRemoveWishlist(p.id)}
                      style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
                    >
                      Xoá khỏi danh sách
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
