import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
import type { ApiError } from "../api";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setPending(true);
    try {
      await login(email.trim(), password);
      nav("/");
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        const data = ex.response?.data as ApiError | undefined;
        setErr(data?.message ?? "Đăng nhập thất bại");
      } else setErr("Lỗi không xác định");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Đăng nhập</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Tài khoản quản trị mặc định: <code>admin@j2autoparts.local</code> / <code>Admin@123</code>
      </p>
      {err && <div className="error-banner">{err}</div>}
      <form className="card" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={pending} style={{ width: "100%" }}>
          {pending ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
        <p className="muted" style={{ marginTop: "1rem", marginBottom: 0, fontSize: "0.9rem" }}>
          Chưa có tài khoản? <Link to="/dang-ky">Đăng ký</Link>
        </p>
      </form>
    </div>
  );
}
