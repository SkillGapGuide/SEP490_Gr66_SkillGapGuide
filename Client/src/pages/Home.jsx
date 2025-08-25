// src/pages/Home.jsx
import { PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { FiUploadCloud } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import innovation from "../assets/innovation.png";
import { showInfo, showError } from "../utils/alert";
import { staticPageService } from "../services/staticPageService"; // <-- dùng service này

// Carousel images
const images = ["/images/slide1.png", "/images/slide2.png", "/images/slide3.png"];

// Testimonials demo
const testimonials = [
  {
    img: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    text: "“Tôi đã có trải nghiệm thật tốt.”",
    stars: 5,
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/4140/4140061.png",
    text: "“Nó đã giúp tôi rất nhiều.”",
    stars: 5,
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
    text: "“Trải nghiệm thực sự khác biệt, đề xuất rất hữu ích! test 123”",
    stars: 5,
  },
];

const skillPercent = 94;
const pieData = [
  { name: "Matched", value: skillPercent },
  { name: "Remaining", value: 100 - skillPercent },
];
const COLORS = ["#4B8A94", "#e5e5e5"];

const settings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true,
  centerMode: true,
  centerPadding: "0px",
  adaptiveHeight: true,
};

// Map list [{title,content}] -> { slogan, siteName, phone }
function mapHomeListToFields(list) {
  const dict = (list || []).reduce((acc, it) => {
    const t = it?.title;
    if (t != null) acc[String(t)] = String(it?.content ?? "");
    return acc;
  }, {});
  return {
    slogan: dict["Khẩu hiệu"] ?? "",
    siteName: dict["Tên trang"] ?? "",
    phone: dict["Số điện thoại liên hệ"] ?? "",
  };
}

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // --- Home dynamic content from API ---
  const [homeData, setHomeData] = useState({ slogan: "", siteName: "", phone: "" });
  const [loadingHome, setLoadingHome] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingHome(true);
      try {
        // Hỗ trợ cả getHome() lẫn getHomePage() (phòng bạn đặt tên khác)
        const list = staticPageService.getHome
          ? await staticPageService.getHome()
          : staticPageService.getHomePage
          ? await staticPageService.getHomePage()
          : [];

        const mapped = mapHomeListToFields(list);
        if (mounted) setHomeData(mapped);
      } catch (e) {
        showError(e?.response?.data?.message || e?.message || "Không tải được nội dung trang chủ.");
      } finally {
        if (mounted) setLoadingHome(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Fallback hiển thị khi đang tải / thiếu dữ liệu
  const siteName = useMemo(() => homeData.siteName || "SkillGapGuide", [homeData.siteName]);
  const slogan = useMemo(
    () =>
      homeData.slogan ||
      "Khám phá, phân tích và phát triển kỹ năng đúng hướng",
    [homeData.slogan]
  );
  const phone = useMemo(() => homeData.phone || "559282 - 978", [homeData.phone]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-14 px-4 bg-gradient-to-tr from-indigo-50 via-blue-100 to-indigo-50">
        <motion.div
          className="absolute -top-16 -left-16 w-80 h-80 bg-gradient-to-br from-indigo-300/40 to-blue-200/10 rounded-full blur-3xl z-0"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        />
        <div className="relative flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto z-10">
          <motion.div
            className="text-left max-w-xl"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Brand pill */}
            <div className="inline-flex items-center gap-2 bg-white/70 px-3 py-1.5 rounded-full border shadow-sm mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-sm font-semibold text-indigo-900">
                {loadingHome ? "Đang tải…" : siteName}
              </span>
            </div>

            {/* Slogan / heading */}
            <h2 className="text-3xl md:text-4xl font-extrabold leading-snug text-indigo-900 drop-shadow-sm">
              {loadingHome ? (
                <span className="inline-block h-7 w-72 bg-indigo-100/70 rounded animate-pulse" />
              ) : (
                slogan
              )}
            </h2>

            <p className="mt-4 text-gray-700 text-lg font-light">
              Tải lên CV – nhận ngay bản đồ kỹ năng cần thiết, đề xuất định hướng, khóa học phù hợp.
            </p>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.04, backgroundColor: "#4338CA" }}
              whileTap={{ scale: 0.97 }}
              className={`mt-8 inline-flex items-center gap-3 bg-indigo-700 text-white px-7 py-3 rounded-full shadow-lg text-lg font-bold hover:bg-indigo-800 transition-all ${
                uploading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={uploading}
              onClick={(e) => {
                e.preventDefault();
                if (!localStorage.getItem("token")) {
                  showInfo("Bạn cần đăng nhập để tải lên CV!");
                  setTimeout(() => {
                    navigate("/login");
                  }, 1200);
                  return;
                }
                setUploading(true);
                setTimeout(() => {
                  setUploading(false);
                  navigate("/analyze");
                }, 1200);
              }}
            >
              <FiUploadCloud className="w-6 h-6" />
              Tải lên CV & nhận phân tích
            </motion.button>

            {/* Contact hint */}
            <div className="mt-4 text-sm text-slate-600">
              {loadingHome ? (
                <span className="inline-block h-4 w-40 bg-slate-200 rounded animate-pulse" />
              ) : (
                <>
                  Liên hệ: <span className="font-semibold">{phone}</span>
                </>
              )}
            </div>
          </motion.div>

          <motion.img
            initial={{ scale: 0.88, opacity: 0, rotate: 10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            src={innovation}
            alt="CV upload"
            className="w-64 md:w-80 mt-10 md:mt-0 drop-shadow-xl object-contain"
            style={{ maxHeight: 340 }}
          />
        </div>
      </section>

      {/* IMAGE CAROUSEL */}
      <section className="bg-white py-10 px-0 flex justify-center items-center">
        <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-lg">
          <Slider {...settings}>
            {images.map((img, idx) => (
              <div key={idx} className="flex justify-center items-center">
                <img
                  src={img}
                  alt={`slide-${idx}`}
                  className="object-cover w-full h-[320px] md:h-[370px] rounded-xl mx-auto transition-all duration-300"
                  style={{ objectFit: "cover", maxHeight: 370, background: "#e5e5e5" }}
                />
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Kết quả bạn nhận được */}
      <section className="py-20 bg-white text-center px-4 relative">
        <motion.h3
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold mb-16 text-indigo-900"
        >
          Kết quả bạn nhận được
        </motion.h3>
        <div className="relative flex flex-wrap justify-center gap-16 md:gap-32 items-center max-w-6xl mx-auto z-10">
          {[
            {
              icon: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
              label: "Tải CV của bạn",
            },
            {
              icon: "https://cdn-icons-png.flaticon.com/512/3523/3523063.png",
              label: "Chúng tôi xử lý & phân tích kỹ năng còn thiếu",
            },
            {
              icon: "https://cdn-icons-png.flaticon.com/512/929/929564.png",
              label: "Nhận kết quả kỹ năng thiếu & gợi ý khóa học, công việc phù hợp",
            },
          ].map((step, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              key={step.icon}
              className="flex flex-col items-center w-44 relative z-10 group"
            >
              <div className="bg-gradient-to-br from-indigo-100 to-blue-50 rounded-full w-20 h-20 flex items-center justify-center mb-3 group-hover:shadow-xl transition-shadow duration-200">
                <img src={step.icon} alt="" className="w-10 h-10 object-contain" />
              </div>
              <p className="text-sm text-indigo-900 text-center font-medium">{step.label}</p>
              {idx !== 2 && (
                <div className="hidden md:block absolute right-[-68px] top-1/2 -translate-y-1/2 h-1 w-14 bg-gradient-to-r from-indigo-200 to-indigo-400 opacity-80" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skill Match Result */}
      <section className="bg-gradient-to-tr from-blue-50 to-indigo-50 py-14 text-center px-4">
        <motion.h3
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold mb-12 text-indigo-900"
        >
          Kết quả kỹ năng
        </motion.h3>
        <div className="flex flex-wrap justify-center gap-10">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-7 border rounded-2xl max-w-sm shadow-xl bg-white/90 backdrop-blur flex flex-col items-center relative"
          >
            <PieChart width={220} height={110}>
              <Pie
                data={pieData}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={62}
                outerRadius={82}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
            <motion.div
              className="absolute top-[85px] left-1/2 -translate-x-1/2 text-3xl font-extrabold text-indigo-900"
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2 }}
            >
              <CountUp end={skillPercent} />%
            </motion.div>
            <p className="mt-6 text-base text-gray-700 text-center">
              Biểu đồ phần trăm phù hợp giữa kỹ năng của bạn và ngành công việc lựa chọn.
              <br />
              Đưa ra chi tiết kỹ năng cần bổ sung để hoàn thiện.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="p-7 border rounded-2xl max-w-sm shadow-xl bg-white/80 backdrop-blur flex flex-col items-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
              alt="Công việc"
              className="mx-auto mb-4 h-16"
            />
            <p className="font-semibold text-lg text-indigo-900">Đề xuất công việc phù hợp</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="p-7 border rounded-2xl max-w-sm shadow-xl bg-white/80 backdrop-blur flex flex-col items-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2936/2936885.png"
              alt="Khoá học"
              className="mx-auto mb-4 h-16"
            />
            <p className="font-semibold text-lg text-indigo-900">Đề xuất khóa học bổ sung phù hợp</p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 text-center bg-white px-4">
        <h3 className="text-2xl font-bold mb-8 text-indigo-900">Người dùng nói gì về chúng tôi?</h3>
        <div className="max-w-3xl mx-auto">
          <Slider {...settings}>
            {testimonials.map((t, idx) => (
              <div key={idx} className="px-2">
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.07 }}
                  className="border p-6 rounded-2xl shadow-lg bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col items-center min-h-[220px]"
                >
                  <img
                    src={t.img}
                    alt={`User ${idx + 1}`}
                    className="w-14 h-14 rounded-full mx-auto mb-3 ring-2 ring-indigo-200"
                  />
                  <p className="italic text-gray-800 mb-2">{t.text}</p>
                  <p className="mt-2 text-yellow-500 text-lg">{"⭐️".repeat(t.stars)}</p>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
}

// Animated number (count up) for percent
function CountUp({ end }) {
  const [val, setVal] = useState(0);
  React.useEffect(() => {
    let start = 0;
    const step = () => {
      if (start < end) {
        start += 1;
        setVal(start);
        setTimeout(step, 10);
      } else {
        setVal(end);
      }
    };
    step();
  }, [end]);
  return <span>{val}</span>;
}
