export default function CvViewer({ file }) {
  if (!file) return <div className="text-gray-500 text-lg text-center">CV của bạn<br/>Chưa được tải lên</div>;
  // Hiển thị file PDF hoặc link preview
  return (
    <div>
      <div className="font-semibold mb-2">{file.name}</div>
      {/* Xem PDF: có thể dùng react-pdf */}
      {file.type === "application/pdf" && (
        <iframe src={URL.createObjectURL(file)} width="100%" height="400px" title="CV preview" />
      )}
      {/* Nếu là docx chỉ show tên file */}
      {file.type !== "application/pdf" && <div className="text-gray-400">Không hỗ trợ xem trực tiếp. Đã upload!</div>}
    </div>
  );
}
