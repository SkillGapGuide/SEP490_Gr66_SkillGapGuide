import React from "react";
import { useNavigate } from "react-router-dom";

const jobResults = [
  {
    title: "Job 1 Description",
    position: "Chuyên viên tư vấn công nghệ",
    comment: "Ứng viên có kỹ năng chuyên môn cơ bản phù hợp với vị trí, đặc biệt là lĩnh vực công nghệ. Tuy nhiên, kỹ năng mềm như giao tiếp, làm việc nhóm và giải quyết vấn đề chưa được thể hiện rõ. Cần củng cố thêm tư duy phản biện và khả năng thích nghi với môi trường làm việc thực tế.",
  },
  {
    title: "Job 2 Description",
    position: "Chăm sóc khách hàng",
    comment: "Ứng viên thể hiện được nền tảng kỹ năng chuyên môn vững, có kiến thức sử dụng các công cụ và công thức liên quan đến công việc. Tuy nhiên, kỹ năng quản lý thời gian và xử lý khủng hoảng còn hạn chế. Cần luyện tập thêm kỹ năng này thông qua thực tế, biểu đạt và tư duy linh hoạt để đáp ứng tốt hơn yêu cầu của vị trí.",
  },
];

const AddCVWriteJobDescription1 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {jobResults.map((job, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-blue-50"
          >
            {/* Cột trái: nội dung mô tả */}
            <div className="md:col-span-2">
              <h3 className="text-red-600 font-bold text-lg mb-1">{job.title}</h3>
              <p className="font-semibold text-gray-800 mb-1">Vị trí: {job.position}</p>
              <p className="text-red-600 font-medium mb-1">Nhận định chung:</p>
              <p className="text-sm text-gray-700 text-justify">{job.comment}</p>

              <button
                onClick={() => navigate(`/analysisjobdescription`)}
                className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-sm transition"
              >
                → Xem chi tiết
              </button>
            </div>

            {/* Cột phải: biểu đồ hình tròn */}
            <div className="flex justify-center md:justify-end">
              <div className="w-32 h-32 rounded-full border-[12px] border-blue-600 border-r-gray-200 border-b-gray-200 rotate-[135deg]"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddCVWriteJobDescription1;
