import React, { useEffect, useRef, useState } from "react";
import { authService } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleChangePassword = () => {
    setMenuOpen(false);
    navigate("/change-password");
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!menuOpen) return;
      const target = e.target;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  return (
    <header className="bg-blue-300 flex items-center justify-between px-8 py-3 shadow relative">
      {/* Logo / Title */}
      <div className="text-white text-3xl font-bold tracking-wide">
        <Link to="/">SkillGapGuide</Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          className="bg-white text-blue-800 font-semibold px-5 py-1.5 rounded-lg shadow-sm border border-black/30 hover:bg-blue-100 transition"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>

        {/* Sun icon */}
        <button
          type="button"
          aria-label="Toggle theme"
          className="text-2xl text-blue-900 hover:brightness-110 transition"
          title="Theme"
        >
          {/* Heroicons Sun */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
            strokeWidth={2} stroke="currentColor" className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.219 4.219l1.061 1.061M17.657 17.657l1.061 1.061M3 12h1.5M19.5 12H21M4.219 19.781l1.061-1.061M17.657 6.343l1.061-1.061M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
          </svg>
        </button>

        {/* Avatar + Menu */}
        <div className="relative">
          <button
            ref={btnRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="bg-white rounded-full p-1 shadow-md ring-1 ring-black/5 hover:shadow transition"
            title="Tài khoản"
          >
            {/* Heroicons User */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
              strokeWidth={2} stroke="#3b82f6" className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 19.25a7.5 7.5 0 0115 0v.125a2.625 2.625 0 01-2.625 2.625h-9.75A2.625 2.625 0 014.5 19.375v-.125z" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div
              ref={menuRef}
              role="menu"
              aria-label="User menu"
              className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-lg z-50 overflow-hidden"
            >
              {/* (Tuỳ chọn) Profile */}
           

              <button
                role="menuitem"
                onClick={handleChangePassword}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                Đổi mật khẩu
              </button>

              <div className="my-1 h-px bg-gray-100" />

             
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
