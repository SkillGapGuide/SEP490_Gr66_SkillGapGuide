// src/layouts/AdminLayout.jsx
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader className="fixed top-0 w-full z-40" />
      
      <div className="flex">
        <AdminSidebar className="fixed left-0 h-screen z-30" />
        
        <main className="flex-1 ml-20 mt-16 p-8">
          {/* Breadcrumb section */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          
          {/* Main content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
