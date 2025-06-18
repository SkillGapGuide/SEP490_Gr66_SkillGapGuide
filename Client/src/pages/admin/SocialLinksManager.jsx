import { useState } from 'react';
import { 
  Facebook, Twitter, Linkedin, Instagram, Youtube, Globe,
  Plus, Save, Trash2, GripVertical, CheckCircle, X
} from 'lucide-react';

const SOCIAL_ICONS = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
};

// Dummy data
const INITIAL_LINKS = [
  { id: 1, type: 'facebook', url: 'https://facebook.com/skillgap', active: true },
  { id: 2, type: 'linkedin', url: 'https://linkedin.com/company/skillgap', active: true },
  { id: 3, type: 'youtube', url: 'https://youtube.com/@skillgap', active: false },
];

export default function SocialLinksManager() {
  const [links, setLinks] = useState(INITIAL_LINKS);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async (link) => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (editingId) {
      setLinks(links.map(l => l.id === editingId ? link : l));
    } else {
      setLinks([...links, { ...link, id: Date.now() }]);
    }
    
    setEditingId(null);
    setSaving(false);
    showSuccess('Đã lưu thành công!');
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Quản lý liên kết mạng xã hội</h2>
        <button
          onClick={() => setEditingId('new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Thêm liên kết mới
        </button>
      </div>

      {/* Links Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <div
            key={link.id}
            className={`group relative bg-white rounded-lg border p-4 hover:shadow-md transition-all
              ${!link.active ? 'opacity-75' : ''}`}
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditingId(link.id)}
                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
              >
                <Save size={16} />
              </button>
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc chắn muốn xóa liên kết này?')) {
                    setLinks(links.filter(l => l.id !== link.id));
                    showSuccess('Đã xóa liên kết!');
                  }
                }}
                className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded ml-1"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`p-3 rounded-lg
                ${link.active ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                {SOCIAL_ICONS[link.type]?.render({ size: 24 })}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 capitalize">{link.type}</h3>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate block"
                >
                  {link.url}
                </a>
                <div className="mt-2 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${link.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-500">
                    {link.active ? 'Đang hoạt động' : 'Đã tắt'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setEditingId(null)} />
            
            <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingId === 'new' ? 'Thêm liên kết mới' : 'Chỉnh sửa liên kết'}
                </h3>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleSave({
                    type: formData.get('type'),
                    url: formData.get('url'),
                    active: formData.get('active') === 'true',
                    id: editingId === 'new' ? Date.now() : editingId,
                  });
                }}
                className="p-6 space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Loại mạng xã hội</label>
                  <select
                    name="type"
                    defaultValue={editingId === 'new' ? '' : links.find(l => l.id === editingId)?.type}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {Object.keys(SOCIAL_ICONS).map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">URL</label>
                  <input
                    type="url"
                    name="url"
                    defaultValue={editingId === 'new' ? '' : links.find(l => l.id === editingId)?.url}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                  <select
                    name="active"
                    defaultValue={editingId === 'new' ? 'true' : links.find(l => l.id === editingId)?.active.toString()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Hoạt động</option>
                    <option value="false">Tắt</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-75"
                  >
                    <Save size={20} />
                    {saving ? 'Đang lưu...' : 'Lưu'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 shadow-lg animate-fade-in">
          <CheckCircle size={20} />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
}
