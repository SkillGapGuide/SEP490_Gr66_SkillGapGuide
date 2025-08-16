// src/pages/admin/HomePageManager.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Edit2, Check, X, RotateCw, Info, Save } from "lucide-react";
import { staticPageService } from "../../services/staticPageService";
import { showSuccess, showError, showInfo } from "../../utils/alert";

/**
 * Cấu hình các field bạn muốn quản lý:
 * - key: khóa nội bộ cho React state
 * - titleKey: đúng "title" mà backend đang lưu (tiếng Việt)
 * - label: nhãn hiển thị
 */
const FIELDS = [
  {
    key: "slogan",
    titleKey: "Khẩu hiệu",
    label: "Khẩu hiệu",
    inputClass: "md:w-[28rem] w-full",
    placeholder: "VD: Khám phá, phân tích và phát triển kỹ năng đúng hướng",
  },
  {
    key: "siteName",
    titleKey: "Tên trang",
    label: "Tên trang",
    inputClass: "md:w-80 w-full",
    placeholder: "VD: SkillGapGuide",
  },
  {
    key: "phone",
    titleKey: "Số điện thoại liên hệ",
    label: "Số điện thoại liên hệ",
    inputClass: "md:w-56 w-full",
    placeholder: "VD: 559282 - 978",
  },
];

export default function HomePageManager() {
  // form hiện tại + snapshot gốc để diff
  const [form, setForm] = useState({ slogan: "", siteName: "", phone: "" });
  const [original, setOriginal] = useState({ slogan: "", siteName: "", phone: "" });

  // UI state
  const [editing, setEditing] = useState(null);     // "slogan" | "siteName" | "phone" | null
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);      // save 1 field
  const [savingAll, setSavingAll] = useState(false);
  const [errorText, setErrorText] = useState("");

  // Diff để biết field nào đã thay đổi
  const dirtyMap = useMemo(() => {
    return FIELDS.reduce((acc, f) => {
      acc[f.key] = form[f.key] !== original[f.key];
      return acc;
    }, {});
  }, [form, original]);
  const hasDirty = Object.values(dirtyMap).some(Boolean);

  // Fetch data từ API
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErrorText("");
      try {
        const list = await staticPageService.getHomePage();
        // Ví dụ:
        // [{"title":"Khẩu hiệu","content":"..."},{"title":"Tên trang","content":"..."},{"title":"Số điện thoại liên hệ","content":"..."}]
        const dict = (list || []).reduce((acc, it) => {
          const t = it?.title;
          if (t != null) acc[String(t)] = String(it?.content ?? "");
          return acc;
        }, {});
        const next = FIELDS.reduce((acc, f) => {
          acc[f.key] = dict[f.titleKey] ?? "";
          return acc;
        }, {});
        if (mounted) {
          setForm(next);
          setOriginal(next);
        }
      } catch (e) {
        const msg = e?.response?.data?.message || e?.message || "Không tải được dữ liệu.";
        setErrorText(msg);
        showError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const startEdit = (key) => {
    if (saving || savingAll) return;
    setEditing(key);
  };

  const cancelEdit = () => {
    if (!editing) return;
    const key = editing;
    setForm((s) => ({ ...s, [key]: original[key] })); // revert
    setEditing(null);
  };

  // Lưu 1 field (update theo titleKey)
  const saveOneField = async (key) => {
    if (saving || savingAll) return;
    if (!key) return;

    const field = FIELDS.find((f) => f.key === key);
    if (!field) return;

    const val = form[key];

    // Không có thay đổi -> thoát
    if (val === original[key]) {
      setEditing(null);
      return;
    }

    try {
      setSaving(true);
      await staticPageService.updateHomePage({ title: field.titleKey, content: val });
      setOriginal((s) => ({ ...s, [key]: val }));  // cập nhật snapshot gốc
      setEditing(null);
      showSuccess("Đã lưu thay đổi!");
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Lưu không thành công.";
      showError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleInputKeyDown = (e, key) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveOneField(key);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  // Lưu khi blur (giữ vì tiện, nếu không thích có thể bỏ)
  const handleBlur = (key) => {
    saveOneField(key);
  };

  // Lưu tất cả field đã thay đổi
  const saveAll = async () => {
    if (saving || savingAll) return;

    const changed = FIELDS.filter((f) => form[f.key] !== original[f.key]);
    if (changed.length === 0) {
      showInfo("Không có thay đổi nào để lưu.");
      return;
    }

    setSavingAll(true);
    try {
      for (const f of changed) {
        try {
          await staticPageService.updateHomePage({ title: f.titleKey, content: form[f.key] });
          setOriginal((s) => ({ ...s, [f.key]: form[f.key] }));
        } catch (e) {
          const msg = e?.response?.data?.message || e?.message || `Lỗi khi lưu '${f.label}'.`;
          showError(msg);
          // tiếp tục lưu các field còn lại
        }
      }
      showSuccess("Đã lưu tất cả thay đổi!");
    } finally {
      setSavingAll(false);
    }
  };

  // Làm mới từ API
  const refresh = async () => {
    if (saving || savingAll) return;
    setLoading(true);
    setErrorText("");
    try {
      const list = await staticPageService.getHomePage();
      const dict = (list || []).reduce((acc, it) => {
        const t = it?.title;
        if (t != null) acc[String(t)] = String(it?.content ?? "");
        return acc;
      }, {});
      const next = FIELDS.reduce((acc, f) => {
        acc[f.key] = dict[f.titleKey] ?? "";
        return acc;
      }, {});
      setForm(next);
      setOriginal(next);
      setEditing(null);
      showInfo("Đã tải lại dữ liệu.");
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Không tải được dữ liệu.";
      setErrorText(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  // --------------- UI ---------------

  const Header = () => (
    <div className="relative overflow-hidden rounded-2xl border bg-white/80 backdrop-blur shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] ring-1 ring-blue-100">
      <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-blue-100/50 blur-2xl" />
      <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-sky-100/60 blur-2xl" />
      <div className="relative p-5 md:p-6 flex items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-gradient-to-br from-blue-500/80 to-sky-500/80 flex items-center justify-center text-white shadow-lg">
            <Info size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
              Quản lý nội dung Home Page
            </h2>
            <p className="text-slate-600 text-sm md:text-[15px]">
              Chỉnh sửa nhanh các thông tin hiển thị trên trang chủ.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={loading || saving || savingAll}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            title="Tải lại"
          >
            <RotateCw size={16} />
            Làm mới
          </button>

          <button
            onClick={saveAll}
            disabled={saving || savingAll || !hasDirty}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow
              ${hasDirty ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-400 cursor-not-allowed"}
              disabled:opacity-70`}
            title={hasDirty ? "Lưu tất cả" : "Không có thay đổi"}
          >
            <Save size={16} />
            {savingAll ? "Đang lưu..." : "Lưu tất cả"}
          </button>
        </div>
      </div>
    </div>
  );

  const FieldSkeleton = () => (
    <div className="rounded-xl border p-4 bg-white shadow-sm">
      <div className="h-3 w-28 bg-slate-200 rounded mb-3 animate-pulse" />
      <div className="h-10 w-full bg-slate-100 rounded animate-pulse" />
    </div>
  );

  const FieldCard = ({ f }) => {
    const isEditing = editing === f.key;
    const isDirty = dirtyMap[f.key];

    return (
      <div className="rounded-xl border p-4 bg-white shadow-sm hover:shadow-md transition">
        <div className="flex items-start md:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
                {f.label}
              </span>
              {isDirty && (
                <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  Chưa lưu
                </span>
              )}
            </div>

            {isEditing ? (
              <div className="mt-2 flex flex-col md:flex-row items-stretch md:items-center gap-2">
                <input
                  name={f.key}
                  value={form[f.key]}
                  placeholder={f.placeholder}
                  autoFocus
                  onChange={handleChange}
                  onBlur={() => handleBlur(f.key)}
                  onKeyDown={(e) => handleInputKeyDown(e, f.key)}
                  className={`rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${f.inputClass}`}
                />
                <div className="flex items-center gap-1">
                  <button
                    className="inline-flex items-center gap-1 rounded-lg bg-green-600 text-white px-3 py-2 text-sm hover:bg-green-700"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => saveOneField(f.key)}
                    disabled={saving || savingAll}
                    title="Lưu"
                  >
                    <Check size={16} />
                    Lưu
                  </button>
                  <button
                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={cancelEdit}
                    disabled={saving || savingAll}
                    title="Huỷ"
                  >
                    <X size={16} />
                    Huỷ
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-start md:items-center justify-between gap-3">
                <p className="text-slate-800 break-words">
                  {form[f.key] || <i className="text-slate-400">— Chưa có nội dung —</i>}
                </p>
                <button
                  className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm text-blue-700 hover:bg-blue-50"
                  onClick={() => startEdit(f.key)}
                  disabled={saving || savingAll}
                  title={`Sửa ${f.label.toLowerCase()}`}
                >
                  <Edit2 size={16} />
                  Sửa
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6 space-y-6">
      <Header />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
      ) : errorText ? (
        <div className="rounded-xl border bg-rose-50 text-rose-700 p-4">
          {errorText}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Slogan chiếm 2 cột cho dễ đọc */}
          <div className="md:col-span-2">
            <FieldCard f={FIELDS[0]} />
          </div>
          <FieldCard f={FIELDS[1]} />
          <FieldCard f={FIELDS[2]} />
        </div>
      )}

      {/* Gợi ý nhỏ */}
      <p className="text-xs text-slate-500 text-center">
        Mẹo: Nhấn <b>Enter</b> để lưu nhanh, <b>Esc</b> để huỷ chỉnh sửa.
      </p>
    </div>
  );
}
