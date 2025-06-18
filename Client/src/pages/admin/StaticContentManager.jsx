import { useState } from "react";
import { Edit2, Save, Eye, History, Undo, RotateCcw, Check } from "lucide-react";

// Dummy data - replace with API data
const INITIAL_CONTENT = {
  terms: {
    title: "Điều khoản sử dụng",
    content: `Bằng cách truy cập và sử dụng website của chúng tôi, bạn đồng ý tuân thủ các điều khoản dưới đây.
    Hệ thống AI của chúng tôi sẽ phân tích CV/kỹ năng bạn cung cấp để:
    - Xác định kỹ năng còn thiếu
    - Gợi ý khoá học phù hợp từ danh sách hiện có
    Cung cấp thông tin chính xác và trung thực.
    Không sử dụng website vào mục đích vi phạm pháp luật hoặc phát tán nội dung độc hại.
    Không cản trở, phá hoại hệ thống hoặc xâm nhập trái phép.
    Chúng tôi không chịu trách nhiệm đối với mọi hậu quả, thiệt hại do bạn đưa lên trang web dưới mọi hình thức. Website mang tính chất hỗ trợ định hướng, không thay thế tư vấn nghề nghiệp chuyên sâu.
    Chúng tôi có quyền cập nhật các điều khoản này bất kỳ lúc nào. Bạn nên kiểm tra định kỳ để nắm được các thay đổi.`,
    lastUpdated: "2024-01-20"
  },
  privacy: {
    title: "Chính sách bảo mật",
    content: `Khi bạn sử dụng trang web của chúng tôi, chúng tôi có thể thu thập các loại thông tin sau:
    - Họ tên, địa chỉ email
    - CV hoặc danh sách kỹ năng bạn cung cấp
    - Hành vi sử dụng website (như trang bạn quan tâm, thời gian truy cập)
    
    Thông tin của bạn được sử dụng để:
    - Phân tích kỹ năng và đề xuất công việc phù hợp cá nhân hoá
    - Đề xuất các khoá học hoặc lộ trình học tập cá nhân
    - Liên hệ, phản hồi khi bạn gửi yêu cầu hoặc đăng ký
    - Gửi thông báo liên quan đến dịch vụ hoặc hỗ trợ, cập nhật hoặc ưu đãi (nếu bạn đồng ý)
    
    Chúng tôi cam kết:
    - Không chia sẻ, bán hoặc trao đổi thông tin cá nhân của bạn với bên thứ ba mà không có sự đồng ý của bạn
    - Áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ thông tin
    - Bạn có quyền truy cập, chỉnh sửa hoặc xoá thông tin cá nhân của mình bất cứ lúc nào
    - Không sử dụng thông tin ngoài mục đích đã nêu`,
    lastUpdated: "2024-01-19"
  },
  help: {
    title: "Trợ giúp & FAQ",
    content: "Câu hỏi thường gặp...",
    lastUpdated: "2024-01-18"
  }
};

export default function StaticContentManager() {
  const [activeTab, setActiveTab] = useState("terms");
  const [contents, setContents] = useState(INITIAL_CONTENT);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  const tabs = [
    { id: "terms", label: "Điều khoản sử dụng" },
    { id: "privacy", label: "Chính sách bảo mật" },
    { id: "help", label: "Trợ giúp & FAQ" }
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
                    [activeTab]: { ...contents[activeTab], title: e.target.value }
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
                      [activeTab]: { ...contents[activeTab], content: e.target.value }
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
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
            <History size={16} />
            Lịch sử thay đổi
          </h3>
          <div className="space-y-3">
            {[
              { date: "2024-01-20 15:30", user: "Admin" },
              { date: "2024-01-19 10:15", user: "Editor" }
            ].map((version, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Undo size={16} />
                  </button>
                  <span>
                    Chỉnh sửa bởi{" "}
                    <span className="font-medium">{version.user}</span>
                  </span>
                </div>
                <span className="text-gray-500">{version.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="fixed bottom-4 right-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
          <Check size={16} />
          <span className="text-sm">Đã lưu tự động</span>
        </div>
      </div>
    </div>
  );
}
