import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import Feed from "./pages/Feed.jsx";
import UploadProfilePic from "./pages/UploadProfilePic.jsx";

const App = () => {
  const location = useLocation();
  const hideNav = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f1f5f9,_#ffffff_35%,_#f8fafc_70%)] text-slate-900">
      {!hideNav ? <Navbar /> : null}
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/picture" element={<UploadProfilePic />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
