import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaRedo } from "react-icons/fa";

export default function Questions() {

  const {isDark} = useOutletContext();
  const { subCategoryId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [answersState, setAnswersState] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
  const qFetch = fetch(
    `https://knowmotion.onrender.com/questions/by-sub-category/${subCategoryId}`
  ).then(r => r.json());

  const scFetch = fetch(
    `https://knowmotion.onrender.com/sub-category-details/${subCategoryId}`
  ).then(r => r.json());

  Promise.all([qFetch, scFetch])
    .then(([qData, scData]) => {
      setQuestions(qData || []);
      setSubjectName(scData.name);
      const saved =
        JSON.parse(localStorage.getItem("knowmotion_progress")) || {};

      const existing = saved[subCategoryId] || {};

      saved[subCategoryId] = {
        ...existing,
        total: qData.length, 
        answers: existing.answers || {}
      };

      localStorage.setItem(
        "knowmotion_progress",
        JSON.stringify(saved)
      );

      if (existing.answers) {
        setAnswersState(existing.answers);
      }
      /* ================================ */

      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
}, [subCategoryId]);

  if (loading) return <div className={`${isDark ? "bg-[#212121] text-white" : "bg-white text-black"} min-h-screen flex items-center justify-center`}>...טוען</div>;
  if (!questions.length) return <div className={`${isDark ? "bg-[#212121] text-white" : "bg-white text-black"} min-h-screen flex items-center justify-center`}>אין שאלות בקטגוריה זו</div>;

  // User clicked answer
  const handleAnswer = async (questionId, answerId) => {
  // prevent re-answer
  if (answersState[questionId]) return;

  try {
    const res = await fetch("https://knowmotion.onrender.com/answers/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question_id: questionId,
        answer_id: answerId

      })
    });

    const data = await res.json();

    setAnswersState(prev => {
  const updated = {
    ...prev,
    [questionId]: {
      selected: answerId,
      isCorrect: data.correct,
      correctAnswerId: data.correct_answer_id
    }
  };

  const allProgress =
    JSON.parse(localStorage.getItem("knowmotion_progress")) || {};

  allProgress[subCategoryId] = {
    answers: updated
  };

  localStorage.setItem(
    "knowmotion_progress",
    JSON.stringify(allProgress)
  );

  return updated;});

  } catch (err) {
    console.error("Answer check failed", err);
  }
};

  const total = questions.length;
  const answeredCount = Object.keys(answersState).length;
  const percentAnswered = Math.round((answeredCount / total) * 100);


const resetProgress = () => {
  const allProgress =
    JSON.parse(localStorage.getItem("knowmotion_progress")) || {};

  delete allProgress[subCategoryId];

  localStorage.setItem(
    "knowmotion_progress",
    JSON.stringify(allProgress)
  );

  setAnswersState({});
  window.scrollTo({ top: 0, behavior: "smooth" });
};



  return (
    <div className = {`${isDark ? "bg-[#212121] text-white": "bg-white text-black"} min-h-screen`}>
      

              {/* STICKY CONTROLS */}
<div className="sticky top-0 z-40 backdrop-blur bg-black/40 border-b border-zinc-800">
  <div
    dir="rtl"
    className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between"
  >
    {/* Back */}
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-4 py-2 rounded-full
      bg-zinc-800 hover:bg-zinc-700 text-white transition"
    >
      <FaArrowRight />
      חזרה
    </button>

    {/* Restart */}
    <button
      onClick={resetProgress}
      className="flex items-center gap-2 px-4 py-2 rounded-full
      bg-rose-600/90 hover:bg-rose-600 text-white transition"
    >
      <FaRedo />
      התחל מחדש
    </button>
  </div>
</div>
      
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-2 text-[#3477B2]">
         שאלות {subjectName}
      </h1>

      <div dir="rtl" className="flex flex-col items-center mb-8 ">
  <div className="relative w-32 h-32">
    <svg className="w-full h-full rotate-[-90deg]">
      <circle
        cx="64"
        cy="64"
        r="56"
        stroke="#2a2a2a"
        strokeWidth="10"
        fill="none"
      />
      <circle
        cx="64"
        cy="64"
        r="56"
        stroke="#38bdf8"
        strokeWidth="10"
        fill="none"
        strokeDasharray={2 * Math.PI * 56}
        strokeDashoffset={
          2 * Math.PI * 56 * (1 - percentAnswered / 100)
        }
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>

    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-2xl font-bold text-[text-[#3477B2]]">
        {percentAnswered}%
      </span>
      <span className="text-xs text-[#3477B2]">התקדמות</span>
    </div>
  </div>

  <div className="mt-3 text-sm text-[#3477B2]">
    {answeredCount} מתוך {total} שאלות
  </div>
</div>

      <div dir="rtl" className="space-y-6">
        {questions.map((q, qIndex) => {
          const state = answersState[q.id] || { selected: null, result: null };
          
          return (
            <div key={q.id} className="bg-zinc-900/80 backdrop-blur border border-zinc-800 p-6 rounded-2xl shadow-lg">

              <div className="mb-3">
                <div className="text-[#3477B2] text-base">שאלה {qIndex + 1}</div>
                <h2 className="text-lg font-semibold text-zinc-100 mt-1 text-right leading-relaxed">
                  {q.question_text}
                </h2>
              </div>
              {q.img_url && (
                <div className="flex justify-center mb-6">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  whileTap = {{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 250, damping:20 }}
                  src={q.img_url}
                  
                  className="rounded-2xl shadow-2xl object-contain w-full max-w-3xl max-h-[300px]"
                />
                </div>
              )}

              {/* ANSWERS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.answers.map((ans) => {
                  const isSelected = state.selected === ans.id;
                  const isCorrectAnswer = state.correctAnswerId === ans.id;

                  let extraClass = "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-100";

                  if (state.selected) {
                    if (isCorrectAnswer) {
                      extraClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                    } else if(isSelected && !state.isCorrect) {
                      extraClass = "bg-rose-500/20 border-rose-500 text-rose-400";
                    }
                    else{
                      extraClass = "opacity-40";
                    }
                  }

                  return (
                    <motion.button
                      key={ans.id}
                      onClick={() => handleAnswer(q.id, ans.id)}
                      disabled={!!state.selected}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-full text-left py-3 px-4 rounded-lg border text-right transition ${extraClass}`}
                    >
                      {ans.answer_text}
                    </motion.button>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
