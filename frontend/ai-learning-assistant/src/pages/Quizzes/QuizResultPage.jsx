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

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await quizService.getQuizResults(quizId);
        const data = response?.data?.data || response?.data;
        setResults(data);

        // ✅ FIX: Calculate and update score after fetching results
        if (data?.results) {
          const calculatedScore = calculateScore(data.results);
          
          // Save score to backend
          try {
            await quizService.updateQuizScore(quizId, calculatedScore);
          } catch (err) {
            console.error("Failed to update quiz score:", err);
          }
        }
      } catch (error) {
        toast.error("Failed to fetch quiz results.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId]);

  // ✅ FIX: Extracted scoring logic into reusable function
  const calculateScore = (detailedResults) => {
    const totalQuestions = detailedResults.length;
    
    const correctAnswers = detailedResults.filter((r) => {
      if (r.selectedAnswer === undefined || r.selectedAnswer === null) return false;
      if (!r.correctAnswer || !r.options) return false;

      // Get the actual text of what user selected
      const userSelectedText = r.options[r.selectedAnswer];
      
      // Get the actual correct answer text
      let actualCorrectText = r.correctAnswer;
      if (typeof r.correctAnswer === "string" && /^O\d+$/.test(r.correctAnswer)) {
        const correctIndex = parseInt(r.correctAnswer.substring(1)) - 1;
        actualCorrectText = r.options[correctIndex];
      }

      // Compare trimmed lowercase versions
      return (
        String(userSelectedText).trim().toLowerCase() === 
        String(actualCorrectText).trim().toLowerCase()
      );
    }).length;

    return totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Spinner /></div>;
  if (!results || !results.results) return <div className="flex justify-center items-center min-h-screen"><p>Results not found.</p></div>;

  const { quiz, results: detailedResults } = results;

  /* ================= SCORE CALCULATION ================= */
  const totalQuestions = detailedResults.length;
  const score = calculateScore(detailedResults);

  const correctAnswers = detailedResults.filter((r) => {
    if (r.selectedAnswer === undefined || r.selectedAnswer === null) return false;
    if (!r.correctAnswer || !r.options) return false;

    const userSelectedText = r.options[r.selectedAnswer];
    let actualCorrectText = r.correctAnswer;
    
    if (typeof r.correctAnswer === "string" && /^O\d+$/.test(r.correctAnswer)) {
      const correctIndex = parseInt(r.correctAnswer.substring(1)) - 1;
      actualCorrectText = r.options[correctIndex];
    }

    return (
      String(userSelectedText).trim().toLowerCase() === 
      String(actualCorrectText).trim().toLowerCase()
    );
  }).length;

  const incorrectAnswers = totalQuestions - correctAnswers;

  /* ================= HELPERS ================= */
  const getScoreColor = (s) => {
    if (s >= 80) return "from-emerald-500 to-teal-500";
    if (s >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };

  const getScoreMessage = (s) => {
    if (s >= 90) return "Outstanding! 🎯";
    if (s >= 80) return "Great job! 👏";
    if (s >= 50) return "Good work! 👍";
    return "Keep practicing! 🚀";
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <Link to={`/documents/${quiz?.document?._id || quiz?.document}`} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Back to Document
        </Link>
      </div>

      <PageHeader title={`${quiz?.title || "Quiz"} Results`} />

      {/* SCORE CARD */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xl p-10 mt-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50">
            <Trophy className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Your Score</p>
            <div className={`inline-block text-5xl font-bold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}>
              {score}%
            </div>
            <p className="text-lg mt-3 text-slate-700">{getScoreMessage(score)}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-10">
          <StatBox icon={<Target className="w-5 h-5" />} label={`${totalQuestions} Total`} color="bg-slate-50" />
          <StatBox icon={<CheckCircle2 className="w-5 h-5" />} label={`${correctAnswers} Correct`} color="bg-emerald-50" text="text-emerald-700" />
          <StatBox icon={<XCircle className="w-5 h-5" />} label={`${incorrectAnswers} Incorrect`} color="bg-rose-50" text="text-rose-700" />
        </div>
      </div>

      {/* ✅ FIX: ENHANCED REVIEW SECTION WITH YOUR ANSWER HIGHLIGHTING */}
      <div className="mt-12 space-y-8">
        {detailedResults.map((result, idx) => {
          // Get correct answer text
          let correctText = result.correctAnswer;
          if (typeof correctText === "string" && /^O\d+$/.test(correctText)) {
            const cIdx = parseInt(correctText.substring(1)) - 1;
            correctText = result.options[cIdx];
          }

          // Get user's selected answer text
          const userSelectedText = result.selectedAnswer !== undefined && result.selectedAnswer !== null
            ? result.options[result.selectedAnswer]
            : null;

          const isCorrectAnswer = userSelectedText && 
            String(userSelectedText).trim().toLowerCase() === String(correctText).trim().toLowerCase();

          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              {/* ✅ FIX: Question header with result indicator */}
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-semibold text-slate-900 flex-1">
                  Question {idx + 1}: {result.question}
                </h4>
                {isCorrectAnswer ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700">
                    <CheckCircle2 size={14} />
                    Correct
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
                    <XCircle size={14} />
                    Incorrect
                  </span>
                )}
              </div>

              {/* ✅ FIX: Show what you marked vs correct answer */}
              {!isCorrectAnswer && userSelectedText && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">You marked:</span> {userSelectedText}
                  </p>
                  <p className="text-sm text-blue-900 mt-1">
                    <span className="font-semibold">Correct answer:</span> {correctText}
                  </p>
                </div>
              )}

              {/* Options with highlighting */}
              <div className="space-y-3">
                {result.options?.map((option, optIdx) => {
                  const isCorrectOption = String(option).trim().toLowerCase() === String(correctText).trim().toLowerCase();
                  const isUserSelection = userSelectedText && String(option).trim().toLowerCase() === String(userSelectedText).trim().toLowerCase();
                  
                  let bgClass = "bg-slate-50 border-slate-200";
                  let textClass = "text-slate-700";
                  
                  if (isCorrectOption) {
                    bgClass = "bg-emerald-50 border-emerald-300";
                    textClass = "text-emerald-900";
                  } else if (isUserSelection && !isCorrectOption) {
                    bgClass = "bg-rose-50 border-rose-300";
                    textClass = "text-rose-900";
                  }

                  return (
                    <div key={optIdx} className={`px-4 py-3 rounded-xl border-2 ${bgClass}`}>
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className={textClass}>{option}</span>
                        <div className="flex items-center gap-2">
                          {isCorrectOption && (
                            <span className="text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 size={14}/> Correct
                            </span>
                          )}
                          {isUserSelection && !isCorrectOption && (
                            <span className="text-rose-600 flex items-center gap-1">
                              <XCircle size={14}/> Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, color, text = "text-slate-700" }) => (
  <div className={`flex items-center gap-3 px-6 py-3 ${color} border border-transparent rounded-xl`}>
    {icon}
    <span className={`text-sm font-medium ${text}`}>{label}</span>
  </div>
);

export default QuizResultPage;