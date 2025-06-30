import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const options = [
  {
    title: "Tải lên CV của bạn và lựa chọn ngành nghề",
    points: [
      "Bạn sẽ tải CV của bản thân",
      "Chọn ngành nghề có sẵn trong kho của chúng tôi",
      "Nhận được kết quả phân tích từ hệ thống",
    ],
    button: "Đi đến",
    note: null,
    color: "from-blue-100 to-blue-50",
    link: "/addCVchooseavailablecareer"
  },
  {
    title: "Tải lên CV của bạn và nhập thêm mô tả công việc",
    points: [
      "Bạn sẽ tải CV của bản thân",
      "Nhập mô tả công việc, vị trí mình mong muốn",
      "Nhận được kết quả phân tích chi tiết",
    ],
    note: "(Lưu ý: Bạn nên sử dụng tính năng này khi xác định rõ công việc, chuyên ngành bản thân muốn hướng đến)",
    button: "Đi đến",
    color: "from-red-100 to-pink-50",
    link: "/addCVwritejobdescription"
  },
  {
    title: "Nhập đường dẫn từ TOPCV",
    points: [
      "Bạn sẽ tải CV của bản thân",
      "(Nhập vào đường dẫn công việc bạn muốn hướng tới từ TOP CV)",
    ],
    button: "Đi đến",
    note: null,
    color: "from-yellow-100 to-yellow-50",
    link: "/addCVfromTOPCVLink"
  },
];

const CVUploadOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {options.map((opt, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className={`p-6 rounded-xl shadow-md bg-gradient-to-br ${opt.color} border border-gray-200`}
          >
            <h3 className="text-xl font-semibold text-indigo-900 mb-3">{opt.title}</h3>
            <ul className="text-gray-700 mb-3 list-disc pl-5 space-y-1">
              {opt.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
            {opt.note && (
              <p className="text-sm text-red-600 font-medium italic mb-3">{opt.note}</p>
            )}
            <button
              onClick={() => navigate(opt.link)}
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2 rounded-full transition-all"
            >
              {opt.button}
              <FiArrowRight />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CVUploadOptions;
