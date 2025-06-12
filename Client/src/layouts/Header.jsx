import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(null);

  // Menu có submenu
  const menus = [
    { label: "Trang chủ", to: "/" },
    {
      label: "Về chúng tôi",
      submenu: [
        { label: "Giới thiệu", to: "/about-us" },
        { label: "Liên hệ", to: "/contact" },
      ],
    },
    {
      label: "Thanh toán",
      submenu: [
        { label: "Học phí", to: "/pricing" },
        { label: "Hỗ trợ", to: "/support" },
      ],
    },
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
          {menus.map((menu, i) =>
            menu.submenu ? (
              <li
                key={menu.label}
                className="relative group"
                onMouseEnter={() => setOpenMenu(i)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <span className="flex items-center gap-1 hover:text-blue-100 cursor-pointer py-2">
                  {menu.label}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
                {/* Dropdown with padding to prevent hover gap */}
                <div className="absolute left-0 top-full pt-2">
                  <ul className={`bg-white rounded-lg shadow-xl text-gray-700 overflow-hidden ${
                    openMenu === i ? "block" : "hidden"
                  }`}>
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
            ) : (
              <li key={menu.label}>
                <Link
                  to={menu.to}
                  className="hover:underline"
                >
                  {menu.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Button Đăng ký/Đăng nhập */}
        <div className="flex gap-2 ml-4">
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
