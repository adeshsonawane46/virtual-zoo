import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { handleImageError } from "../utils/imageFallback";

const QuizAnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const category = params.get("category") || "MAMMAL";

  // ---------------- FETCH ANIMALS ----------------
  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:5001/api/animals?category=${category}`)
      .then((res) => res.json())
      .then((data) => {
        setAnimals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Animal fetch error:", err);
        setLoading(false);
      });
  }, [category]);

  const handleStartQuiz = (animal) => {
    navigate(`/quiz-start?animal=${encodeURIComponent(animal.name)}&category=${encodeURIComponent(category)}`);
  };

  const filteredAnimals = animals.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.scientificName && a.scientificName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <Loader />;

  // ---------------- UI ----------------
  return (
    <section className="min-h-screen bg-gradient-to-b from-amber-50/80 via-emerald-50/20 to-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate("/quiz-categories")}
            className="
              inline-flex items-center gap-2 px-5 py-2.5
              bg-white border border-amber-200 shadow-sm rounded-xl
              text-amber-900 font-bold text-xs uppercase tracking-wider
              hover:bg-amber-100/50 hover:shadow-md transition-all duration-300
            "
          >
            ← Back to Categories
          </button>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-emerald-100 border border-emerald-300 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-900 shadow-sm">
              Section: {category} ({animals.length} Animals)
            </span>
          </div>
        </div>

        {/* Heading & Search Bar */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-amber-950 tracking-tight">
            Choose an Animal for Quiz
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2 font-medium">
            Select any animal below to launch an instant <span className="text-emerald-700 font-bold">10-Question Gemini AI MCQ Quiz</span>!
          </p>

          {/* Search Box */}
          <div className="mt-6 relative max-w-md mx-auto">
            <input
              type="text"
              placeholder={`Search ${category.toLowerCase()}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 pl-11 rounded-2xl bg-white border border-amber-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            <span className="absolute left-4 top-3.5 text-gray-400 text-sm">🔍</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-3 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-full"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Animals Grid */}
        {filteredAnimals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-amber-200 max-w-md mx-auto shadow-sm">
            <span className="text-5xl">🔍</span>
            <p className="text-gray-700 font-bold mt-4">
              No animals matching "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredAnimals.map((animal) => (
              <div
                key={animal.id}
                className="
                  group relative overflow-hidden rounded-3xl
                  bg-white border border-amber-200/80
                  shadow-md hover:shadow-2xl transition-all duration-300
                  hover:-translate-y-1.5 flex flex-col justify-between
                "
              >
                <div>
                  {/* Image */}
                  <div className="h-44 w-full overflow-hidden rounded-t-3xl relative bg-amber-100">
                    <img
                      src={animal.image}
                      alt={animal.name}
                      loading="lazy"
                      onError={(e) => handleImageError(e, animal.category)}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {animal.status && (
                      <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-amber-200 text-[0.65rem] font-bold px-2.5 py-1 rounded-full border border-amber-400/30 shadow">
                        {animal.status}
                      </span>
                    )}

                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="text-white font-extrabold text-base leading-tight drop-shadow-md">
                        {animal.name}
                      </p>
                      {animal.scientificName && (
                        <p className="text-amber-200/90 italic text-[0.7rem] truncate font-light">
                          {animal.scientificName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Animal Info */}
                  <div className="p-4 text-xs space-y-1.5 text-gray-600 font-medium">
                    {animal.habitat && (
                      <p className="truncate">
                        <span className="font-bold text-gray-700">🏡 Habitat:</span> {animal.habitat}
                      </p>
                    )}
                    {animal.diet && (
                      <p className="truncate">
                        <span className="font-bold text-gray-700">🥩 Diet:</span> {animal.diet}
                      </p>
                    )}
                  </div>
                </div>

                {/* Start Quiz Action */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleStartQuiz(animal)}
                    className="
                      w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800
                      text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider
                      shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5
                    "
                  >
                    <span>Start Quiz</span>
                    <span>⚡</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default QuizAnimalList;
