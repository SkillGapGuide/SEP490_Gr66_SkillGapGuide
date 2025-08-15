import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useState, useEffect, memo, useRef, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { showInfo } from "../utils/alert";
import defaultAvatar from "../assets/default_avatar.png";

const ANALYZE_PATH = "/analyze"; // đường dẫn sau khi pass check

const Header = memo(function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userAvatar, setUserAvatar] = useState(defaultAvatar);
  const [uploading, setUploading] = useState(false);

  const profileMenuRef = useRef(null);
  const { user } = useContext(UserContext);

  // --- one-time hint for "Phân tích"
  const [showAnalyzeHint, setShowAnalyzeHint] = useState(() => {
    return !localStorage.getItem("hideAnalyzeHint");
  });
  useEffect(() => {
    if (!showAnalyzeHint) return;
    const t = setTimeout(() => {
      setShowAnalyzeHint(false);
      localStorage.setItem("hideAnalyzeHint", "1");
    }, 8000);
    return () => clearTimeout(t);
  }, [showAnalyzeHint]);
  const dismissAnalyzeHint = () => {
    setShowAnalyzeHint(false);
    localStorage.setItem("hideAnalyzeHint", "1");
  };

  // --- helper: chuẩn hoá avatar URL ---
  const normalizeAvatar = (raw) => {
    if (!raw) return null;
    const url = String(raw).trim();
    if (url.startsWith("data:") || url.startsWith("blob:")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = import.meta.env.VITE_API_URL || "";
    return `${base}/${url.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    const checkLoginStatus = () => setIsLoggedIn(!!localStorage.getItem("token"));
    checkLoginStatus();
    window.addEventListener("authStateChanged", checkLoginStatus);
    return () => window.removeEventListener("authStateChanged", checkLoginStatus);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const src = normalizeAvatar(user?.avatar) || defaultAvatar;
    setUserAvatar(src);
  }, [user]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ---- click "Phân tích" (bắt đăng nhập, rồi điều hướng) ----
  const handleAnalyzeClick = (e) => {
    e.preventDefault();
    dismissAnalyzeHint();

    if (!localStorage.getItem("token")) {
      showInfo("Vui lòng đăng nhập để sử dụng tính năng nhé !");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      navigate(ANALYZE_PATH);
    }, 1600);
  };

  const menus = [
    { label: "Trang chủ", to: "/" },
    { label: "Phân tích", to: ANALYZE_PATH, highlight: true },
    { label: "Gói dịch vụ", to: "/servicepayment" },
    {
      label: "Về chúng tôi",
      submenu: [
        { label: "Giới thiệu", to: "/about-us" },
        { label: "Liên hệ", to: "/contact" },
      ],
    },
    { label: "Đánh giá", to: "/servicerating" },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-400 to-blue-300 px-6 py-3 shadow-md w-full">
      <nav className="max-w-7xl mx-auto flex items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-3xl font-bold mr-12 tracking-wide">
          SkillGapGuide
        </Link>

        {/* Menu */}
        <ul className="flex-1 flex items-center gap-8 text-white font-normal text-lg">
          {menus.map((menu) =>
            menu.submenu ? (
              <li key={menu.label} className="relative group">
                <span className="flex items-center gap-1 hover:text-blue-100 cursor-pointer py-2">
                  {menu.label}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
                <div className="absolute left-0 top-full transform translate-y-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <ul className="bg-white rounded-lg shadow-xl text-gray-700 overflow-hidden min-w-[180px]">
                    {menu.submenu.map((item) => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          className="block px-6 py-3 hover:bg-blue-50 whitespace-nowrap text-base transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ) : menu.highlight ? (
              // ---- Mục "Phân tích" nổi bật + logic check đăng nhập ----
              <li key={menu.label} className="relative">
                <Link
                  to={menu.to}
                  onClick={handleAnalyzeClick}
                  className={`relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold shadow-md border border-white/20 transition
                    ${uploading ? "bg-white/70 text-blue-400 cursor-wait" : "bg-white text-blue-700 hover:shadow-lg hover:-translate-y-0.5"}
                  `}
                  aria-label="Phân tích - tải CV/JD để xem khoảng cách kỹ năng"
                  aria-busy={uploading}
                >
                  <span className="relative">
                    {uploading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Đang mở…
                      </span>
                    ) : (
                      "Phân tích"
                    )}
                    {/* Ping chấm vàng */}
                    {!uploading && (
                      <span className="absolute -top-2 -right-3 h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </span>
                    )}
                  </span>
                  {/* Badge hướng dẫn */}
                  {!uploading && (
                    <span className="hidden md:inline text-[10px] uppercase tracking-wide bg-amber-500 text-white px-2 py-0.5 rounded">
                      Bắt đầu tại đây
                    </span>
                  )}
                </Link>

                {/* Tooltip gợi ý (hiện 1 lần) */}
                {showAnalyzeHint && !uploading && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white text-gray-700 text-xs shadow-xl rounded-lg px-3 py-2 z-50 border border-gray-100">
                    Nhấn <b>Phân tích</b> để tải CV/JD và xem Gap kỹ năng!
                    <button
                      onClick={dismissAnalyzeHint}
                      className="ml-2 underline text-blue-600 hover:text-blue-700"
                    >
                      Đã hiểu
                    </button>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white drop-shadow" />
                  </div>
                )}
              </li>
            ) : (
              <li key={menu.label}>
                <Link to={menu.to} className="hover:underline">
                  {menu.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Login / Register / Profile */}
        <div className="flex items-center gap-2 ml-4">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="bg-white text-blue-900 font-semibold rounded-xl px-5 py-1.5 shadow hover:bg-blue-100 transition border border-blue-200"
              >
                Đăng Nhập
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-900 font-semibold rounded-xl px-5 py-1.5 shadow hover:bg-blue-100 transition border border-blue-200"
              >
                Đăng Kí
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 bg-white rounded-full p-1 hover:ring-2 hover:ring-blue-300 transition"
                >
                  <img
                    src={userAvatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      if (e.currentTarget.src !== defaultAvatar) {
                        e.currentTarget.src = defaultAvatar;
                      }
                    }}
                  />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        Thông tin cá nhân
                      </Link>
                      
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
});

export default Header;
