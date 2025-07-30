import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCVWizardStore } from "../../stores/cvWizardStore";
import { UserContext } from "../../context/UserContext";
import { showSuccess, showError,showInfo } from "../../utils/alert"; // Giả sử bạn có một hàm thông báo thành công hoặc lỗi
const menuItems = [
  {
    label: "Tải lên CV & mô tả công việc",
    path: "/analyze/upload",
  },
  {
    label: "Công việc phù hợp",
    path: "/matchingjobs",
  },
  {
    label: "Phân tích kỹ năng",
    path: "/analyze/result",
    // enableCondition sẽ được check ở dưới
  },
  {
    label: "Gợi ý khóa học",
    path: "/suggestedcourses",
  },
  {
    label: "Theo dõi tiến độ",
    path: "/coursetracking",
  },
  {
    label: "Đánh giá",
    path: "/servicerating",
  },
  {
    label: "Đăng ký gói dịch vụ",
    path: "/servicepayment",
  },
];

const TopMenu = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy các state từ store (persisted)
  const cvUploaded = useCVWizardStore((s) => s.cvUploaded);
  const jobFilesMeta = useCVWizardStore((s) => s.jobFilesMeta);
  const topcvLinks = useCVWizardStore((s) => s.topcvLinks);

  // Điều kiện enable cho "Phân tích kỹ năng"
  const enableAnalysis =
    cvUploaded &&
    ((jobFilesMeta && jobFilesMeta.length > 0) ||
      (topcvLinks && topcvLinks.length > 0));

  return (
    <nav className="bg-[#f5f9ff] border-b border-blue-200 shadow-sm">
      <ul className="flex justify-center gap-6 px-4 py-2 text-sm font-medium text-gray-800">
        {menuItems.map((item, i) => {
          const isActive = location.pathname === item.path;

          // Xác định enable cho từng menu item
          let isEnabled = true;
          if (item.label === "Phân tích kỹ năng") {
            isEnabled = enableAnalysis;
          }

          return (
            <li
              key={i}
              className={`cursor-pointer transition-all px-2 py-1 rounded ${
                isActive
                  ? "text-white bg-blue-600 shadow font-semibold"
                  : isEnabled
                  ? "hover:text-blue-600 hover:underline"
                  : "text-gray-400 bg-gray-100 cursor-not-allowed"
              }`}
              style={{ opacity: isEnabled ? 1 : 0.5 }}
              onClick={() => {
                if (!isEnabled) {
                  showInfo("Bạn cần tải lên CV và mô tả công việc trước !");
                  return;
                }
                navigate(item.path);
              }}
            >
              {item.label}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TopMenu;
