import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
} from "lucide-react";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await quizService.getQuizResults(quizId);
        const data = response?.data?.data || response?.data;
        setResults(data);
      } catch (error) {
        toast.error("Failed to fetch quiz results.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!results || !results.quiz || !results.results) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Quiz results not found.</p>
      </div>
    );
  }

  const { quiz, results: detailedResults } = results;

  /* ================= SCORE CALCULATION ================= */

  const totalQuestions = detailedResults.length;

  const correctAnswers = detailedResults.filter((r) => {
    const userIndex = r.options?.findIndex(
      (opt) => opt === r.selectedAnswer
    );

    const correctIndex = r.correctAnswer?.startsWith("O")
      ? parseInt(r.correctAnswer.substring(1)) - 1
      : r.options?.findIndex(
          (opt) => opt === r.correctAnswer
        );

    return userIndex === correctIndex;
  }).length;

  const incorrectAnswers = totalQuestions - correctAnswers;

  const score =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  /* ================= HELPERS ================= */

  const getScoreColor = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Outstanding! 🎯";
    if (score >= 80) return "Great job! 👏";
    if (score >= 70) return "Good work! 👍";
    if (score >= 50) return "Keep improving! 💪";
    return "Don’t give up! 🚀";
  };

  /* ================= RENDER ================= */

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* Back */}
      <div className="mb-6">
        <Link
          to={`/documents/${quiz?.document?._id}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Document
        </Link>
      </div>

      <PageHeader title={`${quiz?.title || "Quiz"} Results`} />

      {/* ================= SCORE CARD ================= */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xl p-10 mt-8">

        <div className="text-center space-y-6">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50">
            <Trophy className="w-7 h-7 text-emerald-600" strokeWidth={2} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Your Score
            </p>

            <div
              className={`inline-block text-5xl font-bold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}
            >
              {score}%
            </div>

            <p className="text-lg mt-3 text-slate-700">
              {getScoreMessage(score)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">

          <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl">
            <Target className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              {totalQuestions} Total
            </span>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">
              {correctAnswers} Correct
            </span>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 bg-rose-50 border border-rose-200 rounded-xl">
            <XCircle className="w-5 h-5 text-rose-600" />
            <span className="text-sm font-medium text-rose-700">
              {incorrectAnswers} Incorrect
            </span>
          </div>

        </div>
      </div>

      {/* ================= DETAILED REVIEW ================= */}
      <div className="mt-12 space-y-8">
        {detailedResults.map((result, index) => {

          const userIndex = result.options?.findIndex(
            (opt) => opt === result.selectedAnswer
          );

          const correctIndex = result.correctAnswer?.startsWith("O")
            ? parseInt(result.correctAnswer.substring(1)) - 1
            : result.options?.findIndex(
                (opt) => opt === result.correctAnswer
              );

          return (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <h4 className="text-base font-semibold text-slate-900 mb-4">
                Question {index + 1}: {result.question}
              </h4>

              <div className="space-y-3">
                {result.options?.map((option, optIndex) => {

                  const isCorrect = optIndex === correctIndex;
                  const isUser = optIndex === userIndex;
                  const isWrong = isUser && optIndex !== correctIndex;

                  return (
                    <div
                      key={optIndex}
                      className={`relative px-4 py-3 rounded-xl border-2 transition-all duration-200
                        ${
                          isCorrect
                            ? "bg-emerald-50 border-emerald-300"
                            : isWrong
                            ? "bg-rose-50 border-rose-300"
                            : "bg-slate-50 border-slate-200"
                        }`}
                    >
                      <div className="flex justify-between items-center">

                        <span
                          className={`text-sm font-medium ${
                            isCorrect
                              ? "text-emerald-900"
                              : isWrong
                              ? "text-rose-900"
                              : "text-slate-700"
                          }`}
                        >
                          {option}
                        </span>

                        <div className="flex items-center gap-2">
                          {isCorrect && (
                            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                              <CheckCircle2 size={14} />
                              Correct
                            </span>
                          )}

                          {isWrong && (
                            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-rose-100 text-rose-700 rounded-full">
                              <XCircle size={14} />
                              Your Answer
                            </span>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {result.explanation && (
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
                  <strong>Explanation:</strong> {result.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResultPage;
