import { motion } from "framer-motion";

const SubjectCard = ({ name, image, onClick, isDark, answered = 0, total = 0, className = "" }) => {
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <motion.div
      onClick={onClick}
      className={`${isDark ? "bg-[#404040] border-zinc-800" : "bg-gray-300 border-gray-500"} relative rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-accent-primary ${className}`}
      whileHover={{ scale: 1.04, boxShadow: "0 0 50px #388bd4ff" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 600, damping: 20 }}
    >
      {/* ====================== PROGRESS BACKGROUND ====================== */}
      {progress > 0 && progress < 100 && (
  <div
    className="absolute inset-0 rounded-2xl"
    style={{
      background: isDark
        ? `linear-gradient(to right, rgba(72,187,120,0.25) ${progress}%, transparent ${progress}%)`
        : `linear-gradient(to right, rgba(72,187,120,0.2) ${progress}%, transparent ${progress}%)`,
      zIndex: 0,
    }}
  ></div>
)}

      {/* ====================== COMPLETED ====================== */}
      {progress === 100 && (
        <span className="absolute top-3 right-3 text-green-500 text-xl font-bold z-10">✓</span>
      )}

      {/* ====================== CARD CONTENT ====================== */}
      <img
        src={image}
        alt={name}
        className="w-16 h-16 mb-5 object-contain opacity-90 z-10"
      />
      <h2
        className={`text-lg font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r ${
          isDark
            ? "from-[#9aa5ff] via-[#cbb8ff] to-[#e8a6ff]"
            : "from-[#4a57c6] via-[#6a4fc4] to-[#8a3fa8]"
        } z-10`}
      >
        {name}
      </h2>

      {/* ====================== PROGRESS % ====================== */}
      {progress > 0 && progress < 100 && (
        <span className="absolute bottom-3 right-3 text-xs font-semibold text-green-700 z-10">
          {progress}%
        </span>
      )}
    </motion.div>
  );
};

export default SubjectCard;
