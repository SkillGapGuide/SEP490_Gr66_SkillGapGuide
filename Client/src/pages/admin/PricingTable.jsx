import { useState } from "react";
import { Pencil, X } from "lucide-react";

const PricingTable = () => {
  const [pricingPackages, setPricingPackages] = useState([
    { name: "Miễn phí", price: "0 VNĐ", duration: "Vô thời hạn", level: 0 },
    { name: "Nâng cao", price: "100.000 VNĐ", duration: "1 tháng", level: 1 },
    { name: "Toàn diện", price: "150.000 VNĐ", duration: "1 tháng", level: 2 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newPackage, setNewPackage] = useState({ name: "", price: "", level: "" });

  const handleCreate = () => {
    if (!newPackage.name || !newPackage.price || newPackage.level === "") return;

    setPricingPackages([
      ...pricingPackages,
      {
        name: newPackage.name,
        price: newPackage.price,
        duration: "1 tháng",
        level: Number(newPackage.level),
      },
    ]);
    setNewPackage({ name: "", price: "", level: "" });
    setShowModal(false);
  };

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-indigo-800">Gói đánh giá</h1>
        <div className="flex items-center gap-2">
          <button className="text-sm border px-3 py-1 rounded hover:bg-gray-100">
            📤 Xuất file (.pdf, .xls)
          </button>
          <button
            className="bg-blue-500 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-600"
            onClick={() => setShowModal(true)}
          >
            + Tạo gói mới
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-4 py-2">Tên gói</th>
              <th className="border px-4 py-2">Mức giá (VNĐ)</th>
              <th className="border px-4 py-2">Thời hạn</th>
              <th className="border px-4 py-2">Cấp độ</th>
              <th className="border px-4 py-2 text-center">Chỉnh sửa</th>
            </tr>
          </thead>
          <tbody>
            {pricingPackages.map((pkg, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{pkg.name}</td>
                <td className="border px-4 py-2 text-red-600 font-semibold">{pkg.price}</td>
                <td className="border px-4 py-2">{pkg.duration}</td>
                <td className="border px-4 py-2">{pkg.level}</td>
                <td className="border px-4 py-2 text-center">
                  <button className="text-gray-600 hover:text-blue-500">
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border shadow-md w-[320px] p-5 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-center text-lg font-semibold mb-4">Tạo gói đăng ký mới</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Tên gói đăng ký"
                className="bg-blue-100 px-3 py-2 rounded text-sm"
                value={newPackage.name}
                onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Mức giá (VNĐ)"
                className="bg-blue-100 px-3 py-2 rounded text-sm"
                value={newPackage.price}
                onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
              />
              <input
                type="number"
                placeholder="Cấp độ"
                className="bg-blue-100 px-3 py-2 rounded text-sm"
                value={newPackage.level}
                onChange={(e) => setNewPackage({ ...newPackage, level: e.target.value })}
              />
              <button
                onClick={handleCreate}
                className="mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Tạo mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingTable;
