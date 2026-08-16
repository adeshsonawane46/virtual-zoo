import React from "react";
import { useNavigate } from "react-router-dom";
import QuizCard from "../components/QuizCard";

const categories = [
  { name: "MAMMAL", icon: "🐻", description: "21 Mammals available. Discover lions, pandas, whales & more with live Gemini AI MCQs!", count: "21 Animals" },
  { name: "BIRD", icon: "🦅", description: "21 Birds available. Challenge yourself on eagles, macaws, penguins & falcons!", count: "21 Animals" },
  { name: "FISH", icon: "🐟", description: "21 Marine creatures. Dive deep into sharks, clownfish, manta rays & sea horses!", count: "21 Animals" },
  { name: "REPTILE", icon: "🐍", description: "21 Reptiles available. Test your knowledge on cobras, iguanas, crocodiles & dragons!", count: "21 Animals" },
  { name: "AMPHIBIAN", icon: "🐸", description: "21 Amphibians available. Explore poison dart frogs, axolotls & giant salamanders!", count: "21 Animals" },
  { name: "INSECT", icon: "🐝", description: "21 Insects available. Learn about monarch butterflies, Hercules beetles & honeybees!", count: "21 Animals" }
];

const QuizCategories = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-b from-amber-50 via-emerald-50/20 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Banner */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <span className="animate-pulse text-amber-500">✨</span> Powered by Google Gemini AI
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-amber-950 tracking-tight">
            Wildlife Quiz Arena
          </h1>
          <p className="text-base md:text-lg text-gray-600 mt-3 max-w-2xl mx-auto font-medium">
            Select a category with <span className="text-emerald-700 font-bold">20+ Animals each</span>. Start a 10-MCQ challenge generated dynamically by Gemini AI!
          </p>

          <div className="mt-6 flex justify-center gap-6 text-xs font-semibold text-amber-900">
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">
              🐾 120+ Unique Animals
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">
              🎯 10 AI MCQs Per Animal
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">
              ⚡ Instant Gemini Facts
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <QuizCard
              key={cat.name}
              title={cat.name}
              icon={cat.icon}
              count={cat.count}
              description={cat.description}
              onClick={() => navigate(`/quiz-animals?category=${cat.name}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuizCategories;
