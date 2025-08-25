import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { paymentService } from "../../services/paymentService";
import { showError, showInfo } from "../../utils/alert";

const STATUS_OPTIONS = [
  { label: "Tất cả", value: "" },
  { label: "SUCCESS", value: "SUCCESS" },
  { label: "PENDING", value: "PENDING" },
  { label: "FAILED", value: "FAILED" },
];
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
// --- pagination helpers ---
const DOTS = "…";

function range(start, end) {
  const len = Math.max(0, end - start + 1);
  return Array.from({ length: len }, (_, i) => i + start);
}

/** Trả về mảng items hiển thị: [1, '…', 8, 9, 10, '…', 50] */
function getPageItems(currentPage, totalPages, siblingCount = 1, boundaryCount = 1) {
  const totalNumbers = siblingCount * 2 + 3 + boundaryCount * 2; // first/last + current + 2 DOTS
  if (totalPages <= totalNumbers) return range(1, totalPages);

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > boundaryCount + 2;
  const showRightDots = rightSibling < totalPages - boundaryCount - 1;

  const leftItems = range(1, boundaryCount);
  const rightItems = range(totalPages - boundaryCount + 1, totalPages);

  if (!showLeftDots && showRightDots) {
    const leftRange = range(1, boundaryCount + siblingCount * 2 + 2);
    return [...leftRange, DOTS, ...rightItems];
  }
  if (showLeftDots && !showRightDots) {
    const rightRange = range(totalPages - (boundaryCount + siblingCount * 2 + 1), totalPages);
    return [...leftItems, DOTS, ...rightRange];
  }
  const middleRange = range(leftSibling, rightSibling);
  return [...leftItems, DOTS, ...middleRange, DOTS, ...rightItems];
}

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState({ pdf: false, excel: false });

  // Bộ lọc ngày + validate lỗi
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");

  // Validate ngày mỗi khi thay đổi
  useEffect(() => {
    if (startDate && endDate) {
      if (startDate > endDate) {
        setDateError("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  }, [startDate, endDate]);



  // Fetch payments (memo để tránh tạo lại mỗi render)
  const fetchPayments = useCallback(
    async (_pageNo = pageNo, _pageSize = pageSize, _status = status, _startDate = startDate, _endDate = endDate) => {
      if (_startDate && _endDate && _startDate > _endDate) {
        setDateError("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
        return;
      }
      setLoading(true);
      try {
        let res;
        if (_startDate && _endDate) {
          res = await paymentService.filterByDatesRange(
            `${_startDate} 00:00:00`,
            `${_endDate} 23:59:59`,
            _pageNo,
            _pageSize
          );
        } else if (_status) {
          res = await paymentService.filter(_status, _pageNo, _pageSize);
        } else {
          res = await paymentService.findAllPayments(_pageNo, _pageSize);
        }
        setPayments(res.result.content);
        setTotalPages(res.result.totalPages);
        setTotalElements(res.result.totalElements);
        setPageNo(res.result.number + 1);
      } catch (e) {
        showInfo(`Khoảng không có dữ liệu thanh toán từ ngày '${_startDate}' đến '${_endDate}'`);
      }
      setLoading(false);
    },
    [pageNo, pageSize, status, startDate, endDate]
  );

  // Fetch khi đổi pageSize, status, startDate, endDate
  useEffect(() => {
    fetchPayments(1, pageSize, status, startDate, endDate);
    // eslint-disable-next-line
  }, [pageSize, status, startDate, endDate]);

  // Đổi trang

  // Filter payments theo search (memoized)
  const filteredPayments = useMemo(
    () =>
      payments.filter(
        (p) =>
          (p.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (p.transactionCode?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      ),
    [payments, searchTerm]
  );
    // rút gọn các nút trang (sibling=1, boundary=1; muốn nhiều hơn thì tăng số)
const pageItems = useMemo(
  () => getPageItems(pageNo, totalPages, 1, 1),
  [pageNo, totalPages]
);

// đảm bảo không vượt biên khi đổi trang
const handlePageChange = useCallback((p) => {
  const np = Math.max(1, Math.min(totalPages, p));
  if (np !== pageNo) {
    fetchPayments(np, pageSize, status, startDate, endDate);
  }
}, [fetchPayments, pageNo, pageSize, status, startDate, endDate, totalPages]);

  // Export PDF/Excel
const handleExportPdf = async () => {
  try {
    const res = await paymentService.exportPdf();
    const blob = new Blob([res.data], { type: 'application/pdf' });
    let filename = "payment-report.pdf";
    if (res.headers && res.headers['content-disposition']) {
      const match = res.headers['content-disposition'].match(/filename="?([^"]+)"?/);
      if (match && match[1]) filename = match[1];
    }
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    showError("Xuất file PDF thất bại");
  }
};

const handleExportExcel = async () => {
  try {
    const res = await paymentService.exportExcel();
    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    let filename = "payment-report.xlsx";
    if (res.headers && res.headers['content-disposition']) {
      const match = res.headers['content-disposition'].match(/filename="?([^"]+)"?/);
      if (match && match[1]) filename = match[1];
    }
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    showError("Xuất file Excel thất bại");
  }
};


  // Clear filter ngày
  const clearDateFilters = useCallback(() => {
    setStartDate("");
    setEndDate("");
    setDateError("");
  }, []);

  // Helper format
  const formatDate = useCallback((str) => {
    if (!str) return "-";
    return new Date(str).toLocaleString("vi-VN", { hour12: false });
  }, []);
  const formatAmount = useCallback((num) => {
    if (!num) return "0 VNĐ";
    return num.toLocaleString("vi-VN") + " VNĐ";
  }, []);

  // UI
  return (
    <div className="p-6 max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl font-extrabold text-indigo-900 tracking-tight">
          Quản lý thanh toán
        </h2>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleExportPdf}
            disabled={exporting.pdf}
            className={`inline-flex items-center gap-2 bg-white border border-indigo-200 px-4 py-2 rounded-xl shadow hover:shadow-indigo-100 hover:bg-indigo-600 hover:text-white transition font-semibold ${
              exporting.pdf && "opacity-50"
            }`}
          >
            {exporting.pdf && <Loader2 size={16} className="animate-spin" />}
            <span>📄 Xuất PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            disabled={exporting.excel}
            className={`inline-flex items-center gap-2 bg-white border border-indigo-200 px-4 py-2 rounded-xl shadow hover:shadow-indigo-100 hover:bg-green-600 hover:text-white transition font-semibold ${
              exporting.excel && "opacity-50"
            }`}
          >
            {exporting.excel && <Loader2 size={16} className="animate-spin" />}
            <span>📊 Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div
        className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-100 rounded-lg shadow-sm px-2 py-3 flex flex-wrap gap-3 mb-4 items-center"
        style={{ minHeight: 64 }}
      >
        <div className="flex items-center border border-indigo-200 rounded-lg px-2 py-1 w-[230px] bg-white focus-within:shadow-lg">
          <Search size={18} className="text-indigo-400 mr-2" />
          <input
            type="text"
            placeholder="Tìm email hoặc mã giao dịch"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none font-semibold"
          />
        </div>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border border-indigo-200 bg-white px-3 py-2 rounded-lg font-semibold"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          className="border border-indigo-200 bg-white px-3 py-2 rounded-lg font-semibold"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>Hiện {size}/trang</option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border border-indigo-200 bg-white px-3 py-2 rounded-lg font-semibold"
          max={endDate || undefined}
        />
        <span className="text-gray-400 font-medium">-</span>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="border border-indigo-200 bg-white px-3 py-2 rounded-lg font-semibold"
          min={startDate || undefined}
        />
        {(startDate || endDate) && (
          <button
            className="ml-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-100 hover:bg-red-50 text-gray-600 font-bold transition"
            onClick={clearDateFilters}
          >
            ✖
          </button>
        )}
        {dateError && (
          <span className="text-red-600 font-semibold ml-2">{dateError}</span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-blue-100 text-indigo-800">
              <th className="px-3 py-2 border">ID</th>
              <th className="px-3 py-2 border">Email</th>
              <th className="px-3 py-2 border">Thời gian</th>
              <th className="px-3 py-2 border">Tổng tiền</th>
              <th className="px-3 py-2 border">Phương thức</th>
              <th className="px-3 py-2 border">Mã giao dịch</th>
              <th className="px-3 py-2 border">Mã QR</th>
              <th className="px-3 py-2 border">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8">
                  <Loader2 className="animate-spin inline text-indigo-500" />{" "}
                  <span className="ml-2 text-indigo-700 font-semibold">
                    Đang tải dữ liệu...
                  </span>
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400 italic">
                  Không có dữ liệu thanh toán
                </td>
              </tr>
            ) : (
              filteredPayments.filter(o => o.status !== "UNPAID").map((p, idx) => (
                <tr
                  key={p.paymentId || idx}
                  className="transition hover:bg-indigo-50"
                >
                  <td className="border px-3 py-2 font-bold">{p.paymentId}</td>
                  <td className="border px-3 py-2 text-gray-700">{p.username}</td>
                  <td className="border px-3 py-2">{formatDate(p.date)}</td>
                  <td className="border px-3 py-2 text-blue-700 font-bold">
                    {formatAmount(p.amount)}
                  </td>
                  <td className="border px-3 py-2">{p.paymentMethod || "-"}</td>
                  <td className="border px-3 py-2">{p.transactionCode || "-"}</td>
                  <td className="border px-3 py-2">
                    {p.qrCodeUrl ? (
                      <a
                        href={p.qrCodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 underline font-medium hover:text-indigo-800"
                      >
                        Xem QR
                      </a>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="border px-3 py-2">
                    <span
                      className={`font-semibold px-3 py-1 rounded-full text-xs shadow-sm
                        ${p.status === "SUCCESS"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : p.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                          : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
     {totalPages > 1 && (
  <div className="flex justify-center my-6 gap-1 flex-wrap">
    <button
      onClick={() => handlePageChange(1)}
      disabled={pageNo === 1}
      className="px-3 py-1.5 border rounded-lg bg-white hover:bg-indigo-50 transition disabled:opacity-50"
      aria-label="Trang đầu"
    >
      {"<<"}
    </button>

    <button
      onClick={() => handlePageChange(pageNo - 1)}
      disabled={pageNo === 1}
      className="px-3 py-1.5 border rounded-lg bg-white hover:bg-indigo-50 transition disabled:opacity-50"
      aria-label="Trang trước"
    >
      {"<"}
    </button>

    {pageItems.map((it, idx) =>
      it === DOTS ? (
        <span
          key={`dots-${idx}`}
          className="px-3 py-1.5 rounded-lg border bg-white text-gray-500 select-none"
        >
          …
        </span>
      ) : (
        <button
          key={it}
          onClick={() => handlePageChange(it)}
          className={`px-3 py-1.5 rounded-lg border transition ${
            pageNo === it ? "bg-indigo-600 text-white font-bold shadow" : "bg-white hover:bg-indigo-50"
          }`}
          aria-label={`Trang ${it}`}
          aria-current={pageNo === it ? "page" : undefined}
        >
          {it}
        </button>
      )
    )}

    <button
      onClick={() => handlePageChange(pageNo + 1)}
      disabled={pageNo === totalPages}
      className="px-3 py-1.5 border rounded-lg bg-white hover:bg-indigo-50 transition disabled:opacity-50"
      aria-label="Trang sau"
    >
      {">"}
    </button>

    <button
      onClick={() => handlePageChange(totalPages)}
      disabled={pageNo === totalPages}
      className="px-3 py-1.5 border rounded-lg bg-white hover:bg-indigo-50 transition disabled:opacity-50"
      aria-label="Trang cuối"
    >
      {">>"}
    </button>
  </div>
)}

      <div className="mt-2 text-right text-sm text-gray-500 font-semibold">
        Tổng số bản ghi: {totalElements}
      </div>
    </div>
  );
};

export default PaymentManagement;
