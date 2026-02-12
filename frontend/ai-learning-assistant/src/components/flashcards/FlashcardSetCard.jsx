import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({ flashcardSet }) => {
  const navigate = useNavigate();

  const handleStudyNow = () => {
    navigate(`/documents/${flashcardSet.documentId._id}/flashcards`);
  };

  const reviewedCount = flashcardSet.cards.filter(
    (card) => card.lastReviewed
  ).length;

  const totalCards = flashcardSet.cards.length;

  const progressPercentage =
    totalCards > 0
      ? Math.round((reviewedCount / totalCards) * 100)
      : 0;

  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer"
      onClick={handleStudyNow}
    >
      {/* Icon + Title */}
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-emerald-50 rounded-xl">
          <BookOpen className="text-emerald-600" strokeWidth={2} />
        </div>

        <div className="flex-1">
          <h3
            className="text-lg font-semibold text-slate-800 truncate"
            title={flashcardSet?.documentId?.title}
          >
            {flashcardSet?.documentId?.title}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Created {moment(flashcardSet.createdAt).fromNow()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="text-slate-600">
          {totalCards} {totalCards === 1 ? "Card" : "Cards"}
        </span>

        {reviewedCount > 0 && (
          <div className="flex items-center gap-2 text-emerald-600 font-medium">
            <TrendingUp strokeWidth={2.5} />
            {progressPercentage}%
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {totalCards > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>Progress</span>
            <span>
              {reviewedCount}/{totalCards} reviewed
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Study Button */}
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStudyNow();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-md transition-all"
        >
          <Sparkles strokeWidth={2.5} />
          Study Now
        </button>
      </div>
    </div>
  );
};

export default FlashcardSetCard;
