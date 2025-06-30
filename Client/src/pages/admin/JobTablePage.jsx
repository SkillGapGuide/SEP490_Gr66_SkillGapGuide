import { useState } from "react";
import { Search, ChevronDown, Eye } from "lucide-react";
import { FaToggleOn } from "react-icons/fa";

const INIT_GROUPS = [
  {
    id: 1,
    group: "Nhân viên kinh doanh",
    jobs: [
      { id: 11, name: "Sales Bất động sản/Xây dựng", status: "active" },
      { id: 12, name: "Sales Xuất nhập khẩu/Logistics", status: "active" },
      { id: 13, name: "Sales Giáo dục/Khóa học", status: "expired" }
    ]
  },
  {
    id: 2,
    group: "Marketing/PR/Quảng cáo",
    jobs: [
      { id: 21, name: "Marketing", status: "active" },
      { id: 22, name: "Quảng cáo/Sáng tạo", status: "active" },
      { id: 23, name: "Quan hệ Công chúng (PR)", status: "active" }
    ]
  }
];

function StatusTag({ status }) {
  return (
    <span
      className={`font-semibold ${
        status === "active"
          ? "text-green-600"
          : status === "expired"
          ? "text-red-500"
          : "text-gray-400"
      }`}
    >
      {status === "active" ? "Active" : status === "expired" ? "Expired" : status}
    </span>
  );
}

export default function JobTablePage() {
  const [groups, setGroups] = useState(INIT_GROUPS);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [addingJobGroupId, setAddingJobGroupId] = useState(null);
  const [newJobName, setNewJobName] = useState("");
  const [newJobStatus, setNewJobStatus] = useState("active");

  // Thêm nhóm nghề
  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;
    setGroups([
      ...groups,
      { id: Date.now(), group: newGroupName, jobs: [] }
    ]);
    setNewGroupName("");
    setShowAddGroup(false);
  };

  // Thêm nghề trong nhóm
  const handleAddJob = (groupId) => {
    if (!newJobName.trim()) return;
    setGroups(groups.map(g => 
      g.id === groupId
        ? { ...g, jobs: [...g.jobs, { id: Date.now(), name: newJobName, status: newJobStatus }] }
        : g
    ));
    setNewJobName("");
    setNewJobStatus("active");
    setAddingJobGroupId(null);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end w-full max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 flex-1 mb-3 md:mb-0">
          Cập nhật dữ liệu nghề nghiệp
        </h1>
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập tên vị trí công việc"
              className="rounded-xl border border-blue-200 pl-10 pr-3 py-2 w-64 focus:ring-2 focus:ring-blue-400 outline-none text-blue-900"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Bộ lọc & tạo mới nhóm nghề */}
      <div className="flex flex-wrap gap-4 mt-8 w-full max-w-4xl items-center">
        <button className="rounded-l-xl bg-gray-100 text-blue-900 border px-4 py-2 font-semibold border-blue-200 shadow-sm">
          Nhóm nghề
        </button>
        <button
          className="rounded-xl bg-indigo-700 text-white px-4 py-2 font-semibold shadow hover:bg-indigo-800 transition"
          onClick={() => setShowAddGroup(true)}
        >
          + Tạo mới
        </button>
        <div className="flex-1" />
        <div className="relative">
          <button className="flex items-center rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-blue-900 font-medium shadow-sm gap-2">
            Trạng thái <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form thêm nhóm nghề */}
      {showAddGroup && (
        <div className="w-full max-w-2xl mt-4 mb-2 p-4 bg-blue-50 border rounded-xl shadow flex items-center gap-4">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2"
            value={newGroupName}
            onChange={e => setNewGroupName(e.target.value)}
            placeholder="Tên nhóm nghề mới"
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold" onClick={handleAddGroup}>Thêm</button>
          <button className="text-gray-500" onClick={() => setShowAddGroup(false)}>Hủy</button>
        </div>
      )}

      {/* Table nghề */}
      <div className="w-full max-w-4xl mt-8 rounded-xl shadow border overflow-x-auto bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-blue-50 text-blue-900">
              <th className="py-3 px-5 font-semibold">Nhóm nghề</th>
              <th className="py-3 px-5 font-semibold">Nghề</th>
              <th className="py-3 px-5 font-semibold text-center">Trạng thái</th>
              <th className="py-3 px-5 font-semibold text-center"></th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) =>
              group.jobs.length > 0 ? (
                group.jobs.map((job, idx) => (
                  <tr key={job.id} className="border-t last:border-b">
                    {idx === 0 && (
                      <td
                        rowSpan={group.jobs.length}
                        className="align-top px-5 py-4 min-w-[180px] border-r border-blue-100 font-semibold text-blue-900"
                        style={{ verticalAlign: "middle" }}
                      >
                        <div className="flex flex-col gap-2">
                          <span>{group.group}</span>
                          <button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1 text-xs mt-2 w-max"
                            onClick={() => setAddingJobGroupId(group.id)}
                          >
                            + Tạo mới nghề
                          </button>
                          {/* Form thêm nghề */}
                          {addingJobGroupId === group.id && (
                            <div className="mt-2 flex flex-col gap-2">
                              <input
                                type="text"
                                className="border rounded px-2 py-1 text-sm"
                                placeholder="Tên nghề mới"
                                value={newJobName}
                                onChange={e => setNewJobName(e.target.value)}
                              />
                              <select
                                className="border rounded px-2 py-1 text-sm"
                                value={newJobStatus}
                                onChange={e => setNewJobStatus(e.target.value)}
                              >
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                              </select>
                              <div className="flex gap-2">
                                <button
                                  className="bg-indigo-500 text-white px-2 py-1 rounded"
                                  onClick={() => handleAddJob(group.id)}
                                >
                                  Thêm
                                </button>
                                <button
                                  className="text-gray-500"
                                  onClick={() => setAddingJobGroupId(null)}
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                    <td className="px-5 py-4">{job.name}</td>
                    <td className="px-5 py-4 text-center">
                      <StatusTag status={job.status} />
                    </td>
                    <td className="px-5 py-4 text-center flex items-center justify-center gap-2">
                      <FaToggleOn className="text-indigo-600 text-2xl" />
                      <button className="ml-2 bg-white border border-indigo-500 text-indigo-700 font-bold px-4 py-1.5 rounded-xl shadow-sm hover:bg-indigo-50 transition text-sm">
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr key={group.id}>
                  <td className="align-top px-5 py-4 min-w-[180px] border-r border-blue-100 font-semibold text-blue-900">
                    <div className="flex flex-col gap-2">
                      <span>{group.group}</span>
                      <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1 text-xs mt-2 w-max"
                        onClick={() => setAddingJobGroupId(group.id)}
                      >
                        + Tạo mới nghề
                      </button>
                      {/* Form thêm nghề nếu chưa có nghề */}
                      {addingJobGroupId === group.id && (
                        <div className="mt-2 flex flex-col gap-2">
                          <input
                            type="text"
                            className="border rounded px-2 py-1 text-sm"
                            placeholder="Tên nghề mới"
                            value={newJobName}
                            onChange={e => setNewJobName(e.target.value)}
                          />
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            value={newJobStatus}
                            onChange={e => setNewJobStatus(e.target.value)}
                          >
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                          </select>
                          <div className="flex gap-2">
                            <button
                              className="bg-indigo-500 text-white px-2 py-1 rounded"
                              onClick={() => handleAddJob(group.id)}
                            >
                              Thêm
                            </button>
                            <button
                              className="text-gray-500"
                              onClick={() => setAddingJobGroupId(null)}
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td colSpan={3} className="text-gray-400 italic text-center">Chưa có nghề</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
