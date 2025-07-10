import React, { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";

const skillsData = [
  { name: "Tiếng Anh", skillFav: false, courseFav: false },
  { name: "Quản lý thời gian", skillFav: false, courseFav: true },
  { name: "Làm việc nhóm", skillFav: true, courseFav: false },
];

const pieData = [
  { name: "Phù hợp", value: 65 },
  { name: "Chưa phù hợp", value: 35 },
];

const COLORS = ["#003C96", "#d9d9d9"];

const AnalysisJobDescription = () => {
  const [skills, setSkills] = useState(skillsData);

  const toggleSkillFav = (index) => {
    const updated = [...skills];
    updated[index].skillFav = !updated[index].skillFav;
    setSkills(updated);
  };

  const toggleCourseFav = (index) => {
    const updated = [...skills];
    updated[index].courseFav = !updated[index].courseFav;
    setSkills(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-gray-800 font-sans bg-white">
      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT - Job Description */}
        <div className="border rounded-xl p-6 border-blue-300 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Mô tả công việc của bạn</h2>
          <p className="text-sm">
            <span className="font-semibold">Vị trí:</span>{" "}
            <span className="text-red-600">Chuyên viên tư vấn công nghệ</span>
          </p>
          <div className="mt-3">
            <p className="font-semibold mb-1">Yêu cầu:</p>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              <li>Tốt nghiệp CNTT hoặc ngành liên quan</li>
              <li>Giao tiếp và tư duy phân tích tốt</li>
              <li>Hiểu biết về phần mềm, hệ thống công nghệ</li>
              <li>Ưu tiên có kinh nghiệm tư vấn/triển khai hệ thống</li>
            </ul>
          </div>

          <div className="mt-5">
            <p className="font-semibold mb-1">Kỹ năng hiện tại của bạn</p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Kiến thức nền tảng CNTT</li>
              <li>Phân tích hệ thống</li>
            </ul>
          </div>
        </div>

        {/* RIGHT - Result & Chart */}
        <div className="border rounded-xl p-6 border-gray-300 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Kết quả phân tích</h2>
          <div className="flex flex-col md:flex-row justify-between gap-6">
            {/* Kỹ năng còn thiếu */}
            <div className="w-full md:w-2/3">
              <h3 className="text-[16px] font-bold mb-4 text-[#003C96]">Kỹ năng còn thiếu:</h3>
              <ul className="space-y-3">
                {skills.map((skill, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center text-sm border-b pb-2"
                  >
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleSkillFav(idx)}>
                        {skill.skillFav ? (
                          <AiFillStar className="text-blue-600 w-5 h-5" />
                        ) : (
                          <AiOutlineStar className="text-blue-600 w-5 h-5" />
                        )}
                      </button>
                      <span className="text-gray-800">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to="#" className="text-blue-600 hover:underline">
                        → Khóa học phù hợp
                      </Link>
                      <button onClick={() => toggleCourseFav(idx)}>
                        {skill.courseFav ? (
                          <AiFillStar className="text-yellow-500 w-5 h-5" />
                        ) : (
                          <AiOutlineStar className="text-yellow-500 w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Ghi chú */}
              <div className="text-xs mt-6 space-y-1">
                <div className="text-blue-600">★ Nhấn để thêm vào kỹ năng yêu thích</div>
                <div className="text-blue-600">☆ Nhấn để xóa khỏi kỹ năng yêu thích</div>
                <div className="text-yellow-500">★ Nhấn để thêm vào khóa học yêu thích</div>
                <div className="text-yellow-500">☆ Nhấn để xóa khỏi khóa học yêu thích</div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <PieChart width={180} height={180}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
              <div className="text-sm mt-2 text-center">
                <p className="text-blue-700">● Phù hợp: 65%</p>
                <p className="text-gray-400">● Chưa phù hợp: 35%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisJobDescription;
