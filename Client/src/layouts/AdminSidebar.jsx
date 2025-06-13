import { NavLink } from "react-router-dom";

const menu = [
  { label: "Bảng điều khiển", to: "/admin" },
  { label: "Quản lý người dùng", to: "/admin/users" },
  { label: "Quản lý thanh toán", to: "/admin/payments" },
  { label: "Quản lý nội dung Homepage", to: "/admin/home-content" },
  { label: "Quản lý nội dung About Us", to: "/admin/about-content" },
  { label: "Quản lý nội dung tỉnh", to: "/admin/province-content" },
  { label: "Quản lý liên kết", to: "/admin/links" },
  { label: "Quản lý nội dung Footer", to: "/admin/footer-content" },
];

export default function AdminSidebar() {
  return (
    <aside className="bg-blue-300 min-h-screen w-64 p-6 flex flex-col gap-2 rounded-tr-3xl rounded-br-3xl shadow-lg">
      <nav className="flex flex-col gap-2">
        {menu.map((item, idx) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block py-2 px-4 rounded-lg text-white font-semibold tracking-wide transition-all
              ${isActive ? "bg-blue-500 shadow text-white" : "hover:bg-blue-400 hover:text-white"}`
            }
            end={idx === 0} // Make "Bảng điều khiển" exact match
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
