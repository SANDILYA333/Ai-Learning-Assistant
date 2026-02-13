import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import quizService from "../../services/quizService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";
import QuizCard from "./QuizCard";
import EmptyState from "../common/EmptyState";

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* FETCH */
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await quizService.getQuizzesForDocument(documentId);
      setQuizzes(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchQuizzes();
    }
  }, [documentId]);

  /*  GENERATE  */

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      await aiService.generateQuiz(documentId, {
        numQuestions: Number(numQuestions), // FIXED (ensures number)
      });
      toast.success("Quiz generated successfully!");
      setIsGenerateModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      toast.error(error.message || "Failed to generate quiz.");
    } finally {
      setGenerating(false);
    }
  };

  /*  DELETE */

  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return;

    setDeleting(true);
    try {
      await quizService.deleteQuiz(selectedQuiz._id);
      toast.success("Quiz deleted successfully.");
      setIsDeleteModalOpen(false);
      setSelectedQuiz(null);
      fetchQuizzes();
    } catch (error) {
      toast.error("Failed to delete quiz.");
    } finally {
      setDeleting(false);
    }
  };

  /* ================= RENDER ================= */

  const renderQuizContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (quizzes.length === 0) {
      return (
        <EmptyState
          title="No Quizzes Yet"
          description="Generate a quiz from your document to test your knowledge."
          buttonText="Generate Quiz"
          onActionClick={() => setIsGenerateModalOpen(true)}
        />
      );
    }

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Generate Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-md hover:-translate-y-0.5 transition"
          >
            <Plus size={16} />
            Generate Quiz
          </button>
        </div>

        {/* Quiz Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      </div>
    );
  };

  /* ================= RETURN ================= */

  return (
    <>
      {renderQuizContent()}

      {/* ================= GENERATE MODAL ================= */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Quiz"
      >
        <form onSubmit={handleGenerateQuiz} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Number of Questions
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={numQuestions}
              onChange={(e) =>
                setNumQuestions(Number(e.target.value))
              }
              className="w-full mt-2 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsGenerateModalOpen(false)}
              className="px-4 py-2 bg-slate-100 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={generating}
              className="px-4 py-2 bg-emerald-500 text-white rounded-xl"
            >
              {generating ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= DELETE MODAL ================= */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Quiz"
      >
        <p className="text-slate-600 mb-6">
          Are you sure you want to delete this quiz?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 bg-slate-100 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmDelete}
            disabled={deleting}
            className="px-4 py-2 bg-rose-500 text-white rounded-xl"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default QuizManager;
