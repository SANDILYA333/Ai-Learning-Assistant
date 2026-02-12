import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Trash2,
  BookOpen,
  BrainCircuit,
  Clock,
} from "lucide-react";
import moment from "moment";

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return "N/A";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 p-6 cursor-pointer hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Top Section */}
      <div className="flex items-center justify-between mb-5">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/25 flex items-center justify-center group-hover:scale-110 transition duration-300">
          <FileText className="w-5 h-5 text-white" strokeWidth={2} />
        </div>

        <button
          onClick={handleDelete}
          className="p-2 rounded-lg hover:bg-red-50 transition"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>

      {/* Title */}
      <h3
        className="text-sm font-semibold text-slate-900 truncate mb-3"
        title={document.title}
      >
        {document.title}
      </h3>

      {/* Document Info */}
      <div className="text-xs text-slate-500 mb-4 space-y-2">
        {document.fileSize !== undefined && (
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{formatFileSize(document.fileSize)}</span>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="flex items-center gap-4 text-xs text-slate-600 mb-4">
        {document.flashcardCount !== undefined && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 rounded-lg">
            <BookOpen className="w-3.5 h-3.5 text-purple-600" strokeWidth={2} />
            <span className="text-xs font-semibold text-purple-700">
              {document.flashcardCount} Flashcards
            </span>
          </div>
        )}

        {document.quizCount !== undefined && (
          <div className="flex items-center gap-1.5">
            <BrainCircuit
              className="w-3.5 h-3.5 text-purple-500"
              strokeWidth={2}
            />
            <span>
              {document.quizCount} Quizzes
            </span>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Clock className="w-3.5 h-3.5" strokeWidth={2} />
        <span>Uploaded {moment(document.createdAt).fromNow()}</span>
      </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-emerald-400/40 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default DocumentCard;
