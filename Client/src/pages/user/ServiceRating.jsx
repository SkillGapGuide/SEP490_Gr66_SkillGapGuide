import React, { useState, useContext, useEffect, useMemo, useId } from "react";
import { FaStar, FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { feedbackService } from "../../services/feedbackService";
import { showError, showSuccess } from "../../utils/alert";
import { UserContext } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

const MAX_LEN = 500;
const LABELS = { 1: "Tệ", 2: "Chưa tốt", 3: "Bình thường", 4: "Tốt", 5: "Xuất sắc" };

// parse "YYYY-MM-DD HH:mm:ss.S"
const parseTime = (raw) => dayjs(raw, "YYYY-MM-DD HH:mm:ss.S", true);
const initials = (email = "") => (email.split("@")[0]?.[0] || "U").toUpperCase();

const ServiceRating = () => {
  // ----- Form rating state -----
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formErr, setFormErr] = useState({ rating: "", comment: "" });
  const textareaId = useId();

  const { user } = useContext(UserContext);

  // ----- List feedback state -----
  const FILTERS = [
    { key: "5", label: "5 ★", star: 5 },
    { key: "4", label: "4 ★", star: 4 },
    { key: "all", label: "All ★", star: 0 }, // tuỳ chọn: thêm All để xem toàn bộ
  ];

  const [filterKey, setFilterKey] = useState("5"); // mặc định 5★
  const activeFilter = useMemo(() => FILTERS.find((f) => f.key === filterKey), [filterKey]);

  const PAGE_SIZES = [5, 10, 20];
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [fetchErr, setFetchErr] = useState("");
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1, totalElements: 0, number: 0, size: 10 });

  // ----- Validation -----
  const validate = () => {
    const e = { rating: "", comment: "" };
    const trimmed = comment.trim();
    if (!rating) e.rating = "Vui lòng chọn số sao.";
    if (trimmed.length < 10) e.comment = "Nội dung cần ≥ 10 ký tự.";
    if (trimmed.length > MAX_LEN) e.comment = `Tối đa ${MAX_LEN} ký tự.`;
    setFormErr(e);
    return !e.rating && !e.comment;
  };

  // ----- Submit feedback -----
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!user?.id) {
      showError("Bạn cần đăng nhập để gửi đánh giá.");
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      await feedbackService.createFeedback({
        userId: user.id, // Backend nên lấy từ token thay vì client gửi lên
        content: comment.trim(),
        star: rating,
      });
      showSuccess("Cảm ơn bạn đã gửi đánh giá!");
      setRating(0);
      setHover(0);
      setComment("");
      setFormErr({ rating: "", comment: "" });
      // refresh danh sách theo filter hiện tại
      await fetchData();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ----- Fetch list -----
  const fetchData = async () => {
    setLoading(true);
    setFetchErr("");
    try {
      const res = await feedbackService.getAllFeedbacks({
        star: activeFilter?.star ?? 0,
        pageNo,
        pageSize,
      });
      const payload = res?.data ?? res;
      const result = payload?.result ?? payload;
      const list = result?.content ?? [];
      setItems(list);
      setMeta({
        totalPages: result?.totalPages ?? 1,
        totalElements: result?.totalElements ?? list.length,
        number: result?.number ?? pageNo,
        size: result?.size ?? pageSize,
      });
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Không tải được feedback.";
      setFetchErr(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPageNo(0); // đổi filter/pageSize -> quay về trang 1
  }, [filterKey, pageSize]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, pageNo, pageSize]);

  // ----- Helpers -----
  const remaining = MAX_LEN - comment.length;
  const canPrev = meta.number > 0;
  const canNext = meta.number < (meta.totalPages || 1) - 1;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* ====== FORM GỬI ĐÁNH GIÁ ====== */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white/70 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Đánh giá dịch vụ</h2>
        <p className="text-sm text-gray-600 mb-3">Đánh giá từ 1–5 sao</p>

        {/* Stars */}
        <div role="radiogroup" aria-label="Đánh giá theo số sao" className="flex items-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} sao - ${LABELS[value]}`}
              title={`${value} sao - ${LABELS[value]}`}
              className="p-1"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
            >
              <FaStar
                size={28}
                className={value <= (hover || rating) ? "text-yellow-400" : "text-gray-300"}
              />
            </button>
          ))}
          {formErr.rating && (
            <span className="ml-3 text-xs text-red-600" role="alert">
              {formErr.rating}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mb-3">
          {rating > 0 ? `Bạn chọn: ${rating} sao (${LABELS[rating]})` : "Chưa chọn sao"}
        </div>

        {/* Comment */}
        <label htmlFor={textareaId} className="sr-only">Nội dung đánh giá</label>
        <textarea
          id={textareaId}
          rows={5}
          placeholder="Nhập đánh giá của bạn (tối đa 500 ký tự)…"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, MAX_LEN))}
          className={`w-full border-2 rounded-md p-3 text-sm focus:outline-none focus:ring focus:ring-blue-300 ${
            formErr.comment ? "border-red-400" : "border-blue-400"
          }`}
          aria-invalid={!!formErr.comment}
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-red-600">{formErr.comment}</span>
          <span className="text-gray-500">{remaining} ký tự còn lại</span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className={`px-5 py-2 text-sm rounded text-white ${
              submitting ? "bg-yellow-300 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            {submitting ? "Đang gửi…" : "Gửi đánh giá"}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              setRating(0); setHover(0); setComment(""); setFormErr({ rating: "", comment: "" });
            }}
            className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
          >
            Xoá nội dung
          </button>
        </div>
      </form>

      {/* ====== DANH SÁCH FEEDBACK ====== */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800">Danh sách Feedback</h3>
          <p className="text-sm text-gray-500">Lọc theo số sao (4★, 5★) • Có phân trang</p>
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400" />
          <div className="flex rounded-xl border bg-white overflow-hidden">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`px-3 py-1.5 text-sm ${
                  f.key === filterKey ? "bg-yellow-400 text-white" : "hover:bg-gray-50"
                }`}
                onClick={() => setFilterKey(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="ml-2 text-sm border rounded-lg px-2 py-1 bg-white"
            title="Kích thước trang"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}/page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: Math.min(5, pageSize) }).map((_, i) => (
            <div key={i} className="rounded-2xl border p-4 bg-white">
              <Skeleton height={16} width={180} />
              <div className="mt-2">
                <Skeleton height={12} width={120} />
              </div>
              <div className="mt-3">
                <Skeleton count={2} />
              </div>
            </div>
          ))
        ) : fetchErr ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">{fetchErr}</div>
        ) : items?.length ? (
          <AnimatePresence>
            {items.map((item, idx) => {
              const dt = parseTime(item?.time);
              const displayTime = dt.isValid() ? dt.format("DD/MM/YYYY HH:mm") : item?.time;
              const relative = dt.isValid() ? dt.fromNow() : "";
              return (
                <motion.div
                  key={`${item.email}-${item.time}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-2xl border border-gray-100 shadow-sm p-4 bg-white/70 backdrop-blur hover:shadow-md transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 text-white flex items-center justify-center font-semibold">
                      {initials(item?.email)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{item?.email}</p>
                          <p className="text-xs text-gray-500">
                            {displayTime}
                            {relative ? ` • ${relative}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5" aria-label={`Rating ${item?.star} stars`}>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <FaStar
                              key={i}
                              size={18}
                              className={i <= (item?.star || 0) ? "text-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700 text-sm whitespace-pre-line">{item?.content}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <div className="p-6 text-center text-gray-500 border rounded-2xl bg-white">
            Chưa có feedback phù hợp với bộ lọc.
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !fetchErr && meta?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            className={`px-3 py-1.5 text-sm rounded border ${
              canPrev ? "bg-white hover:bg-gray-50" : "bg-gray-100 cursor-not-allowed text-gray-400"
            }`}
            onClick={() => canPrev && setPageNo((p) => Math.max(0, p - 1))}
            disabled={!canPrev}
          >
            <span className="inline-flex items-center gap-1"><FaChevronLeft /> Prev</span>
          </button>
          <span className="text-sm text-gray-600">
            Page <b>{(meta?.number ?? 0) + 1}</b> / {Math.max(meta?.totalPages ?? 1, 1)}
          </span>
          <button
            className={`px-3 py-1.5 text-sm rounded border ${
              canNext ? "bg-white hover:bg-gray-50" : "bg-gray-100 cursor-not-allowed text-gray-400"
            }`}
            onClick={() => canNext && setPageNo((p) => p + 1)}
            disabled={!canNext}
          >
            <span className="inline-flex items-center gap-1">Next <FaChevronRight /></span>
          </button>
        </div>
      )}

      {/* Footer meta */}
      {!loading && !fetchErr && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          Tổng: {meta?.totalElements ?? 0} feedback • Trang {(meta?.number ?? 0) + 1}/{meta?.totalPages ?? 1}
        </div>
      )}
    </div>
  );
};

export default ServiceRating;
