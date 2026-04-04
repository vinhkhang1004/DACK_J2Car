import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import { useAuth } from "./AuthContext";

function AdminRoute({ children }: { children: ReactElement }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="container muted">Đang tải…</div>;
  if (!user) return <Navigate to="/dang-nhap" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="dang-nhap" element={<Login />} />
      <Route path="dang-ky" element={<Register />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="san-pham" element={<Products />} />
        <Route path="/san-pham/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="quan-tri"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
