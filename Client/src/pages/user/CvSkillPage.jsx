import { useState } from "react";
import UserNavTabs from "../../components/user/UserNavTabs";
import SkillInputManual from "../../components/user/SkillInputManual";
import CvUpload from "../../components/user/CvUpload";

export default function CvSkillPage() {
  const [tab, setTab] = useState("cv"); // chỉ "cv" hoặc "add-skill"

  return (
    <div className="max-w-5xl mx-auto py-6">
      <UserNavTabs
        tab={tab}
        onTabChange={setTab}
        onViewResult={() => {/* mở modal hoặc điều hướng xem kết quả */}}
      />
      <div className="mt-4">
        {tab === "cv" && <CvUpload />}
        {tab === "add-skill" && <SkillInputManual />}
      </div>
    </div>
  );
}
