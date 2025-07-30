import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

const payments = [
  {
    id: "01",
    email: "A@example.com",
    package: "Nâng cao",
    time: "11:00:01 24/05/2024",
    total: "100.000VNĐ",
    status: "Hoạt động",
  },
  {
    id: "02",
    email: "B@example.com",
    package: "Toàn diện",
    time: "01:00:52 17/04/2024",
    total: "200.000VNĐ",
    status: "Hoạt động",
  },
  {
    id: "03",
    email: "C@example.com",
    package: "Nâng cao",
    time: "19:02:43 27/03/2024",
    total: "100.000VNĐ",
    status: "Hết hạn",
  },
];

const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold text-indigo-800">Quản lý thanh toán</h2>
        <div className="flex items-center border rounded px-2 py-1 w-full lg:w-[300px]">
          <input
            type="text"
            placeholder="Nhập tên người dùng / id của đơn"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 text-sm outline-none px-2 py-1"
          />
          <Search size={16} className="text-gray-400" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 text-sm">
        <button className="border px-3 py-1 rounded flex items-center gap-1">
          Tổng đơn (100.000-300.000) <ChevronDown size={14} />
        </button>
        <button className="border px-3 py-1 rounded flex items-center gap-1">
          Trạng thái <ChevronDown size={14} />
        </button>
        <button className="border px-3 py-1 rounded flex items-center gap-1">
          Gói <ChevronDown size={14} />
        </button>
        <button className="border px-3 py-1 rounded flex items-center gap-1">
          Ngày bắt đầu <span className="text-gray-400">📅</span>
        </button>
        <button className="border px-3 py-1 rounded flex items-center gap-1">
          Ngày kết thúc <span className="text-gray-400">📅</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-3 py-2 border">ID ⬍</th>
              <th className="px-3 py-2 border">Email ⬍</th>
              <th className="px-3 py-2 border">Gói</th>
              <th className="px-3 py-2 border">Thời gian ⬍</th>
              <th className="px-3 py-2 border">Tổng đơn</th>
              <th className="px-3 py-2 border">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {payments
              .filter((p) =>
                p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.id.includes(searchTerm)
              )
              .map((p, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{p.id}</td>
                  <td className="border px-3 py-2 text-gray-600">{p.email}</td>
                  <td className="border px-3 py-2">{p.package}</td>
                  <td className="border px-3 py-2">{p.time}</td>
                  <td className="border px-3 py-2 text-blue-600 font-medium">{p.total}</td>
                  <td className="border px-3 py-2">
                    <span
                      className={`text-sm font-semibold ${
                        p.status === "Hoạt động" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentManagement;
