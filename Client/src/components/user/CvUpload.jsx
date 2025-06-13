import { useState } from "react";
import { showError } from "../../utils/alert"; // Fixed import path

export default function CvUpload() {
  const [file, setFile] = useState(null);

  function handleFile(e) {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const ext = uploadedFile.name.split(".").pop().toLowerCase();
    const pdfType = "application/pdf";
    const docxType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const isPdf =
      ext === "pdf" || uploadedFile.type === pdfType;
    const isDocx =
      ext === "docx" || uploadedFile.type === docxType;

    if (!isPdf && !isDocx) {
      showError("Chỉ cho phép upload file PDF hoặc DOCX.", "File không hợp lệ");
      setFile(null);
      e.target.value = "";
      return;
    }
    setFile(uploadedFile);
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
      <label className="w-full mb-4 flex flex-col items-center cursor-pointer">
        <span className="text-lg font-bold text-blue-700 mb-2">
          Tải lên CV của bạn
        </span>
        <input
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFile}
        />
        <span className="inline-block px-4 py-2 rounded-lg bg-blue-100 text-blue-900 hover:bg-blue-200 transition font-semibold text-base">
          Chọn file PDF hoặc DOCX
        </span>
      </label>

      {file && (
        <div className="mt-6 w-full">
          <div className="font-bold text-blue-800 mb-2">File đã chọn:</div>
          <div className="text-base font-semibold mb-2">{file.name}</div>
          {/* Nếu là PDF, xem trực tiếp */}
          {file.type === "application/pdf" || file.name.endsWith(".pdf") ? (
            <iframe
              src={URL.createObjectURL(file)}
              title="CV Preview"
              width="100%"
              height="420"
              className="rounded-lg border shadow"
            />
          ) : (
            // Nếu là DOCX, chỉ báo tên file + hướng dẫn
            <div className="bg-yellow-100 text-yellow-900 px-4 py-3 rounded-lg mt-4 text-center font-medium">
              Không thể xem trực tiếp file Word trên web.<br />
              <span className="font-semibold">
                Vui lòng chuyển file sang PDF để xem trước trực tiếp.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
