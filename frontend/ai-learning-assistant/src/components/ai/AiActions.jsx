import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import aiService from "../../services/aiService";
import toast from "react-hot-toast";
import MarkdownRenderer from "../common/MarkdownRenderer";

const AIActions = () => {
  const { id: documentId } = useParams();

  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");
    try {
      const { summary } = await aiService.generateSummary(documentId);
      setModalTitle("Generated Summary");
      setModalContent(summary);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to generate summary.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();

    if (!concept.trim()) {
      toast.error("Please enter a concept to explain.");
      return;
    }

    setLoadingAction("explain");

    try {
      const { explanation } = await aiService.explainConcept(
        documentId,
        concept
      );

      setModalTitle(`Explanation of "${concept}"`);
      setModalContent(explanation);
      setIsModalOpen(true);
      setConcept("");
    } catch (error) {
      toast.error("Failed to explain concept.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className="space-y-8 animate-fadeIn">

        {/* Header */}
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-emerald-600" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              AI Assistant
            </h3>
            <p className="text-sm text-slate-500">
              Powered by advanced AI
            </p>
          </div>
        </div>

        {/* Generate Summary */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-lg shadow-slate-200/40 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-600" strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-md font-semibold text-slate-900">
                Generate Summary
              </h4>
              <p className="text-sm text-slate-500">
                Get a concise summary of the entire document.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateSummary}
            disabled={loadingAction === "summary"}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingAction === "summary" ? "Loading..." : "Summarize"}
          </button>
        </div>

        {/* Explain Concept */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-lg shadow-slate-200/40 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-teal-600" strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-md font-semibold text-slate-900">
                Explain a Concept
              </h4>
              <p className="text-sm text-slate-500">
                Ask AI to explain a specific concept from this document.
              </p>
            </div>
          </div>

          <form onSubmit={handleExplainConcept} className="flex gap-4">
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Enter concept..."
              className="flex-1 h-11 px-4 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition text-sm"
            />

            <button
              type="submit"
              disabled={loadingAction === "explain"}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingAction === "explain" ? "Loading..." : "Explain"}
            </button>
          </form>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 animate-scaleIn">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              {modalTitle}
            </h2>

            <div className="max-h-[60vh] overflow-y-auto text-slate-700">
              <MarkdownRenderer content={modalContent} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIActions;
