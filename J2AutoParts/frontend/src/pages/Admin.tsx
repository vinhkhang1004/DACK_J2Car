import { type FormEvent, useEffect, useState } from "react";
import { api, type Category, type Product, type User, type Order, type DashboardStats } from "../api";

type Tab = "products" | "users" | "orders" | "stats";

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

export default function Admin() {
  const [tab, setTab] = useState<Tab>("products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Category State
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [editCatId, setEditCatId] = useState<number | null>(null);

  // Product State
  const [pName, setPName] = useState("");
  const [pSku, setPSku] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pDiscountPrice, setPDiscountPrice] = useState("");
  const [pStock, setPStock] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pImg, setPImg] = useState("");
  const [pAdditionalImages, setPAdditionalImages] = useState<string[]>([]);
  const [pSpecs, setPSpecs] = useState("");
  const [pCompat, setPCompat] = useState("");
  const [pCategoryId, setPCategoryId] = useState<number | "">("");
  const [editProductId, setEditProductId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const cats = await api.get<Category[]>("/categories");
      setCategories(cats.data);
      
      if (tab === "products") {
        const prods = await api.get<{ content: Product[] }>("/products", { params: { size: 200 } });
        setProducts(prods.data.content);
      } else if (tab === "users") {
        const usrs = await api.get<User[]>("/admin/users");
        setUsers(usrs.data);
      } else if (tab === "orders") {
        const ords = await api.get<Order[]>("/admin/orders");
        setOrders(ords.data);
      } else if (tab === "stats") {
        const st = await api.get<DashboardStats>("/admin/stats");
        setStats(st.data);
      }
    } catch (ex: any) {
      setErr(ex.response?.data?.message || "Lỗi tải dữ liệu");
    }
  };

  useEffect(() => {
    void loadData();
  }, [tab]);

  // Actions
  async function onSaveCategory(e: FormEvent) {
    e.preventDefault();
    try {
      if (editCatId) await api.put(`/categories/${editCatId}`, { name: catName, description: catDesc || null });
      else await api.post("/categories", { name: catName, description: catDesc || null });
      setCatName(""); setCatDesc(""); setEditCatId(null);
      setMsg("Đã lưu danh mục");
      void loadData();
    } catch (ex: any) { setErr(ex.response?.data?.message || "Lỗi lưu danh mục"); }
  }

  async function deleteCategory(id: number) {
    if (!confirm("Xóa danh mục này?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setMsg("Đã xóa danh mục");
      void loadData();
    } catch (ex: any) { setErr(ex.response?.data?.message || "Lỗi xóa danh mục"); }
  }

  async function onSaveProduct(e: FormEvent) {
    e.preventDefault();
    if (pCategoryId === "") return setErr("Chọn danh mục");
    const payload = {
      name: pName, sku: pSku, price: Number(pPrice), discountPrice: pDiscountPrice ? Number(pDiscountPrice) : null,
      stockQuantity: Number(pStock), description: pDesc || null, imageUrl: pImg || null,
      specifications: pSpecs || null, compatibility: pCompat || null, categoryId: Number(pCategoryId),
      additionalImageUrls: pAdditionalImages.filter(link => !!link.trim())
    };
    try {
      if (editProductId) await api.put(`/products/${editProductId}`, payload);
      else await api.post("/products", payload);
      setPName(""); setPSku(""); setPPrice(""); setPDiscountPrice(""); setPStock(""); setPDesc(""); setPImg(""); setPAdditionalImages([]); setPSpecs(""); setPCompat(""); setPCategoryId(""); setEditProductId(null);
      setMsg("Đã lưu sản phẩm");
      void loadData();
    } catch (ex: any) { setErr(ex.response?.data?.message || "Lỗi lưu sản phẩm"); }
  }

  async function deleteProduct(id: number) {
    if (!confirm("Xóa sản phẩm này?")) return;
    try {
      await api.delete(`/products/${id}`);
      setMsg("Đã xóa sản phẩm");
      void loadData();
    } catch (ex: any) { setErr("Lỗi xóa sản phẩm"); }
  }

  async function updateOrderStatus(id: number, status: string) {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      setMsg("Đã cập nhật trạng thái đơn hàng");
      void loadData();
    } catch (ex: any) { setErr("Lỗi cập nhật đơn hàng"); }
  }

  async function updateUserRole(id: number, roles: string[]) {
    try {
      await api.put(`/admin/users/${id}/roles`, roles);
      setMsg("Đã cập nhật quyền hạn người dùng");
      void loadData();
    } catch (ex: any) { setErr("Lỗi cập nhật quyền hạn"); }
  }

  function startEditProduct(p: Product) {
    setEditProductId(p.id);
    setPName(p.name); setPSku(p.sku); setPPrice(String(p.price));
    setPDiscountPrice(p.discountPrice ? String(p.discountPrice) : "");
    setPStock(String(p.stockQuantity)); setPDesc(p.description ?? "");
    setPImg(p.imageUrl ?? ""); setPAdditionalImages(p.additionalImageUrls || []); setPSpecs(p.specifications ?? "");
    setPCompat(p.compatibility ?? ""); setPCategoryId(p.categoryId);
    setMsg(null); setErr(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEditCategory(c: Category) {
    setEditCatId(c.id);
    setCatName(c.name);
    setCatDesc(c.description ?? "");
    setMsg(null); setErr(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="container" style={{ paddingTop: "2rem" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Bảng điều khiển <span className="text-gradient">Quản trị</span></h1>
        <p className="muted">Hệ thống quản lý tài nguyên và theo dõi chỉ số kinh doanh J2 Auto Parts.</p>
      </header>

      {msg && <div className="success-banner" style={{ marginBottom: "1.5rem" }}>{msg}</div>}
      {err && <div className="error-banner" style={{ marginBottom: "1.5rem" }}>{err}</div>}

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "3rem", borderBottom: "1px solid var(--border)", paddingBottom: "1px", flexWrap: "wrap" }}>
        {[
          { id: "products", label: "Quản lý sản phẩm" },
          { id: "users", label: "Quản lý User" },
          { id: "orders", label: "Quản lý đơn hàng" },
          { id: "stats", label: "Thống kê" }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => { setTab(t.id as Tab); setMsg(null); setErr(null); }}
            style={{
              padding: "1rem 1.5rem",
              background: "none",
              border: "none",
              borderBottom: tab === t.id ? "3px solid var(--accent)" : "3px solid transparent",
              color: tab === t.id ? "white" : "var(--muted)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div style={{ display: "grid", gap: "3rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2rem", alignItems: "start" }}>
            <form className="card" onSubmit={onSaveProduct}>
              <h3 style={{ marginTop: 0 }}>{editProductId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div className="field">
                  <label>Tên phụ tùng</label>
                  <input value={pName} onChange={e => setPName(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Mã SKU</label>
                  <input value={pSku} onChange={e => setPSku(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Giá gốc (VND)</label>
                  <input type="number" value={pPrice} onChange={e => setPPrice(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Giá giảm (VND)</label>
                  <input type="number" value={pDiscountPrice} onChange={e => setPDiscountPrice(e.target.value)} />
                </div>
                <div className="field">
                  <label>Số lượng kho</label>
                  <input type="number" value={pStock} onChange={e => setPStock(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Danh mục</label>
                  <select value={pCategoryId} onChange={e => setPCategoryId(Number(e.target.value))} required>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Hình ảnh chính (URL)</label>
                  <input value={pImg} onChange={e => setPImg(e.target.value)} />
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Hình ảnh bổ sung (Dán link ảnh, mỗi dòng 1 link)</label>
                  <textarea 
                    value={pAdditionalImages.join("\n")} 
                    onChange={e => setPAdditionalImages(e.target.value.split("\n"))} 
                    rows={3} 
                    placeholder="https://example.com/image2.jpg"
                  />
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Mô tả chi tiết</label>
                  <textarea value={pDesc} onChange={e => setPDesc(e.target.value)} rows={3} />
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Thông số kỹ thuật (Dòng: Giá trị)</label>
                  <textarea value={pSpecs} onChange={e => setPSpecs(e.target.value)} rows={3} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button className="btn btn-primary">{editProductId ? "Cập nhật" : "Thêm mới"}</button>
                {editProductId && <button type="button" className="btn btn-ghost" onClick={() => {
                   setEditProductId(null); setPName(""); setPSku(""); setPPrice(""); setPDiscountPrice(""); setPStock(""); setPDesc(""); setPImg(""); setPAdditionalImages([]); setPSpecs(""); setPCompat(""); setPCategoryId("");
                }}>Hủy</button>}
              </div>
            </form>

            <div style={{ display: "grid", gap: "2rem" }}>
              <form className="card" onSubmit={onSaveCategory}>
                <h3 style={{ marginTop: 0 }}>{editCatId ? "Sửa danh mục" : "Thêm danh mục"}</h3>
                <div className="field">
                  <label>Tên danh mục</label>
                  <input value={catName} onChange={e => setCatName(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Mô tả</label>
                  <textarea value={catDesc} onChange={e => setCatDesc(e.target.value)} rows={2} />
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button className="btn btn-ghost" style={{ width: "100%" }}>{editCatId ? "Cập nhật" : "Thêm mới"}</button>
                  {editCatId && <button type="button" className="btn btn-ghost" onClick={() => {
                    setEditCatId(null); setCatName(""); setCatDesc("");
                  }}>Hủy</button>}
                </div>
              </form>

              <div className="card" style={{ padding: "1.5rem" }}>
                <h4 style={{ marginTop: 0, marginBottom: "1rem" }}>Danh mục hiện có</h4>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {categories.map(c => (
                    <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{c.name}</span>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button className="btn btn-ghost" style={{ padding: "2px 8px", fontSize: "0.7rem" }} onClick={() => startEditCategory(c)}>Sửa</button>
                        <button className="btn btn-danger" style={{ padding: "2px 8px", fontSize: "0.7rem" }} onClick={() => deleteCategory(c.id)}>Xóa</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="data-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: "1.5rem" }}>Sản phẩm</th>
                  <th>SKU</th>
                  <th>Giá</th>
                  <th>Kho</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td style={{ paddingLeft: "1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <img src={p.imageUrl || ""} width={40} height={40} style={{ borderRadius: 6, objectFit: "cover", background: "var(--bg-lighter)" }} />
                        <div>
                          <div style={{ fontWeight: 700 }}>{p.name}</div>
                          <div className="muted" style={{ fontSize: "0.75rem" }}>{p.categoryName}</div>
                        </div>
                      </div>
                    </td>
                    <td><code>{p.sku}</code></td>
                    <td>{formatPrice(p.price)}</td>
                    <td>{p.stockQuantity}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn btn-ghost" onClick={() => startEditProduct(p)}>Sửa</button>
                        <button className="btn btn-danger" onClick={() => deleteProduct(p.id)}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="data-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: "1.5rem" }}>ID</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Vai trò</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ paddingLeft: "1.5rem" }}>{u.id}</td>
                  <td style={{ fontWeight: 700 }}>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "-"}</td>
                  <td style={{ fontSize: "0.85rem", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.address || "-"}</td>
                  <td>
                    <select 
                      value={u.roles[0] || "ROLE_CUSTOMER"} 
                      onChange={e => updateUserRole(u.id, [e.target.value])}
                      style={{ 
                        background: "#1a1a1a", border: "1px solid var(--border)", borderRadius: 4, 
                        color: "white", padding: "4px", fontSize: "0.75rem", outline: "none"
                      }}
                    >
                      <option value="ROLE_CUSTOMER">Khách hàng</option>
                      <option value="ROLE_ADMIN">Quản trị viên</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "orders" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="data-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: "1.5rem" }}>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Tổng cộng</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{ paddingLeft: "1.5rem", fontWeight: 800 }}>#ORD-{o.id}</td>
                  <td className="muted">{formatDate(o.orderDate)}</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(o.totalAmount)}</td>
                  <td style={{ fontSize: "0.8rem", maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.shippingAddress}</td>
                  <td>
                    <select 
                      value={o.status} 
                      onChange={e => updateOrderStatus(o.id, e.target.value)}
                      style={{ 
                        background: "#1a1a1a", border: "1px solid var(--border)", borderRadius: 4, 
                        color: "white", padding: "4px", fontSize: "0.75rem", outline: "none"
                      }}
                    >
                      <option value="PENDING">Chờ xử lý</option>
                      <option value="SHIPPED">Đang giao</option>
                      <option value="COMPLETED">Hoàn thành</option>
                      <option value="CANCELLED">Đã hủy</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "stats" && stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <div className="muted" style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "1rem" }}>Doanh thu tổng</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--accent)" }}>{formatPrice(stats.totalRevenue)}</div>
          </div>
          <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <div className="muted" style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "1rem" }}>Người dùng</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 900 }}>{stats.totalUsers}</div>
          </div>
          <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <div className="muted" style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "1rem" }}>Đơn hàng</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 900 }}>{stats.totalOrders}</div>
          </div>
          <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <div className="muted" style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "1rem" }}>Sản phẩm</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 900 }}>{stats.totalProducts}</div>
          </div>
        </div>
      )}
    </div>
  );
}
