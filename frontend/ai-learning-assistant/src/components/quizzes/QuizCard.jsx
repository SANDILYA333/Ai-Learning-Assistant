import React from "react";
import { Link } from "react-router-dom";
import { Play, BarChart2, Trash2, Award } from "lucide-react";
import moment from "moment";

const QuizCard = ({ quiz, onDelete }) => {
  return (
    <div className="group relative bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 transition"
      >
        <Trash2 className="w-4 h-4" strokeWidth={2} />
      </button>

      <div className="space-y-4">

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
          <Award className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
          Score: {quiz.score ?? 0}
        </div>

        {/* Title */}
        <div>
          <h3
            className="text-base font-semibold text-slate-800 truncate"
            title={quiz.title}
          >
            {quiz.title ||
              `Quiz - ${moment(quiz.createdAt).format("MMM D, YYYY")}`}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Created {moment(quiz.createdAt).format("MMM D, YYYY")}
          </p>
        </div>

        {/* Quiz Info */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
            {quiz.questions?.length || 0}{" "}
            {quiz.questions?.length === 1 ? "Question" : "Questions"}
          </span>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          {quiz?.userAnswers?.length > 0 ? (
            <Link to={`/quizzes/${quiz._id}/results`}>
              <button className="w-full h-11 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition">
                <BarChart2 className="w-4 h-4" strokeWidth={2.5} />
                View Results
              </button>
            </Link>
          ) : (
            <Link to={`/quizzes/${quiz._id}`}>
              <button className="group relative w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl flex items-center justify-center gap-2 overflow-hidden transition hover:shadow-lg">
                <Play className="w-4 h-4 z-10" strokeWidth={2.5} />
                <span className="z-10">Start Quiz</span>

                {/* Soft Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition" />
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
