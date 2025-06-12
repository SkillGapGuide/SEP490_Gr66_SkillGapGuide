// src/components/user/SkillTagList.jsx
export default function SkillTagList({ skills, onRemove }) {
  if (!skills.length)
    return <div className="text-gray-400 italic">Chưa chọn kỹ năng nào</div>;

  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className="bg-blue-200 text-blue-900 px-4 py-1 rounded-xl flex items-center gap-2 font-medium text-base"
        >
          {skill}
          <button
            className="ml-1 text-xl text-blue-900 hover:text-red-500 font-bold focus:outline-none"
            onClick={() => onRemove(skill)}
            type="button"
            title="Xoá kỹ năng"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
