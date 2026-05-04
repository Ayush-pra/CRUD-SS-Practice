import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Spinner from "../components/Spinner.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/login", form);
      navigate("/profile");
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">
          Log in to continue building your feed.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
            />
          </div>

          {error ? <p className="text-sm text-rose-500">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
          {loading ? <Spinner label="Authenticating" /> : null}
        </form>
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <Link to="/signup" className="font-semibold text-slate-900">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
