// src/layouts/AdminLayout.jsx
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-blue-50">
        <AdminHeader />
      <AdminSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
