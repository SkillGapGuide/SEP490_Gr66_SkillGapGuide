import React, { useState, useContext, useRef } from "react";
import { useCourseStore } from "../../stores/courseStore";
import TopMenu from "./TopMenu";
import { FaHeartCirclePlus, FaHeartCircleCheck } from "react-icons/fa6";
import {
  HelpCircle as BadgeHelpCircle,
  BookOpen,
  BookMarked,
  Link2,
  Star,
  Info,
} from "lucide-react";
import { courService } from "../../services/courService";
import { UserContext } from "../../context/UserContext";
import { showError, showSuccess, showConfirm } from "../../utils/alert";
import { useNavigate } from "react-router-dom";

const truncate = (text, maxLength = 120) =>
  !text
    ? ""
    : text.length > maxLength
    ? text.slice(0, maxLength) + "..."
    : text;

const CourseSkeletonCard = () => (
  <div className="border border-blue-100 rounded-xl p-4 bg-blue-50">
    <div className="h-4 w-2/3 bg-blue-100 rounded mb-3 animate-pulse" />
    <div className="h-3 w-1/2 bg-blue-100 rounded mb-2 animate-pulse" />
    <div className="h-16 w-full bg-blue-100 rounded mb-3 animate-pulse" />
    <div className="h-6 w-1/3 bg-blue-100 rounded animate-pulse" />
  </div>
);

const SuggestedCourses = () => {
  const { scrapedCourses, isCourseLoading } = useCourseStore();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { user } = useContext(UserContext);
  const userId = user?.id;
  const [favoriteMap, setFavoriteMap] = useState({});
  const [favoriteLoading, setFavoriteLoading] = useState({});
  const skillRefs = useRef({});
  const navigate = useNavigate();

  // ✅ Chỉ PREMIUM được xem
  const role = user?.role ?? "Free User";
  const isPremium = /premium/i.test(role);

  const filteredSkills = Object.entries(scrapedCourses || {}).filter(
    ([_, arr]) => Array.isArray(arr) && arr.length > 0
  );

  const handleAddFavorite = async (courseId) => {
    if (!isPremium) return navigate("/servicepayment"); // chặn thao tác nếu không premium
    if (!userId)
      return showError("Bạn cần đăng nhập để lưu khoá học yêu thích.");

    const result = await showConfirm(
      "Bạn có chắc muốn thêm khóa học này vào yêu thích?",
      "Xác nhận thêm vào yêu thích"
    );
    if (!result.isConfirmed) return;

    if (favoriteMap[courseId]) return;
    setFavoriteLoading((prev) => ({ ...prev, [courseId]: true }));
    try {
      await courService.addCourseToFavorites(userId, courseId);
      setFavoriteMap((prev) => ({ ...prev, [courseId]: true }));
      showSuccess("Đã thêm vào yêu thích!");
    } catch (error) {
      showError("Bạn đã thêm khóa học này vào danh sách yêu thích rồi!");
    } finally {
      setFavoriteLoading((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  const handleSkillSidebarClick = (skill) => {
    const ref = skillRefs.current[skill];
    if (ref?.scrollIntoView)
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ✅ Luôn hiển thị TopMenu, sau đó chọn nhánh nội dung
  return (
    <>
      <TopMenu />

      {/* ❌ Không premium -> upsell */}
      {!isPremium ? (
        <div className="bg-white min-h-screen p-4 md:p-6 max-w-6xl mx-auto">
          <div className="border rounded-xl bg-yellow-50 p-7 text-center my-6 shadow">
            <h2 className="text-xl font-bold text-yellow-700 mb-2">
              Tính năng này dành cho người dùng gói toàn diện
            </h2>
            <p className="text-gray-700 mb-3">
              Nâng cấp tài khoản để xem toàn bộ danh sách khóa học gợi ý theo kỹ
              năng còn thiếu, lộ trình học đề xuất và đề xuất nhà cung cấp phù
              hợp!
            </p>
            <button
              onClick={() => navigate("/servicepayment")}
              className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-5 py-2 rounded shadow"
            >
              Nâng cấp tài khoản ngay
            </button>
          </div>
          {/* Preview skeleton để user thấy “có gì” phía sau */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            <CourseSkeletonCard />
            <CourseSkeletonCard />
            <CourseSkeletonCard />
          </div>
        </div>
      ) : isCourseLoading ? (
        // ⏳ Premium + đang loading -> vẫn thấy TopMenu + spinner
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
          <BookOpen className="animate-bounce mb-2 text-blue-500" size={36} />
          <span className="animate-pulse text-blue-700 font-semibold text-base">
            Đang tìm kiếm khóa học phù hợp (quá trình này có thể mất 1-3
            phút)...
          </span>
        </div>
      ) : (
        // ✅ Premium + đã có dữ liệu
        <div className="bg-white min-h-screen p-4 md:p-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 flex gap-2 items-center">
            <BookOpen className="text-blue-500" /> Danh sách khóa học gợi ý
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar kỹ năng */}
            <div className="col-span-1 border rounded-2xl p-4 bg-blue-50 h-fit sticky top-4">
              <div className="flex items-center gap-2 mb-4 text-blue-700 font-semibold text-lg">
                <BadgeHelpCircle className="text-blue-500" size={20} />
                Khoá học đề cử theo kỹ năng
              </div>
              <ul className="space-y-3">
                {filteredSkills.map(([skill]) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2 cursor-pointer hover:bg-blue-100 rounded-lg px-2 py-1 transition"
                    onClick={() => handleSkillSidebarClick(skill)}
                    title={`Xem các khoá học cho kỹ năng "${skill}"`}
                  >
                    {/* Khung cố định cho icon */}
                    <span className="w-4 h-4 flex items-center justify-center shrink-0">
                      {/* Không cần prop size; dùng w-4 h-4 để cố định 16px */}
                      <BadgeHelpCircle
                        className="text-blue-400 w-4 h-4"
                        aria-hidden="true"
                      />
                    </span>

                    {/* Text chiếm phần còn lại */}
                    <span className="text-blue-900 font-medium flex-1 min-w-0 truncate">
                      {skill}
                    </span>
                  </li>
                ))}
                {filteredSkills.length === 0 && (
                  <li className="text-gray-400 italic">
                    <Info className="inline text-blue-300 mr-1" size={17} />
                    Không có kỹ năng còn thiếu nào!
                  </li>
                )}
              </ul>
              <div className="mt-5 text-xs text-gray-400 italic">
                Bạn nên bổ sung kỹ năng này!
              </div>
            </div>

            {/* Danh sách khóa học */}
            <div className="col-span-1 md:col-span-3">
              {filteredSkills.length === 0 && (
                <div className="text-gray-400 italic py-12 text-base flex items-center justify-center">
                  <Info size={20} className="mx-2 text-blue-300" />
                  Không tìm thấy khoá học phù hợp.
                </div>
              )}

              <div className="space-y-8">
                {filteredSkills.map(([skill, courses]) => (
                  <div
                    key={skill}
                    className="mb-8"
                    ref={(el) => (skillRefs.current[skill] = el)}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <BookMarked className="text-blue-400" size={20} />
                      <span className="text-blue-800 font-semibold text-[18px]">
                        {skill}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {courses.map((course) => (
                        <div
                          key={course.courseId}
                          className="border border-blue-200 rounded-xl p-4 bg-blue-50 shadow-sm hover:bg-blue-100/70 transition relative group flex flex-col h-full"
                        >
                          {/* Tên khoá học + Favorite */}
                          <div className="flex items-center gap-2 mb-2 justify-between">
                            <div className="flex items-center gap-2">
                              <BookOpen className="text-blue-400" size={17} />
                              <span className="font-semibold text-blue-900 text-base">
                                Tên khoá học:
                              </span>
                              <span className="font-semibold text-blue-800">
                                {truncate(course.title, 38)}
                              </span>
                            </div>

                            <button
                              className="ml-2 active:scale-90 transition"
                              onClick={() => handleAddFavorite(course.courseId)}
                              disabled={
                                favoriteMap[course.courseId] ||
                                favoriteLoading[course.courseId]
                              }
                              title={
                                favoriteMap[course.courseId]
                                  ? "Đã lưu vào yêu thích"
                                  : "Thêm vào yêu thích"
                              }
                            >
                              {favoriteMap[course.courseId] ? (
                                <FaHeartCircleCheck
                                  size={28}
                                  className="text-pink-500 drop-shadow"
                                />
                              ) : (
                                <FaHeartCirclePlus
                                  size={28}
                                  className={`text-gray-400 hover:text-pink-500 transition duration-150 ${
                                    favoriteLoading[course.courseId]
                                      ? "animate-pulse"
                                      : ""
                                  }`}
                                />
                              )}
                            </button>
                          </div>

                          {/* Độ khó & rating */}
                          <div className="flex flex-wrap gap-3 items-center text-xs mb-1 mt-2">
                            <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              <Info size={14} className="mr-1" />
                              <span className="font-semibold">
                                Độ khó:
                              </span>{" "}
                              {truncate(course.difficulty, 30)}
                            </span>
                            <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                              <Star size={13} className="mr-1" /> Rating:{" "}
                              <span className="font-semibold">
                                {course.rating}
                              </span>
                            </span>
                          </div>

                          {/* Mô tả rút gọn */}
                          <div className="text-xs text-gray-700 mt-2 group relative max-w-[98%]">
                            <span className="font-semibold mr-1 text-blue-900">
                              Mô tả:
                            </span>
                            <span title={course.description}>
                              {truncate(course.description, 90)}
                              {course.description?.length > 90 && (
                                <span className="text-blue-400 ml-1">
                                  [...]
                                </span>
                              )}
                            </span>
                          </div>

                          {/* Link & Xem chi tiết */}
                          <div className="mt-3 flex items-center gap-5">
                            {course.url && (
                              <a
                                href={course.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-blue-600 hover:text-blue-900 flex items-center gap-1 text-xs font-medium"
                              >
                                <Link2 size={15} />
                                Xem trên website
                              </a>
                            )}
                            <button
                              className="text-xs font-semibold text-blue-700 underline hover:text-blue-900"
                              onClick={() => setSelectedCourse(course)}
                            >
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal chi tiết */}
          {selectedCourse && (
            <div
              className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center transition animate-fade-in"
              onClick={() => setSelectedCourse(null)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in max-h-[92vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-4 text-2xl font-bold text-gray-400 hover:text-red-500"
                  onClick={() => setSelectedCourse(null)}
                >
                  ×
                </button>
                <div
                  className="overflow-y-auto mt-2"
                  style={{ maxHeight: "70vh" }}
                >
                  <h3 className="text-2xl font-bold text-blue-700 mb-3 flex gap-2 items-center">
                    <BookMarked className="text-blue-400" />
                    {selectedCourse.title}
                  </h3>
                  <div className="mb-2 flex items-center gap-2 text-sm text-gray-700">
                    <Info size={17} className="text-blue-300" />
                    <span className="font-semibold text-blue-900 mr-2">
                      Độ khó:
                    </span>
                    {selectedCourse.difficulty}
                  </div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-gray-700">
                    <Star size={16} className="text-yellow-400" />
                    <span className="font-semibold text-blue-900 mr-2">
                      Rating:
                    </span>
                    {selectedCourse.rating}
                  </div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-gray-700">
                    <BookOpen size={17} className="text-blue-400" />
                    <span className="font-semibold text-blue-900 mr-2">
                      Nhà cung cấp:
                    </span>
                    {selectedCourse.provider}
                  </div>
                  <div className="mb-3 flex items-start gap-2 text-sm text-gray-700">
                    <Info size={17} className="text-blue-300 mt-1" />
                    <div>
                      <div className="font-semibold text-blue-900 mb-1">
                        Mô tả chi tiết:
                      </div>
                      <div className="whitespace-pre-line">
                        {selectedCourse.description}
                      </div>
                    </div>
                  </div>
                  {selectedCourse.url && (
                    <div className="mt-4">
                      <a
                        href={selectedCourse.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline font-semibold hover:text-blue-900 flex items-center gap-1"
                      >
                        <Link2 size={18} />
                        Đến trang khóa học
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SuggestedCourses;
