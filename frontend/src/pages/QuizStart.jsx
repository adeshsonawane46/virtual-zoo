import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { fetchGeminiQuiz, saveQuizScore } from "../services/api";

const QuizStart = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const { updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const animal = params.get("animal") || "African Lion";
  const category = params.get("category") || "MAMMAL";

  // ---------------- FETCH GEMINI MCQS ----------------
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMsg("");

    fetchGeminiQuiz(animal, category)
      .then((data) => {
        if (!isMounted) return;
        const qList = data?.questions || data;
        if (Array.isArray(qList) && qList.length > 0) {
          setQuestions(qList.slice(0, 10));
        } else {
          setErrorMsg("Could not load Gemini questions.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gemini Quiz Fetch Error:", err);
        if (!isMounted) return;
        setErrorMsg("Failed to generate AI quiz. Please try again.");
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [animal, category]);

  const chooseOption = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const submitQuiz = async () => {
    let result = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) result++;
    });

    setScore(result);
    setSubmitted(true);

    try {
      await saveQuizScore(result);
    } catch (err) {
      console.warn("Failed to save score:", err);
    }

    if (result >= 7) {
      try {
        await api.post("/user/quiz-complete");
        if (updateUser) updateUser({ quizCompleted: true });
      } catch (err) {
        console.warn("Quiz complete trigger error:", err);
      }
    }
  };

  // ---------------- LOADING STATE ----------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-emerald-50/30 to-white flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-amber-200 text-center relative overflow-hidden">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-75"></div>
            <div className="relative z-10 w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl shadow-lg">
              ✨
            </div>
          </div>
          <h2 className="text-2xl font-black text-amber-950 mb-2">
            Asking Gemini AI...
          </h2>
          <p className="text-gray-600 text-sm font-medium">
            Generating 10 custom multiple-choice questions for <span className="text-emerald-700 font-bold">{animal}</span>
          </p>
          <div className="mt-6 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-emerald-600 h-full w-2/3 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ERROR STATE ----------------
  if (errorMsg || questions.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center shadow-xl border border-amber-200">
          <span className="text-5xl">⚠️</span>
          <h2 className="text-xl font-bold text-gray-800 mt-4">Quiz Loading Note</h2>
          <p className="text-gray-600 text-sm mt-2">{errorMsg || "No questions found."}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-800"
          >
            Retry Quiz Generation
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <section className="min-h-screen bg-gradient-to-b from-amber-50/80 via-emerald-50/20 to-white py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate(`/quiz-animals?category=${encodeURIComponent(category)}`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 text-amber-900 rounded-xl font-bold text-xs shadow-sm hover:bg-amber-100/50"
          >
            ← Back to Animals
          </button>

          <div className="flex items-center gap-2 bg-emerald-100 border border-emerald-300 px-3.5 py-1 rounded-full text-emerald-900 font-extrabold text-xs">
            <span>✨ Gemini AI Quiz</span>
            <span>•</span>
            <span>{animal}</span>
          </div>
        </div>

        {!submitted ? (
          /* ================= ACTIVE QUIZ RUNNER ================= */
          <div className="bg-white rounded-3xl shadow-xl border border-amber-200/80 overflow-hidden">

            {/* Progress Bar Header */}
            <div className="bg-gradient-to-r from-amber-900 to-emerald-900 p-6 text-white">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-3">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>{answeredCount} / {questions.length} Answered</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card Body */}
            <div className="p-8 md:p-10">
              <h2 className="text-xl md:text-2xl font-black text-amber-950 mb-8 leading-snug">
                {currentQ.question}
              </h2>

              <div className="space-y-3.5 mb-10">
                {currentQ.options.map((opt, i) => {
                  const isSelected = answers[currentQ.id] === opt;
                  const optionLetters = ["A", "B", "C", "D"];
                  return (
                    <button
                      key={opt}
                      onClick={() => chooseOption(currentQ.id, opt)}
                      className={`
                        w-full text-left p-4 rounded-2xl border-2 font-semibold text-sm md:text-base transition-all duration-200 flex items-center gap-4
                        ${isSelected
                          ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md ring-2 ring-emerald-500/30"
                          : "bg-white border-gray-200 text-gray-800 hover:border-emerald-300 hover:bg-emerald-50/40"}
                      `}
                    >
                      <span
                        className={`
                          w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors
                          ${isSelected ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}
                        `}
                      >
                        {optionLetters[i] || i + 1}
                      </span>
                      <span className="flex-grow">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold text-xs text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-3">
                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                      className="px-6 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs shadow-md"
                    >
                      Next Question →
                    </button>
                  ) : (
                    <button
                      onClick={submitQuiz}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
                    >
                      Submit Quiz 🚀
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Jump Bar */}
              <div className="mt-8 pt-4 flex flex-wrap justify-center gap-2">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`
                      w-7 h-7 rounded-lg text-xs font-bold transition-all
                      ${currentIndex === idx ? "bg-amber-900 text-white ring-2 ring-amber-700" : (answers[q.id] ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-gray-100 text-gray-500")}
                    `}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ================= QUIZ RESULT SUMMARY ================= */
          <div className="bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden p-8 md:p-12 text-center">
            <div className="inline-block p-4 rounded-full bg-emerald-50 mb-4 border border-emerald-200">
              <span className="text-6xl">{score >= 7 ? "🏆" : "📚"}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-amber-950 tracking-tight mb-2">
              Quiz Completed!
            </h2>
            <p className="text-gray-600 text-sm font-medium mb-6">
              Gemini AI Quiz for <span className="text-emerald-700 font-bold">{animal}</span>
            </p>

            <div className="max-w-xs mx-auto bg-amber-50/80 rounded-2xl p-6 border border-amber-200 mb-8 shadow-inner">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-800 mb-1">Final Score</p>
              <p className={`text-5xl font-black ${score >= 7 ? "text-emerald-700" : "text-amber-700"}`}>
                {score} <span className="text-2xl text-gray-400 font-bold">/ 10</span>
              </p>
              <p className="text-xs font-bold mt-2 text-gray-600">
                {score >= 7 ? "🎉 Excellent! You passed with distinction." : "💪 Great attempt! Try again to score 7+."}
              </p>
            </div>

            {/* Answer Explanations Review */}
            <div className="text-left mt-10 mb-8">
              <h3 className="text-lg font-black text-amber-950 mb-4 flex items-center gap-2">
                <span>💡 Question Review & Gemini Explanations</span>
              </h3>

              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;
                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border ${isCorrect ? "bg-emerald-50/60 border-emerald-200" : "bg-red-50/60 border-red-200"}`}
                    >
                      <p className="font-bold text-sm text-gray-900 mb-2">
                        {idx + 1}. {q.question}
                      </p>

                      <div className="text-xs space-y-1 mb-2">
                        <p className={isCorrect ? "text-emerald-800 font-semibold" : "text-red-700 font-semibold"}>
                          Your Answer: {userAnswer || "Not answered"} {isCorrect ? "✓" : "✗"}
                        </p>
                        {!isCorrect && (
                          <p className="text-emerald-800 font-semibold">
                            Correct Answer: {q.correctAnswer}
                          </p>
                        )}
                      </div>

                      {q.explanation && (
                        <div className="mt-2 text-xs bg-white/80 p-3 rounded-xl border border-gray-200 text-gray-700 font-medium">
                          <span className="font-bold text-amber-800">Fact:</span> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                  setCurrentIndex(0);
                  window.location.reload();
                }}
                className="px-6 py-3 rounded-xl bg-amber-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-amber-950 shadow"
              >
                Retake Quiz
              </button>

              <button
                onClick={() => navigate(`/quiz-animals?category=${encodeURIComponent(category)}`)}
                className="px-6 py-3 rounded-xl bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-800 shadow"
              >
                Choose Another Animal
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};

export default QuizStart;
