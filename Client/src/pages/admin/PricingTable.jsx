import { useState, useEffect } from "react";
import {
  Pencil,
  X,
  BadgeCheck,
  BadgeX,
  Loader,
  PlusCircle,
} from "lucide-react";
import { MdOutlinePriceChange } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { subscriptionService } from "../../services/subscriptionService";
import { showError, showSuccess } from "../../utils/alert";

const PricingTable = () => {
  const [pricingPackages, setPricingPackages] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [createData, setCreateData] = useState({
    subscriptionName: "",
    price: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
    // eslint-disable-next-line
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await subscriptionService.getAllSubscriptions();
      setPricingPackages(res || []);
    } catch (err) {
      alert("Lỗi khi tải danh sách subscription!");
    } finally {
      setLoading(false);
    }
  };

  // Chỉnh sửa
  const handleEdit = (pkg) => {
    setEditData({
      ...pkg,
      price: pkg.price,
      subscriptionName: pkg.subscriptionName || pkg.name,
      status: pkg.status || "ACTIVE",
    });
    setShowEditModal(true);
  };

  // Lưu chỉnh sửa
  const handleSave = async () => {
    if (!editData || editData.subscriptionName.length == 0 || !editData.price) {
      showError("Vui lòng nhập đầy đủ thông tin các trường thông tin !");
      return;
    }
    if (editData.price < 0) {
      showError("Giá không được nhỏ hơn 0!");
      return;
    }
    try {
      setSaving(true);
      await subscriptionService.updateSubscription({
        subscriptionId: editData.subscriptionId,
        type: editData.type,
        price: editData.price,
        subscriptionName: editData.subscriptionName,
        status: editData.status,
      });
      showSuccess("Cập nhật gói thành công!");
      setShowEditModal(false);
      setEditData(null);
      await fetchSubscriptions();
    } catch (err) {
      showError("Cập nhật thất bại!");
    } finally {
      setSaving(false);
    }
  };

  // Hiện modal tạo mới
  const handleShowCreate = () => {
    setCreateData({
      subscriptionName: "",
      price: "",
      status: "active",
    });
    setShowCreateModal(true);
  };

  // Lưu gói mới
  const handleCreate = async () => {
    if (!createData.subscriptionName || !createData.price) {
      showError("Vui lòng nhập đầy đủ thông tin các trường thông tin !");
      return;
    }
    if (createData.price < 0) {
      showError("Giá không được nhỏ hơn 0!");
      return;
    }
    try {
      setCreating(true);
      // Tìm type lớn nhất hiện tại
      const maxType = Math.max(
        0,
        ...pricingPackages.map((x) => Number(x.type) || 0)
      );
      // Kiểm tra trùng tên gói với giá trùng
      const isDuplicate = pricingPackages.some(
        (x) =>
          (x.subscriptionName?.trim().toLowerCase() ===
            createData.subscriptionName.trim().toLowerCase() ||
            x.name?.trim().toLowerCase() ===
              createData.subscriptionName.trim().toLowerCase()) &&
          String(x.price) === String(createData.price)
      );
      if (isDuplicate) {
        showError("Tên gói và giá đã tồn tại!");
        setCreating(false);
        return;
      }
      await subscriptionService.createSubscription({
        type: maxType + 1,
        price: createData.price,
        subscriptionName: createData.subscriptionName,
        status: createData.status,
      });
      showSuccess("Tạo gói thành công!");
      setShowCreateModal(false);
      setCreateData({
        subscriptionName: "",
        price: "",
        status: "active",
      });
      await fetchSubscriptions();
    } catch (err) {
      showError("Tạo mới thất bại!");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg max-w-5xl mx-auto mt-10">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6">
        <MdOutlinePriceChange className="text-indigo-600" size={32} />
        <h1 className="text-2xl font-bold text-indigo-800">Gói đánh giá</h1>
        {loading && (
          <Loader className="animate-spin text-indigo-500 ml-2" size={22} />
        )}
        <button
          onClick={handleShowCreate}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow transition"
        >
          <PlusCircle size={18} /> Tạo gói mới
        </button>
      </div>
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-base text-left rounded-xl overflow-hidden min-w-[700px]">
          <thead className="bg-gradient-to-r from-indigo-100 to-blue-50 text-indigo-900">
            <tr>
              <th className="border px-6 py-3 font-semibold">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="inline text-indigo-500" size={18} />
                  Tên gói
                </div>
              </th>
              <th className="border px-6 py-3 font-semibold">
                <div className="flex items-center gap-2">
                  <MdOutlinePriceChange
                    className="inline text-pink-500"
                    size={18}
                  />
                  Mức giá (VNĐ)
                </div>
              </th>
              <th className="border px-6 py-3 font-semibold">
                <div className="flex items-center gap-2">
                  <FaRegEdit className="inline text-green-600" size={17} />
                  Trạng thái
                </div>
              </th>
              <th className="border px-6 py-3 text-center font-semibold">
                <Pencil className="inline text-blue-500" size={17} /> Chỉnh sửa
              </th>
            </tr>
          </thead>
          <tbody>
            {pricingPackages.map((pkg, index) => (
              <tr
                key={pkg.subscriptionId || index}
                className="hover:bg-indigo-50 transition"
              >
                <td className="border px-6 py-3 font-semibold text-gray-800 flex items-center gap-2">
                  <BadgeCheck className="text-indigo-400" size={17} />
                  {pkg.subscriptionName || pkg.name}
                </td>
                <td className="border px-6 py-3 text-pink-600 font-bold">
                  {pkg.price?.toLocaleString?.("vi-VN") || pkg.price}₫
                </td>
                <td className="border px-6 py-3">
                  {pkg.status === "ACTIVE" || pkg.status === "active" ? (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold text-xs">
                      <BadgeCheck className="text-green-500" size={15} /> HIỆN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-semibold text-xs">
                      <BadgeX className="text-gray-400" size={15} /> ẨN
                    </span>
                  )}
                </td>
                <td className="border px-6 py-3 text-center">
                  <button
                    className="p-2 rounded hover:bg-blue-100 transition group"
                    onClick={() => handleEdit(pkg)}
                    title="Chỉnh sửa gói"
                  >
                    <Pencil
                      className="text-blue-700 group-hover:scale-110 transition"
                      size={18}
                    />
                  </button>
                </td>
              </tr>
            ))}
            {pricingPackages.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400">
                  <span className="flex flex-col items-center gap-2">
                    <BadgeX className="text-3xl text-gray-400" />
                    Chưa có gói nào
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal chỉnh sửa */}
      {showEditModal && editData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border shadow-xl w-[350px] p-7 relative animate-fadeIn">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              title="Đóng"
            >
              <X size={22} />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Pencil className="text-blue-700" size={20} />
              <h2 className="text-lg font-bold text-indigo-800">
                Chỉnh sửa gói
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold">Tên gói</label>
                <input
                  type="text"
                  className="bg-blue-50 px-3 py-2 rounded text-sm w-full mt-1 border border-gray-200 focus:ring-2 focus:ring-blue-200"
                  value={editData.subscriptionName}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      subscriptionName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Giá (VNĐ)</label>
                <input
                  type="number"
                  min={0}
                  className="bg-blue-50 px-3 py-2 rounded text-sm w-full mt-1 border border-gray-200 focus:ring-2 focus:ring-pink-100"
                  value={editData.price}
                  onChange={(e) =>
                    setEditData({ ...editData, price: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Trạng thái</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={editData.status === "active"}
                      onChange={() =>
                        setEditData({ ...editData, status: "active" })
                      }
                      className="accent-green-600"
                    />
                    <span className="flex items-center gap-1 text-green-600">
                      <BadgeCheck size={15} /> Active
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={editData.status === "inactive"}
                      onChange={() =>
                        setEditData({ ...editData, status: "inactive" })
                      }
                      className="accent-gray-500"
                    />
                    <span className="flex items-center gap-1 text-gray-400">
                      <BadgeX size={15} /> Inactive
                    </span>
                  </label>
                </div>
              </div>
              <button
                onClick={handleSave}
                className="mt-2 bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 flex items-center justify-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <Loader className="animate-spin" size={17} />
                ) : (
                  <Pencil size={16} />
                )}
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal tạo mới */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border shadow-xl w-[350px] p-7 relative animate-fadeIn">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              title="Đóng"
            >
              <X size={22} />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <PlusCircle className="text-blue-700" size={20} />
              <h2 className="text-lg font-bold text-indigo-800">Tạo gói mới</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold">Tên gói</label>
                <input
                  type="text"
                  className="bg-blue-50 px-3 py-2 rounded text-sm w-full mt-1 border border-gray-200 focus:ring-2 focus:ring-blue-200"
                  value={createData.subscriptionName}
                  onChange={(e) =>
                    setCreateData({
                      ...createData,
                      subscriptionName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Giá (VNĐ)</label>
                <input
                  type="number"
                  min={0}
                  className="bg-blue-50 px-3 py-2 rounded text-sm w-full mt-1 border border-gray-200 focus:ring-2 focus:ring-pink-100"
                  value={createData.price}
                  onChange={(e) =>
                    setCreateData({ ...createData, price: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Trạng thái</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={createData.status === "active"}
                      onChange={() =>
                        setCreateData({ ...createData, status: "active" })
                      }
                      className="accent-green-600"
                    />
                    <span className="flex items-center gap-1 text-green-600">
                      <BadgeCheck size={15} /> Active
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={createData.status === "active"}
                      onChange={() =>
                        setCreateData({ ...createData, status: "inactive" })
                      }
                      className="accent-gray-500"
                    />
                    <span className="flex items-center gap-1 text-gray-400">
                      <BadgeX size={15} /> Inactive
                    </span>
                  </label>
                </div>
              </div>
              <button
                onClick={handleCreate}
                className="mt-2 bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 flex items-center justify-center gap-2"
                disabled={creating}
              >
                {creating ? (
                  <Loader className="animate-spin" size={17} />
                ) : (
                  <PlusCircle size={16} />
                )}
                {creating ? "Đang tạo..." : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingTable;
