import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X, Save, Tag } from 'lucide-react';

// Dummy data - replace with API call
const DUMMY_TAGS = [
  { id: 1, name: 'Frontend', description: 'Frontend development skills', count: 15 },
  { id: 2, name: 'Backend', description: 'Backend development technologies', count: 12 },
  { id: 3, name: 'Database', description: 'Database management skills', count: 8 },
];

export default function TagSkillManager() {
  const [tags, setTags] = useState(DUMMY_TAGS);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter tags based on search
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(search.toLowerCase()) ||
    tag.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveTag = (tagData) => {
    if (selectedTag) {
      setTags(tags.map(t => t.id === selectedTag.id ? { ...tagData, id: t.id } : t));
    } else {
      setTags([...tags, { ...tagData, id: Date.now(), count: 0 }]);
    }
    setIsModalOpen(false);
    setSelectedTag(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Quản lý Tag Kỹ năng</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Thêm Tag mới
        </button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm tag..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>

      {/* Tags Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-blue-500" />
                    <span className="font-medium">{tag.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{tag.description}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {tag.count}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedTag(tag); setIsModalOpen(true); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setTags(tags.filter(t => t.id !== tag.id))}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding/editing tags */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            
            <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedTag ? 'Chỉnh sửa Tag' : 'Thêm Tag mới'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleSaveTag({
                    name: formData.get('name'),
                    description: formData.get('description'),
                  });
                }}
                className="p-6 space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tên Tag</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={selectedTag?.name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mô tả</label>
                  <textarea
                    name="description"
                    defaultValue={selectedTag?.description}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save size={20} />
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
        