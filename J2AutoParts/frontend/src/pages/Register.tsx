import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
import type { ApiError } from "../api";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setPending(true);
    try {
      await register(email.trim(), password, fullName.trim());
      nav("/");
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        const data = ex.response?.data as ApiError | undefined;
        setErr(data?.message ?? "Đăng ký thất bại");
      } else setErr("Lỗi không xác định");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Đăng ký khách hàng</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Sau khi đăng ký bạn có vai trò <strong>Khách hàng</strong> (ROLE_CUSTOMER).
      </p>
      {err && <div className="error-banner">{err}</div>}
      <form className="card" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="fullName">Họ tên</label>
          <input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            minLength={2}
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Mật khẩu (tối thiểu 6 ký tự)</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={pending} style={{ width: "100%" }}>
          {pending ? "Đang tạo tài khoản…" : "Đăng ký"}
        </button>
        <p className="muted" style={{ marginTop: "1rem", marginBottom: 0, fontSize: "0.9rem" }}>
          Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}
