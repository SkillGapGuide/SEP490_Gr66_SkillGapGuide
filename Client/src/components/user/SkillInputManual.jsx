import SkillTagList from "./SkillTagList";
import SkillPicker from "./SkillPicker";
import { useState } from "react";

export default function SkillInputManual() {
  const [skills, setSkills] = useState([]);

  function addSkill(skill) {
    if (!skills.includes(skill)) setSkills([...skills, skill]);
  }
  function removeSkill(skill) {
    setSkills(skills.filter((s) => s !== skill));
  }

  return (
    <div>
      <h3 className="font-bold mb-2">Kỹ năng của tôi</h3>
      <SkillTagList skills={skills} onRemove={removeSkill} />
      <div className="mt-6">
        <SkillPicker onSelect={addSkill} exclude={skills} />
      </div>
    </div>
  );
}
