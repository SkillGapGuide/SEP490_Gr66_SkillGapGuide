import React, { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";

const skillsData = [
    { name: "Tiếng Anh", skillFav: false, courseFav: false },
    { name: "Quản lý thời gian", skillFav: false, courseFav: false },
    { name: "Làm việc nhóm", skillFav: true, courseFav: true },
];

const pieData = [
    { name: "Phù hợp", value: 65 },
    { name: "Chưa phù hợp", value: 35 },
];

const COLORS = ["#003C96", "#d9d9d9"];

const AnalysisLinkingJob = () => {
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
        <div className="bg-white px-6 py-8 text-gray-800 font-sans max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-lg font-bold text-red-600">
                    Công ty cổ phần Vinhomes – Tập đoàn Vingroup
                </h2>
                <p className="mt-1 text-[15px]">
                    Vị trí: <span className="text-gray-700">Sales bất động sản</span>{" "}
                    <Link
                        to="https://www.topcv.vn/"
                        target="_blank"
                        className="text-blue-700 underline ml-2"
                    >
                        → Đường dẫn đến vị trí công việc tại TOPCV
                    </Link>
                </p>
            </div>

            {/* Layout */}
            <div className="flex flex-col md:flex-row justify-between gap-8 mt-8">
                {/* Kỹ năng */}
                <div className="w-full md:w-1/2 flex flex-col justify-between min-h-[200px] mt-10">
                    <div>
                        <h3 className="text-lg font-bold mb-4">Kỹ năng còn thiếu:</h3>
                        <ul className="space-y-4">
                            {skills.map((skill, idx) => (
                                <li
                                    key={idx}
                                    className="flex justify-between items-center border-b border-gray-200 pb-2"
                                >
                                    <div className="flex items-center gap-2 text-sm">
                                        <button onClick={() => toggleSkillFav(idx)} title="Yêu thích kỹ năng">
                                            {skill.skillFav ? (
                                                <AiFillStar className="text-blue-600 w-5 h-5" />
                                            ) : (
                                                <AiOutlineStar className="text-blue-600 w-5 h-5" />
                                            )}
                                        </button>
                                        <span className="text-gray-900">{skill.name}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <Link to="#" className="text-blue-600 hover:underline">
                                            → Khóa học phù hợp
                                        </Link>
                                        <button onClick={() => toggleCourseFav(idx)} title="Yêu thích khóa học">
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
                    </div>


                    {/* Ghi chú */}
                    <div className="text-xs mt-6 space-y-1">
                        <div className="text-blue-600">★ Nhấn để thêm vào kỹ năng yêu thích</div>
                        <div className="text-blue-600">☆ Nhấn để xóa khỏi kỹ năng yêu thích</div>
                        <div className="text-yellow-500">★ Nhấn để thêm vào khóa học yêu thích</div>
                        <div className="text-yellow-500">☆ Nhấn để xóa khỏi khóa học yêu thích</div>
                    </div>
                </div>

                {/* Biểu đồ */}
                <div className="w-full md:w-1/2 flex justify-center items-center">
                    <div className="flex flex-col items-center">
                        <PieChart width={260} height={260}>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                innerRadius={70}
                                outerRadius={110}
                                startAngle={90}
                                endAngle={-270}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                        </PieChart>
                        <div className="text-sm mt-2 text-center">
                            <p className="text-blue-700 font-medium">● Phù hợp: 65%</p>
                            <p className="text-gray-500">● Chưa phù hợp: 35%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisLinkingJob;
