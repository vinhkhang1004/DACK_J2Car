import { useEffect, useState } from "react";
import { api, type Order } from "../api";
import { useAuth } from "../AuthContext";

function formatPrice(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, any> = {
    PENDING: { bg: "rgba(255, 171, 0, 0.1)", color: "#ffab00", label: "Chờ xử lý" },
    SHIPPED: { bg: "rgba(0, 184, 217, 0.1)", color: "#00b8d9", label: "Đang giao" },
    COMPLETED: { bg: "rgba(54, 179, 126, 0.1)", color: "#36b37e", label: "Hoàn thành" },
    CANCELLED: { bg: "rgba(255, 86, 48, 0.1)", color: "#ff5630", label: "Đã hủy" },
  };
  const s = styles[status] || styles.PENDING;
  return (
    <span style={{
      padding: "0.25rem 0.75rem",
      borderRadius: "6px",
      fontSize: "0.75rem",
      fontWeight: 700,
      background: s.bg,
      color: s.color,
      textTransform: "uppercase",
    }}>
      {s.label}
    </span>
  );
}

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "orders">("info");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "orders" && user) {
      setLoadingOrders(true);
      void api.get<Order[]>("/orders")
        .then(r => setOrders(r.data))
        .finally(() => setLoadingOrders(false));
    }
  }, [activeTab, user]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put("/auth/profile", { fullName, phone, address });
      await refreshProfile();
      alert("Cập nhật thông tin thành công!");
    } catch (e: any) {
      alert(e.response?.data?.message || "Lỗi khi cập nhật thông tin");
    } finally {
      setUpdating(false);
    }
  }

  if (!user) return <div className="container muted" style={{ paddingTop: "8rem", textAlign: "center" }}>Vui lòng đăng nhập để xem thông tin.</div>;

  return (
    <div className="container" style={{ paddingTop: "4rem", paddingBottom: "8rem" }}>
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <div className="badge-precision" style={{ marginBottom: "0.75rem" }}>
          USER ACCOUNT CENTER
        </div>
        <h1 style={{ fontSize: "3rem", fontWeight: 800 }}>Xin chào, <span className="text-gradient">{user.fullName}</span></h1>
        <p className="muted">Quản lý thông tin kỹ thuật và theo dõi tiến độ đơn hàng của bạn.</p>
      </header>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "3rem", borderBottom: "1px solid var(--border)", paddingBottom: "1px" }}>
        <button 
          onClick={() => setActiveTab("info")}
          style={{
            padding: "1rem 2rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "info" ? "3px solid var(--accent)" : "3px solid transparent",
            color: activeTab === "info" ? "white" : "var(--muted)",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Thông tin cá nhân
        </button>
        <button 
          onClick={() => setActiveTab("orders")}
          style={{
            padding: "1rem 2rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "orders" ? "3px solid var(--accent)" : "3px solid transparent",
            color: activeTab === "orders" ? "white" : "var(--muted)",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Lịch sử đơn hàng
        </button>
      </div>

      {activeTab === "info" ? (
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <form className="card" style={{ display: "grid", gap: "1.5rem" }} onSubmit={handleUpdateProfile}>
            <div className="field">
              <label>Địa chỉ Email (Không thể thay đổi)</label>
              <input value={user.email} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
            </div>
            <div className="field">
              <label>Họ và tên</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className="field">
              <label>Số điện thoại</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0xxx xxx xxx" />
            </div>
            <div className="field">
              <label>Địa chỉ giao hàng mặc định</label>
              <textarea 
                value={address} 
                onChange={e => setAddress(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "100px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "1rem",
                  color: "white",
                  fontSize: "1rem"
                }}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
              />
            </div>
            <button className="btn btn-primary" style={{ height: "48px", padding: "0 2.5rem", marginTop: "1rem" }} disabled={updating}>
              {updating ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {loadingOrders ? (
            <div style={{ padding: "4rem", textAlign: "center" }} className="muted">Đang tải lịch sử đơn hàng...</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center" }} className="muted">Bạn chưa có đơn hàng nào.</div>
          ) : (
            <table className="data-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: "1.5rem" }}>Mã đơn hàng</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                  <th>Tổng cộng</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ paddingLeft: "1.5rem" }}>
                      <span style={{ fontWeight: 800 }}>#ORD-{o.id}</span>
                    </td>
                    <td className="muted" style={{ fontSize: "0.85rem" }}>{formatDate(o.orderDate)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td><span style={{ fontWeight: 700, color: "white" }}>{formatPrice(o.totalAmount)}</span></td>
                    <td style={{ textAlign: "right", paddingRight: "1.5rem" }}>
                      <button className="btn btn-ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
