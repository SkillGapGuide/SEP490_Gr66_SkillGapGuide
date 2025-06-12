import { motion } from "framer-motion";
import image from "../assets/image.png";

export default function AboutSection() {
  return (
    <section className="w-full bg-gradient-to-b from-white to-blue-50 py-16 md:py-24 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16"
      >
        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-blue-800 mb-6 leading-tight"
          >
            Về chúng tôi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8 font-light "
          >
            SkillGapGuide là một dự án nghiên cứu nhằm giải quyết khoảng cách
            ngày càng tăng giữa những gì người tìm việc cung cấp và những gì nhà
            tuyển dụng mong đợi. Dự án tập trung phân tích thông tin thực tế, lý
            do tại sao nhiều sinh viên mới tốt nghiệp và những người muốn chuyển
            nghề gặp khó khăn trong việc đáp ứng các yêu cầu công việc. Bằng cách
            phân tích các tin đăng tuyển dụng, CV và nhu cầu của ngành, chúng tôi
            mong muốn cung cấp những hiểu biết rõ ràng về sự khác biệt giữa mong
            muốn của nhà tuyển dụng và thực tế thị trường lao động.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8"
          >
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Sứ mệnh</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Sứ mệnh của chúng tôi là làm nổi bật những khoảng trống kỹ năng giữa
              người tìm việc đạt được mục tiêu cá nhân. Thông qua nghiên cứu dựa
              trên dữ liệu, chúng tôi mong muốn hỗ trợ sinh viên, nhà giáo dục và
              các chuyên gia nghề nghiệp hiểu nhu cầu thị trường lao động, định
              hình con đường nghề nghiệp một cách rõ ràng, tự tin hơn.
            </p>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 
                     text-blue-900 font-bold px-10 py-4 rounded-full shadow-lg transition-all duration-300 
                     text-lg flex items-center gap-2 group"
          >
            Bắt đầu ngay
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.button>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex items-center justify-center min-w-[320px]"
        >
          <img
            src={image}
            alt="Về chúng tôi"
            className="w-full max-w-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300
                     transform hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
