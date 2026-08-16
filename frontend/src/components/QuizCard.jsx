import React from "react";

const QuizCard = ({ title, icon, description, count, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-amber-200/80
                 p-7 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
    >
      {/* Top right count badge */}
      {count && (
        <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-[0.7rem] font-bold px-3 py-1 rounded-full border border-emerald-300 shadow-sm">
          {count}
        </span>
      )}

      <div>
        <div className="flex justify-center mb-5 mt-2">
          <span className="text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
            {icon}
          </span>
        </div>

        <h3 className="text-2xl font-extrabold text-amber-950 text-center mb-2 tracking-wide group-hover:text-emerald-700 transition-colors">
          {title}
        </h3>

        <p className="text-center text-gray-600 text-xs md:text-sm leading-relaxed mb-6 font-medium">
          {description}
        </p>
      </div>

      <button
        type="button"
        className="w-full bg-emerald-700 group-hover:bg-emerald-800 text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-wider
                   shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
      >
        <span>Explore 20+ Animals</span>
        <span>→</span>
      </button>
    </div>
  );
};

export default QuizCard;
