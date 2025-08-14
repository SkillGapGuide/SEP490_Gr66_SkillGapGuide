// src/pages/ServicePayment.jsx
// 🎯 Show all plans, color-highlight current, disable lower + current, tooltip for current

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import TopMenu from "./TopMenu";
import qrImage from "/images/qr-demo.png";
import vnpayLogo from "/images/vnpay.png";
import { subscriptionService } from "../../services/subscriptionService";
import { paymentService } from "../../services/paymentService";
import { UserContext } from "../../context/UserContext";
import { showInfo, showError, showSuccess } from "../../utils/alert";

// Role order (low → high)
const ROLE_HIERARCHY = ["Free User", "Pro User", "Premium User"];
// subscriptionId → role name
const SUBSCRIPTION_ID_TO_ROLE = {
  1: "Free User",
  2: "Pro User",
  3: "Premium User",
};

// Feature table
const featureGroups = [
  {
    title: "📁 Tải lên CV & mô tả công việc",
    items: [
      { feature: "Tải lên CV của bạn", values: [true, true, true] },
      { feature: "Tải lên mô tả công việc", values: [true, true, true] },
      { feature: "Nhập link mô tả công việc từ TOPCV", values: [true, true, true] },
    ],
  },
  {
    title: "💼 Công việc phù hợp",
    items: [
      { feature: "Danh sách công việc phù hợp", values: [false, true, true] },
      { feature: "Độ phù hợp CV và vị trí công việc", values: [false, true, true] },
    ],
  },
  {
    title: "🧠 Phân tích kỹ năng & Khóa học",
    items: [
      { feature: "Kỹ năng hiện tại của bạn", values: [false, false, true] },
      { feature: "Kỹ năng còn thiếu", values: [false, false, true] },
      { feature: "Kỹ năng yêu cầu của từng mô tả công việc", values: [false, false, true] },
      { feature: "Độ phù hợp giữa kỹ năng hiện tại và yêu cầu", values: [false, false, true] },
      { feature: "Nhận định chung kỹ năng của bạn và mô tả", values: [false, false, true] },
      { feature: "Danh sách khóa học gợi ý", values: [false, false, true] },
      { feature: "Thêm khóa học yêu thích", values: [false, false, true] },
      { feature: "Theo dõi cập nhật tiến độ khóa học", values: [false, false, true] },
    ],
  },
];

const planDescriptions = [
  "Miễn phí dành cho các cá nhân muốn tải lên CV và nhận được danh sách kỹ năng hiện tại.",
  "Dành cho các cá nhân muốn phân tích đầy đủ kỹ năng từ mô tả công việc cụ thể.",
  "Bao gồm mọi tính năng của gói phổ thông, theo dõi tiến độ học và các tính năng cao cấp.",
];

const planButtons = ["➜ Tiếp tục", "➜ Đăng ký", "➜ Đăng ký"];

export default function ServicePayment() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [plans, setPlans] = useState([]);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");
  const { user } = useContext(UserContext);

  // auth checker (dự án có thể lưu id khác nhau)
  const isAuthenticated = (u) => Boolean(u && (u.id || u._id || u.userId || u.email || u.token));

  const userRoleIndex = ROLE_HIERARCHY.indexOf(user?.role || "Free User");

  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await subscriptionService.getAllSubscriptions();
        const actives = (data || []).filter((g) => g.status === "active");
        // keep stable order by subscriptionId (1→3)
        actives.sort(
          (a, b) => Number(a.id ?? a.subscriptionId) - Number(b.id ?? b.subscriptionId)
        );

        const mapped = actives.map((item) => {
          const subscriptionId = Number(item.id ?? item.subscriptionId);
          const roleName = SUBSCRIPTION_ID_TO_ROLE[subscriptionId] || "Free User";
          const planRoleIndex = ROLE_HIERARCHY.indexOf(roleName);

          const isCurrentPlan = planRoleIndex === userRoleIndex;
          const isLowerPlan = planRoleIndex < userRoleIndex;
          const isHigherPlan = planRoleIndex > userRoleIndex;

          return {
            subscriptionId,
            name: item.subscriptionName,
            price:
              item.price === 0
                ? "0 VNĐ"
                : `${item.price.toLocaleString("vi-VN")} VNĐ / 1 tháng`,
            amount: item.price,
            description: planDescriptions[planRoleIndex] || "",
            button: isCurrentPlan
              ? "✔ Gói hiện tại"
              : isLowerPlan
              ? "Đã bao gồm"
              : planButtons[planRoleIndex],
            isDisabled: !isHigherPlan, // chỉ gói cao hơn mới enable
            isCurrentPlan,
            isLowerPlan,
            isHigherPlan,
          };
        });

        setPlans(mapped);
      } catch (err) {
        console.error("fetchPlans error", err);
        setPlans([]);
      }
    }
    fetchPlans();
  }, [userRoleIndex, user?.role]);

  function handleSelectPlan(plan) {
    // Chỉ bắt đăng nhập khi nâng cấp
    if (plan.isHigherPlan && !isAuthenticated(user)) {
      showInfo("Vui lòng đăng nhập để đăng ký gói.");
      return;
    }

    if (plan.isDisabled) return;
    setPayError("");

    if (plan.amount === 0) {
      navigate("/analyze");
    } else {
      setSelectedPlan(plan);
      setPaymentMethod("");
    }
  }

  async function handlePayWithVnpay() {
    if (!isAuthenticated(user)) {
      showInfo("Vui lòng đăng nhập để tiếp tục thanh toán.");
      return;
    }

    if (!selectedPlan?.subscriptionId) {
      const msg = "Không tìm thấy mã gói (subscriptionId).";
      setPayError(msg);
      showError(msg);
      return;
    }

    try {
      setPayLoading(true);
      setPayError("");
      const res = await paymentService.create(selectedPlan.subscriptionId);
      const paymentUrl = res?.paymentUrl;
      if (!paymentUrl) throw new Error("Không nhận được paymentUrl từ máy chủ.");
      showInfo("Đang chuyển hướng tới VNPay trong 3 giây...");

      setTimeout(() => {
        window.location.href = paymentUrl; // redirect sang VNPay sau 3s
      }, 3000);
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message || e?.message || "Tạo giao dịch VNPay thất bại. Vui lòng thử lại.";
      setPayError(msg);
      showError(msg);
      setPayLoading(false);
    }
  }

  function renderPaymentPopup() {
    if (!selectedPlan) return null;

    const handleConfirmTransfer = () => {
      showSuccess("Cảm ơn bạn! Hệ thống sẽ xác nhận thanh toán trong giây lát.");
      setSelectedPlan(null);
      setPaymentMethod("");
    };

    return (
      <div className="fixed inset-0 z-50 backdrop-blur-[2px] flex items-center justify-center">
        <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-[380px] border border-blue-200 animate-fadeIn">
          <button
            onClick={() => {
              setSelectedPlan(null);
              setPaymentMethod("");
              setPayError("");
              setPayLoading(false);
            }}
            className="absolute top-2 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-2xl text-gray-400 hover:text-red-500 transition"
            aria-label="Đóng"
          >
            &times;
          </button>

          <h3 className="text-blue-600 font-bold text-lg mb-4 text-center">
            Thanh toán – {selectedPlan.name}
          </h3>

          <p className="font-medium text-sm mb-2 text-center">Chọn phương thức thanh toán</p>

          <label className="flex items-center gap-2 mb-3 text-sm cursor-pointer">
            <input
              type="radio"
              name="method"
              value="qr"
              checked={paymentMethod === "qr"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="accent-blue-500"
            />
            <span className="text-blue-600 font-medium">Thanh toán qua QR code</span>
          </label>

          <label className="flex items-center gap-2 mb-4 text-sm cursor-pointer">
            <input
              type="radio"
              name="method"
              value="vnpay"
              checked={paymentMethod === "vnpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="accent-blue-500"
            />
            <span className="text-gray-800 font-medium">Thanh toán qua VNPay</span>
            <img src={vnpayLogo} alt="VNPay" className="h-5 ml-1" />
          </label>

          {paymentMethod === "qr" && (
            <>
              <div className="flex items-center justify-center relative mb-2">
                <img src={qrImage} alt="QR code" className="w-40 h-40 rounded-xl border border-blue-100" />
              </div>
              <p className="text-center text-red-600 text-sm font-semibold">
                Mức phí: {selectedPlan.amount.toLocaleString()} VNĐ
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                (Khách hàng vui lòng không thay đổi nội dung chuyển khoản)
              </p>
              <div className="mt-4">
                <button
                  onClick={handleConfirmTransfer}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full py-2 rounded-lg shadow mt-2 transition"
                >
                  ✅ Tôi đã chuyển khoản
                </button>
              </div>
            </>
          )}

          {paymentMethod === "vnpay" && (
            <div className="mt-4 border rounded-lg bg-blue-50 p-4 text-sm text-center">
              <p className="text-gray-700 mb-2">Bạn sẽ được chuyển hướng tới cổng thanh toán VNPay.</p>

              {payError && <p className="text-red-600 text-xs mb-2">{payError}</p>}

              <button
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow transition disabled:opacity-60"
                onClick={handlePayWithVnpay}
                disabled={payLoading}
              >
                {payLoading ? "Đang tạo giao dịch..." : "Tiếp tục thanh toán"}
              </button>

              <p className="text-[11px] text-gray-500 mt-2">
                Gói: <b>{selectedPlan.name}</b> • Mức phí: <b>{selectedPlan.amount.toLocaleString()} VNĐ</b>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderFeatureGroup(title, featureList) {
    return (
      <div className="space-y-2" key={title}>
        <h3 className="text-md font-semibold text-gray-700">{title}</h3>
        <div className="border border-blue-300 rounded-xl overflow-hidden text-sm">
          <table className="w-full border-separate border-spacing-0">
            <thead className="bg-blue-50 text-gray-800 font-semibold text-center">
              <tr>
                <th className="border px-4 py-3 text-left w-[50%]">Tính năng</th>
                <th className="border px-4 py-3">Miễn phí</th>
                <th className="border px-4 py-3">Gói nâng cao</th>
                <th className="border px-4 py-3">Gói toàn diện</th>
              </tr>
            </thead>
            <tbody>
              {featureList.map((item, idx) => (
                <tr key={idx} className="text-center align-top hover:bg-blue-50 transition">
                  <td className="border px-4 py-3 text-left text-gray-800">{item.feature}</td>
                  {item.values.map((value, i) => (
                    <td key={i} className="border px-4 py-3">
                      {value ? (
                        <span className="text-green-500 text-lg font-bold">✔</span>
                      ) : (
                        <span className="text-gray-400 text-lg font-bold">✖</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
       
      </div>
      <div className="bg-white min-h-screen p-6 max-w-6xl mx-auto space-y-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Thanh toán – Đăng ký gói dịch vụ</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {plans.length > 0 ? (
            plans.map((plan, idx) => (
              <div
                key={idx}
                className={`border rounded-xl p-5 shadow-sm flex flex-col items-center transition ${
                  plan.isCurrentPlan
                    ? "bg-green-50 border-green-400 shadow-md"
                    : plan.isLowerPlan
                    ? "bg-gray-50 border-gray-300"
                    : "bg-white border-blue-300 hover:shadow-lg"
                }`}
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-1 text-center">{plan.name}</h3>
                <p className="text-red-600 font-semibold text-sm text-center">{plan.price}</p>
                <p className="text-sm text-gray-700 mt-2 text-center min-h-[56px]">{plan.description}</p>
                <div className="mt-6 w-full flex justify-center">
                  <button
                    className={`px-6 py-2 text-sm rounded-md font-semibold w-full transition disabled:opacity-60 text-white ${
                      plan.isCurrentPlan
                        ? "bg-gray-400 cursor-default"
                        : plan.isLowerPlan
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    onClick={() => handleSelectPlan(plan)}
                    disabled={plan.isDisabled}
                    title={
                      plan.isCurrentPlan
                        ? "Bạn đang dùng gói này"
                        : plan.isLowerPlan
                        ? "Gói này đã nằm trong gói hiện tại của bạn"
                        : ""
                    }
                  >
                    {plan.button}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-400 italic py-10">
              Không có gói dịch vụ nào khả dụng.
            </div>
          )}
        </div>

        {featureGroups.map((group) => renderFeatureGroup(group.title, group.items))}

        {renderPaymentPopup()}
      </div>
    </>
  );
}
