import { useState } from "react";
import { Star } from "lucide-react";

const Flashcard = ({ card, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!card) return null;

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      onClick={handleFlip}
      className="relative w-full max-w-2xl mx-auto cursor-pointer perspective"
    >
      <div
        className={`relative w-full min-h-[320px] transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* ================= FRONT SIDE ================= */}
        <div className="absolute inset-0 backface-hidden bg-white border border-slate-200 rounded-3xl shadow-xl p-8 flex flex-col justify-between">

          {/* Star Button */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(card._id);
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                card.isStarred
                  ? "bg-yellow-100 text-yellow-500"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200"
              }`}
            >
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={card.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Question */}
          <div className="flex-1 flex items-center justify-center text-center px-4">
            <p className="text-lg font-medium text-slate-800">
              {card.question}
            </p>
          </div>

          <p className="text-sm text-slate-400 text-center">
            Click to reveal answer
          </p>
        </div>

        {/* ================= BACK SIDE ================= */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border border-slate-200 rounded-3xl shadow-xl p-8 flex flex-col justify-between">

          <span className="text-xs font-semibold text-emerald-600 tracking-wide">
            ANSWER
          </span>

          {/* Answer Content */}
          <div className="flex-1 flex items-center justify-center text-center px-4">
            <p className="text-lg text-slate-800">
              {card.answer}
            </p>
          </div>

          <p className="text-sm text-slate-400 text-center">
            Click to flip back
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
