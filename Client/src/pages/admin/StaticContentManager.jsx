import { useState, useEffect } from "react";
import { Edit2, Save, Eye, History, Undo, RotateCcw, Check } from "lucide-react";
import { staticPageService } from "../../services/staticPageService";
import { showSuccess, showError } from "../../utils/alert";

export default function StaticContentManager() {
  const [activeTab, setActiveTab] = useState("terms");
  const [contents, setContents] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [terms, privacy] = await Promise.all([
          staticPageService.getTermsOfService(),
          staticPageService.getPrivacy(),
        ]);

        // API returns array with single object, take first item
        setContents({
          terms: {
            title: terms[0]?.title || "Điều khoản sử dụng",
            content: terms[0]?.content || "",
            // lastUpdated: new Date().toISOString(),
          },
          privacy: {
            title: privacy[0]?.title || "Chính sách bảo mật",
            content: privacy[0]?.content || "",
            // lastUpdated: new Date().toISOString(),
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        showError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

 const handleSave = async () => {
  setSaving(true);
  try {
    const currentContent = contents[activeTab];
    const updateData = {
      title: currentContent.title,
      content: currentContent.content,
    };

    if (activeTab === "terms") {
      await staticPageService.updateTermsOfService(updateData); 
    } else if (activeTab === "privacy") {
      await staticPageService.updatePrivacy(updateData); //
    }

    showSuccess("Đã lưu thay đổi thành công");
  } catch (error) {
    console.error("Error saving:", error);
    showError("Không thể lưu thay đổi. Vui lòng thử lại sau.");
  }
  setSaving(false);
};


  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  const tabs = [
    { id: "terms", label: "Điều khoản sử dụng" },
    { id: "privacy", label: "Chính sách bảo mật" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Quản lý nội dung tĩnh
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
              ${
                previewMode
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
          >
            <Eye size={20} />
            {previewMode ? "Tắt xem trước" : "Xem trước"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
              ${saving ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {saving ? (
              <RotateCcw className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 -mb-px text-sm font-medium transition-colors relative
                ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Editor */}
      <div className="grid gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Tiêu đề</label>
              <input
                type="text"
                value={contents[activeTab].title}
                onChange={(e) =>
                  setContents({
                    ...contents,
                    [activeTab]: { ...contents[activeTab], title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-500">
              Cập nhật lần cuối: {contents[activeTab].lastUpdated}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nội dung</label>
            <div
              className={`border border-gray-200 rounded-lg ${
                previewMode ? "bg-gray-50" : ""
              }`}
            >
              {previewMode ? (
                <div className="prose max-w-none p-4">
                  {contents[activeTab].content}
                </div>
              ) : (
                <textarea
                  value={contents[activeTab].content}
                  onChange={(e) =>
                    setContents({
                      ...contents,
                      [activeTab]: { ...contents[activeTab], content: e.target.value },
                    })
                  }
                  rows={12}
                  className="w-full p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          </div>
        </div>

        {/* Version History */}
       
      </div>

      {/* Auto-save indicator */}
      {/* <div className="fixed bottom-4 right-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
          <Check size={16} />
          <span className="text-sm">Đã lưu tự động</span>
        </div>
      </div> */}
    </div>
  );
}
      