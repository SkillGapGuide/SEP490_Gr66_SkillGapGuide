import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen hide-scrollbar">
      <Header />
      <main className="flex-1">
        <Outlet />   {/* Nơi render các trang con */}
      </main>
      <Footer />
    </div>
  );
}
