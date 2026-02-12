import React from "react";
import { FileText, Plus } from "lucide-react";

const EmptyState = ({
  onActionClick,
  title,
  description,
  buttonText,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
      <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100">
        <FileText className="w-7 h-7 text-emerald-600" />
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
        {description}
      </p>

      {onActionClick && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-md hover:-translate-y-0.5 transition"
        >
          <Plus size={16} />
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
