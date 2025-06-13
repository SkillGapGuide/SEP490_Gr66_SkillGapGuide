export default function AdminHeader() {
  return (
    <header className="bg-blue-300 flex items-center justify-between px-8 py-3 shadow">
      {/* Logo / Title */}
      <div className="text-white text-3xl font-bold tracking-wide">
        SkillGapGuide
      </div>
      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          className="bg-white text-blue-800 font-semibold px-5 py-1.5 rounded-lg shadow-sm border border-black/30 hover:bg-blue-100 transition"
        >
          Đăng xuất
        </button>
        {/* Sun icon */}
        <span className="text-2xl text-blue-900 cursor-pointer hover:brightness-110 transition">
          {/* Heroicons Sun */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.219 4.219l1.061 1.061M17.657 17.657l1.061 1.061M3 12h1.5M19.5 12H21M4.219 19.781l1.061-1.061M17.657 6.343l1.061-1.061M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
          </svg>
        </span>
        {/* User icon */}
        <span className="bg-white rounded-full p-1 shadow-md">
          {/* Heroicons User */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#3b82f6" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 19.25a7.5 7.5 0 0115 0v.125a2.625 2.625 0 01-2.625 2.625h-9.75A2.625 2.625 0 014.5 19.375v-.125z" />
          </svg>
        </span>
      </div>
    </header>
  );
}
