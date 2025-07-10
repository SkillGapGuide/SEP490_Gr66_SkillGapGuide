import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
const categories = [
  {
    name: "Kinh doanh bán hàng",
    sub: [
      {
        group: "Sales bất động sản/ xây dựng",
        jobs: [
          "Sale bất động sản",
          "Kinh doanh nội thất",
          "Kinh doanh thiết bị/ vật liệu xây dựng"
        ]
      },
      {
        group: "Sales nhập khẩu/ Logistics",
        jobs: ["Sale Logistics", "Kinh doanh xuất nhập khẩu"]
      },
      {
        group: "Sales FMCG",
        jobs: ["Kinh doanh hàng tiêu dùng", "Chăm sóc điểm bán"]
      }
    ]
  },
  {
    name: "Marketing / PR / Quảng cáo",
    sub: [
      {
        group: "Digital Marketing",
        jobs: ["SEO", "Content Creator", "Social Media"]
      },
      {
        group: "Brand & PR",
        jobs: ["PR nội bộ", "Xây dựng thương hiệu", "Quan hệ báo chí"]
      },
      {
        group: "Event & Activation",
        jobs: ["Tổ chức sự kiện", "Kích hoạt thương hiệu"]
      }
    ]
  },
  {
    name: "Chăm sóc khách hàng",
    sub: [
      {
        group: "Tổng đài",
        jobs: ["CSKH qua điện thoại", "Giải quyết khiếu nại"]
      },
      {
        group: "CSKH trực tiếp",
        jobs: ["Lễ tân", "Chăm sóc tại cửa hàng"]
      },
      {
        group: "CSKH online",
        jobs: ["Hỗ trợ qua email/chat", "Phản hồi mạng xã hội"]
      }
    ]
  }
];


const AddCVChooseAvailableCareer = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selected, setSelected] = useState({
    sector: "",
    group: "",
    job: ""
  });
  const [cvFile, setCvFile] = useState(null);
  const [cvPreview, setCvPreview] = useState(null);

  const handleSelect = (sector, groupTitle, jobTitle) => {
    setSelected({
      sector,
      group: groupTitle,
      job: jobTitle
    });
  };
   const navigate = useNavigate();
  const handleViewResult = () => {
    if (!selected.sector || !selected.group || !selected.job) {
      alert("Vui lòng chọn đầy đủ ngành nghề, nghề và chuyên môn.");
      return;
    }

    navigate("/analysisCVAvailableJob1", { state: selected });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
      setCvPreview(URL.createObjectURL(file));
    } else {
      alert("Vui lòng chọn đúng định dạng PDF.");
    }
  };

  return (
    <div className="min-h-[750px] bg-white p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Cột bên trái */}
        <div className="space-y-4">
          {/* Menu ngành nghề */}
          <div className="border rounded-xl bg-blue-50 shadow overflow-hidden">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="border-b hover:bg-blue-100 px-4 py-3 cursor-pointer transition"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="font-medium text-indigo-800">{cat.name}</span>
              </div>
            ))}
          </div>

          {/* Dropdown dưới */}
          <AnimatePresence>
            {hoveredIndex !== null && categories[hoveredIndex].sub.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="border rounded-lg shadow p-4 bg-white"
                onMouseEnter={() => setHoveredIndex(hoveredIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {categories[hoveredIndex].sub.map((group, i) => (
                  <div key={i} className="mb-4 border-b pb-3">
                    <p className="font-semibold text-gray-800 mb-2">{group.group}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.jobs.map((job, j) => (
                        <span
                          key={j}
                          onClick={() =>
                            handleSelect(categories[hoveredIndex].name, group.group, job)
                          }
                          className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm hover:bg-indigo-200 cursor-pointer transition"
                        >
                          {job}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>


          {/* Thông tin đã chọn */}
          <div className="border rounded-lg p-4 bg-white">
            <p><strong>Nhóm nghề:</strong> <span className="text-indigo-700">{selected.sector || "Chưa lựa chọn"}</span></p>
            <p><strong>Nghề:</strong> <span className="text-indigo-700">{selected.group || "Chưa lựa chọn"}</span></p>
            <p><strong>Chuyên môn:</strong> <span className="text-indigo-700">{selected.job || "Chưa lựa chọn"}</span></p>
          </div>
        </div>

        {/* Cột bên phải */}
        <div className="border rounded-lg p-6 flex flex-col items-center justify-start bg-white shadow relative min-h-[500px]">
          {!cvPreview ? (
            <>
              <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center gap-2 text-center text-indigo-700 hover:text-indigo-800">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                  alt="upload"
                  className="w-12 h-12"
                />
                <span className="underline font-semibold">Tải lên CV của bạn (pdf)</span>
              </label>
              <input
                type="file"
                id="cv-upload"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-sm text-gray-500 italic mt-2">Chưa được tải lên</p>
            </>
          ) : (
            <embed src={cvPreview} type="application/pdf" width="100%" height="380px" className="rounded border" />
          )}

          <button
            onClick={handleViewResult}
            className="mt-6 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            → Xem kết quả
          </button>;
        </div>
      </div>
    </div>
  );
};

export default AddCVChooseAvailableCareer;
