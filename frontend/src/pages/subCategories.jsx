import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubjectCard from "../components/subjectCard";
import { useOutletContext } from "react-router-dom";

export default function SubCategories() {
  const {isDark} = useOutletContext();
  const { mainCategoryId } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [mainCategoryName, setMainCategoryName] = useState("");
  const navigate = useNavigate();
  const [dummy, setDummy] = useState(0);

  useEffect(() => {
    fetch(`https://knowmotion.onrender.com/sub-categories/${mainCategoryId}`)
      .then(res => res.json())
      .then(data => {
        setSubCategories(data.sub_categories);  
        setMainCategoryName(data.main_category.name);
      });
  }, [mainCategoryId]);

  // Trigger re-render when window gains focus (back navigation)
  useEffect(() => {
    const handleFocus = () => setDummy(prev => prev + 1);
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const getProgressForSub = (subId) => {
  const allProgress =
    JSON.parse(localStorage.getItem("knowmotion_progress")) || {};

  const subProgress = allProgress[subId];

  if (!subProgress) {
    return { answered: 0, total: 0 };
  }

  const answered = Object.keys(subProgress.answers || {}).length;
  const total = subProgress.total || 0;

    return { answered, total };
};

  return (
    <div className={`page-container ${isDark ? "theme-dark" : "theme-light"}`}>
      <div className="px-6 py-16 flex-1">
        <h1 className="page-title">{mainCategoryName}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">


          {subCategories.map((sub) => {
  const {answered,total} = getProgressForSub(sub.id);

  return (
    <SubjectCard
      key={sub.id}
      name={sub.name}
      image={sub.image_url}
      onClick={() => navigate(`/questions/${sub.id}`)}
      isDark={isDark}
      answered={answered}
      total={total}
    />
  );
})}


        </div>
      </div>
    </div>
  );
}