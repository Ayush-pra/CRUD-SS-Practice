import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/feed" className="text-lg font-semibold tracking-tight text-slate-900">
          Sfera
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
         
          <Link to="/profile" className="transition hover:text-slate-900">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-full border border-slate-200 px-4 py-1.5 text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
