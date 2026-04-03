import axios from "axios";
import { type FormEvent, useEffect, useState } from "react";
import { api, type ApiError, type Category, type Product } from "../api";

type Tab = "categories" | "products";

function formatPrice(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export default function Admin() {
  const [tab, setTab] = useState<Tab>("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [editCatId, setEditCatId] = useState<number | null>(null);

  const [pName, setPName] = useState("");
  const [pSku, setPSku] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pDiscountPrice, setPDiscountPrice] = useState("");
  const [pStock, setPStock] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pImg, setPImg] = useState("");
  const [pSpecs, setPSpecs] = useState("");
  const [pCompat, setPCompat] = useState("");
  const [pCategoryId, setPCategoryId] = useState<number | "">("");
  const [editProductId, setEditProductId] = useState<number | null>(null);

  async function reloadCategories() {
    const { data } = await api.get<Category[]>("/categories");
    setCategories(data);
  }

  async function reloadProducts() {
    const { data } = await api.get<{ content: Product[] }>("/products", {
      params: { page: 0, size: 200, sort: "id,desc" },
    });
    setProducts(data.content);
  }

  useEffect(() => {
    void reloadCategories().catch(() => setErr("Không tải được danh mục"));
  }, []);

  useEffect(() => {
    if (tab === "products") {
      void reloadProducts().catch(() => setErr("Không tải được sản phẩm"));
    }
  }, [tab]);

  async function onSaveCategory(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    try {
      if (editCatId) {
        await api.put(`/categories/${editCatId}`, { name: catName, description: catDesc || null });
        setMsg("Đã cập nhật danh mục");
      } else {
        await api.post("/categories", { name: catName, description: catDesc || null });
        setMsg("Đã thêm danh mục");
      }
      setCatName("");
      setCatDesc("");
      setEditCatId(null);
      await reloadCategories();
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        const d = ex.response?.data as ApiError | undefined;
        setErr(d?.message ?? "Lỗi lưu danh mục");
      }
    }
  }

  function startEditCategory(c: Category) {
    setEditCatId(c.id);
    setCatName(c.name);
    setCatDesc(c.description ?? "");
    setMsg(null);
  }

  async function deleteCategory(id: number) {
    if (!confirm("Xóa danh mục? Chỉ xóa khi không còn sản phẩm.")) return;
    setErr(null);
    try {
      await api.delete(`/categories/${id}`);
      setMsg("Đã xóa danh mục");
      await reloadCategories();
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        const d = ex.response?.data as ApiError | undefined;
        setErr(d?.message ?? "Không xóa được");
      }
    }
  }

  async function onSaveProduct(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (pCategoryId === "") {
      setErr("Chọn danh mục");
      return;
    }
    const payload = {
      name: pName,
      sku: pSku,
      price: Number(pPrice),
      discountPrice: pDiscountPrice ? Number(pDiscountPrice) : null,
      stockQuantity: Number(pStock),
      description: pDesc || null,
      imageUrl: pImg || null,
      specifications: pSpecs || null,
      compatibility: pCompat || null,
      categoryId: Number(pCategoryId),
    };
    try {
      if (editProductId) {
        await api.put(`/products/${editProductId}`, payload);
        setMsg("Đã cập nhật sản phẩm");
      } else {
        await api.post("/products", payload);
        setMsg("Đã thêm sản phẩm");
      }
      setPName("");
      setPSku("");
      setPPrice("");
      setPDiscountPrice("");
      setPStock("");
      setPDesc("");
      setPImg("");
      setPSpecs("");
      setPCompat("");
      setPCategoryId("");
      setEditProductId(null);
      await reloadProducts();
      await reloadCategories();
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        const d = ex.response?.data as ApiError | undefined;
        setErr(d?.message ?? "Lỗi lưu sản phẩm");
      }
    }
  }

  function startEditProduct(p: Product) {
    setEditProductId(p.id);
    setPName(p.name);
    setPSku(p.sku);
    setPPrice(String(p.price));
    setPDiscountPrice(p.discountPrice ? String(p.discountPrice) : "");
    setPStock(String(p.stockQuantity));
    setPDesc(p.description ?? "");
    setPImg(p.imageUrl ?? "");
    setPSpecs(p.specifications ?? "");
    setPCompat(p.compatibility ?? "");
    setPCategoryId(p.categoryId);
    setTab("products");
    setMsg(null);
  }

  async function deleteProduct(id: number) {
    if (!confirm("Xóa sản phẩm này?")) return;
    setErr(null);
    try {
      await api.delete(`/products/${id}`);
      setMsg("Đã xóa sản phẩm");
      await reloadProducts();
      await reloadCategories();
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        const d = ex.response?.data as ApiError | undefined;
        setErr(d?.message ?? "Không xóa được");
      }
    }
  }

  return (
    <div className="container">
      <h1 style={{ marginTop: 0 }}>Quản trị</h1>
      <p className="muted">Chỉ tài khoản ROLE_ADMIN. CRUD danh mục & sản phẩm qua API đã bảo vệ JWT.</p>
      {msg && <div className="success-banner">{msg}</div>}
      {err && <div className="error-banner">{err}</div>}

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <button
          type="button"
          className={tab === "categories" ? "btn btn-primary" : "btn btn-ghost"}
          onClick={() => setTab("categories")}
        >
          Danh mục
        </button>
        <button
          type="button"
          className={tab === "products" ? "btn btn-primary" : "btn btn-ghost"}
          onClick={() => setTab("products")}
        >
          Sản phẩm
        </button>
      </div>

      {tab === "categories" && (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <form className="card" onSubmit={onSaveCategory}>
            <h2 style={{ marginTop: 0 }}>{editCatId ? "Sửa danh mục" : "Thêm danh mục"}</h2>
            <div className="field">
              <label>Tên</label>
              <input value={catName} onChange={(e) => setCatName(e.target.value)} required />
            </div>
            <div className="field">
              <label>Mô tả</label>
              <textarea value={catDesc} onChange={(e) => setCatDesc(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="submit" className="btn btn-primary">
                Lưu
              </button>
              {editCatId && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setEditCatId(null);
                    setCatName("");
                    setCatDesc("");
                  }}
                >
                  Hủy sửa
                </button>
              )}
            </div>
          </form>

          <div className="card" style={{ overflowX: "auto" }}>
            <h2 style={{ marginTop: 0 }}>Danh sách</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Slug</th>
                  <th>SP</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td className="muted">{c.slug}</td>
                    <td>{c.productCount}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button type="button" className="btn btn-ghost" onClick={() => startEditCategory(c)}>
                        Sửa
                      </button>
                      <button type="button" className="btn btn-danger" onClick={() => void deleteCategory(c.id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <form className="card" onSubmit={onSaveProduct}>
            <h2 style={{ marginTop: 0 }}>{editProductId ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <div className="field">
                <label>Tên</label>
                <input value={pName} onChange={(e) => setPName(e.target.value)} required />
              </div>
              <div className="field">
                <label>SKU</label>
                <input value={pSku} onChange={(e) => setPSku(e.target.value)} required />
              </div>
              <div className="field">
                <label>Giá (VND)</label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={pPrice}
                  onChange={(e) => setPPrice(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Giá sau giảm (VND - Tuỳ chọn)</label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={pDiscountPrice}
                  onChange={(e) => setPDiscountPrice(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Tồn kho</label>
                <input
                  type="number"
                  min={0}
                  value={pStock}
                  onChange={(e) => setPStock(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Danh mục</label>
                <select
                  value={pCategoryId === "" ? "" : String(pCategoryId)}
                  onChange={(e) => setPCategoryId(e.target.value ? Number(e.target.value) : "")}
                  required
                >
                  <option value="">— Chọn —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>URL ảnh (tuỳ chọn)</label>
                <input value={pImg} onChange={(e) => setPImg(e.target.value)} placeholder="https://..." />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Mô tả</label>
                <textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)} />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Thông số kỹ thuật (Định dạng: Tên: Giá trị - Mỗi dòng một mục)</label>
                <textarea 
                  value={pSpecs} 
                  onChange={(e) => setPSpecs(e.target.value)} 
                  placeholder={"Chất liệu: Thép cao cấp\nĐường kính: 300mm"}
                  rows={4}
                />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Xe tương thích (Nhập tự do)</label>
                <textarea 
                  value={pCompat} 
                  onChange={(e) => setPCompat(e.target.value)} 
                  placeholder="BMW M3, M4..."
                  rows={4}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="submit" className="btn btn-primary">
                Lưu
              </button>
              {editProductId && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setEditProductId(null);
                    setPName("");
                    setPSku("");
                    setPPrice("");
                    setPDiscountPrice("");
                    setPStock("");
                    setPDesc("");
                    setPImg("");
                    setPSpecs("");
                    setPCompat("");
                    setPCategoryId("");
                  }}
                >
                  Hủy sửa
                </button>
              )}
            </div>
          </form>

          <div className="card" style={{ overflowX: "auto" }}>
            <h2 style={{ marginTop: 0 }}>Danh sách</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>SKU</th>
                  <th>Giá</th>
                  <th>Danh mục</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td>{p.categoryName}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button type="button" className="btn btn-ghost" onClick={() => startEditProduct(p)}>
                        Sửa
                      </button>
                      <button type="button" className="btn btn-danger" onClick={() => void deleteProduct(p.id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
