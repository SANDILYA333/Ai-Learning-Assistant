import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
  Star
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";
import Flashcard from "./Flashcard";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  /* ================= FETCH ================= */

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardSets(response.data);
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchFlashcardSets();
    }
  }, [documentId]);

  /* ================= GENERATE ================= */

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  /* ================= REVIEW ================= */

  const handleReview = async (index) => {
    const currentCard = selectedSet?.cards[currentCardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
      toast.success("Flashcard reviewed!");
    } catch (error) {
      toast.error("Failed to review flashcard.");
    }
  };

  const handleNextCard = () => {
    if (!selectedSet) return;
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prev) => (prev + 1) % selectedSet.cards.length
    );
  };

  const handlePrevCard = () => {
    if (!selectedSet) return;
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prev) =>
        (prev - 1 + selectedSet.cards.length) %
        selectedSet.cards.length
    );
  };

  /* ================= STAR ================= */

 const handleToggleStar = async (cardId) => {
  try {
    await flashcardService.toggleStar(cardId);

    // Refetch sets
    const response =
      await flashcardService.getFlashcardsForDocument(documentId);

    setFlashcardSets(response.data);

    // IMPORTANT: update selectedSet as well
    if (selectedSet) {
      const updatedSet = response.data.find(
        (set) => set._id === selectedSet._id
      );
      setSelectedSet(updatedSet);
    }

  } catch (error) {
    toast.error("Failed to update star.");
  }
};

  /* ================= DELETE ================= */

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;

    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Flashcard set deleted.");
      setIsDeleteModalOpen(false);
      setSelectedSet(null);
      fetchFlashcardSets();
    } catch (error) {
      toast.error("Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  /* ================= SELECT ================= */

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  /* ================= UI RENDER ================= */

  const renderFlashcardViewer = () => {
    const currentCard = selectedSet?.cards[currentCardIndex];
    if (!currentCard) return null;

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedSet(null)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition"
          >
            <ArrowLeft size={16} />
            Back to Sets
          </button>

          <span className="text-sm text-slate-500">
            Card {currentCardIndex + 1} of {selectedSet.cards.length}
          </span>
        </div>

        <Flashcard
          card={currentCard}
          onToggleStar={handleToggleStar}
        />

        <div className="flex justify-between">
          <button
            onClick={handlePrevCard}
            className="px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={handleNextCard}
            className="px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-500/30 hover:-translate-y-0.5 transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderSetList = () => {
    if (loading) return <Spinner />;

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">
            Flashcard Sets
          </h3>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-md hover:-translate-y-0.5 transition"
          >
            {generating ? (
              <Spinner />
            ) : (
              <>
                <Sparkles size={16} />
                Generate
              </>
            )}
          </button>
        </div>

        {flashcardSets.length === 0 ? (
          <div className="text-center text-slate-500 py-16">
            No flashcards yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {flashcardSets.map((set) => (
              <div
                key={set._id}
                onClick={() => handleSelectSet(set)}
                className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {set.title || "Flashcard Set"}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {set.cards.length} cards •{" "}
                      {moment(set.createdAt).fromNow()}
                    </p>
                  </div>

                  <button
                    onClick={(e) =>
                      handleDeleteRequest(e, set)
                    }
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ================= RETURN ================= */

  return (
    <>
      {selectedSet
        ? renderFlashcardViewer()
        : renderSetList()}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set"
      >
        <p className="text-slate-600 mb-6">
          Are you sure you want to delete this set?
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
            className="px-4 py-2 bg-red-500 text-white rounded-xl"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;
