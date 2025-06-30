import React from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell } from "recharts";

const data = [
    {
        company: "Công ty cổ phần Vinhomes – Tập đoàn Vingroup",
        position: "Sales bất động sản",
        match: 85
    },
    {
        company: "Công ty cổ phần đầu tư Nam Long",
        position: "Sales bất động sản",
        match: 72
    },
    {
        company: "Công Ty Cổ Phần Đầu Tư Và Phát Triển BĐS An Gia",
        position: "Sales bất động sản/ xây dựng",
        match: 60
    }
];

const COLORS = ["#0088FE", "#d9d9d9"]; // màu cho donut

const AnalysisAvailableJob2 = () => {
    const sortedData = [...data].sort((a, b) => b.match - a.match); // sắp xếp theo match %

    return (
        <div className="min-h-screen bg-white px-6 py-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
                Gợi ý công việc phù hợp
            </h2>

            <div className="space-y-6">
                {sortedData.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 border rounded-lg p-4 shadow-sm"
                    >
                        {/* Donut chart */}
                        <PieChart width={80} height={80}>
                            <Pie
                                data={[
                                    { name: "Phù hợp", value: item.match },
                                    { name: "Còn thiếu", value: 100 - item.match }
                                ]}
                                dataKey="value"
                                outerRadius={30}
                                innerRadius={20}
                                startAngle={90}
                                endAngle={-270}
                            >
                                {[
                                    { name: "Phù hợp", value: item.match },
                                    { name: "Còn thiếu", value: 100 - item.match }
                                ].map((_, i) => (
                                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>

                        {/* Thông tin công ty */}
                        <div className="flex-1 px-4">
                            <p className="text-red-600 font-semibold">{item.company}</p>
                            <p className="text-gray-700 text-sm">Vị trí: {item.position}</p>
                        </div>

                        <Link
                            to="/analysisCVAvailableJob3"
                            state={{ company: item.company, position: item.position }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium text-sm px-4 py-2 rounded-full transition"
                        >
                            → Xem chi tiết
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalysisAvailableJob2;
