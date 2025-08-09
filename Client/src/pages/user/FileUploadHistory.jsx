import React, { useEffect, useState } from "react";
import { historyService } from "../../services/historyService";
import { FaRegFilePdf } from "react-icons/fa";
import { RiFilePaper2Line } from "react-icons/ri";
import SidebarProfile from "../../components/user/SidebarProfile";
import { set } from "react-hook-form";

const PAGE_SIZE = 10;

function parseFilename(desc) {
  const idx = desc.indexOf(":");
  if (idx === -1) return desc;
  return desc.substring(idx + 1).trim();
}

const FileUploadHistory = () => {
  const [tab, setTab] = useState(0); // 0: CV, 1: JD
  const [cvFiles, setCvFiles] = useState([]);
  const [jdFiles, setJdFiles] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await historyService.getActionHistory();
        setCvFiles(res.result.cvFiles || []);
        setJdFiles(res.result.jobDesFile || []);
      } catch (err) {
        setCvFiles([]);
        setJdFiles([]);
      }
    };
    fetchHistory();
  }, []);

  const files = tab === 0 ? cvFiles : jdFiles;
  const totalPages = Math.max(1, Math.ceil(files.length / PAGE_SIZE));
  const displayFiles = files.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTabChange = (tabIdx) => {
    setTab(tabIdx);
    setPage(1);
  };

  // Tổng số
  const totalCV = cvFiles.length;
  const totalJD = jdFiles.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      {/* Sidebar */}
      <SidebarProfile />

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-1">
            Lịch sử upload file
          </h2>
          <div className="text-[15px] text-gray-500 mb-6">
            Đã upload <b>{totalCV} CV</b> &nbsp;|&nbsp; <b>{totalJD} JD</b>
          </div>
          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-semibold border-b-2 transition-all duration-200 ${
                tab === 0 ? "border-blue-700 text-blue-700" : "border-transparent text-gray-400"
              }`}
              onClick={() => handleTabChange(0)}
            >
              Lịch sử upload CV
            </button>
            <button
              className={`px-4 py-2 font-semibold border-b-2 transition-all duration-200 ${
                tab === 1 ? "border-amber-500 text-amber-600" : "border-transparent text-gray-400"
              }`}
              onClick={() => handleTabChange(1)}
            >
              Lịch sử upload JD
            </button>
          </div>

          {/* Danh sách file */}
          <div className="mt-2 space-y-4 min-h-[280px]">
            {displayFiles.length === 0 ? (
              <div className="text-center text-gray-400 py-14">Chưa có lịch sử upload file nào.</div>
            ) : (
              displayFiles.map((item) => (
                <div
                  key={item.logId}
                  className="flex items-center gap-4 border-b border-gray-100 pb-3 last:border-b-0"
                >
                  <span>
                    {tab === 0 ? (
                      <FaRegFilePdf className="w-7 h-7 text-red-400" />
                    ) : (
                      <RiFilePaper2Line className="w-7 h-7 text-amber-500" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">
                      {parseFilename(item.description)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-2 py-1 rounded border text-sm hover:bg-gray-100"
              >
                &lt;&lt;
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx + 1)}
                  className={`px-3 py-1 rounded border text-sm ${
                    page === idx + 1 ? "bg-blue-700 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="px-2 py-1 rounded border text-sm hover:bg-gray-100"
              >
                &gt;&gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadHistory;
