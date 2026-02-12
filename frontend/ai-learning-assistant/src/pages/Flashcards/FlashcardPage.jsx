import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";

import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Flashcard from "../../components/flashcards/Flashcard";

const FlashcardPage = () => {
  const { id: documentId } = useParams();

  const [flashcardSet, setFlashcardSet] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ================= FETCH ================= */

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);

      const data = response?.data?.data || [];

      if (data.length > 0) {
        setFlashcardSet(data[0]);
        setFlashcards(data[0].cards || []);
      } else {
        setFlashcardSet(null);
        setFlashcards([]);
      }
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchFlashcards();
  }, [documentId]);

  /* ================= GENERATE ================= */

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  /* ================= NAVIGATION ================= */

  const handleNextCard = () => {
    setCurrentCardIndex((prev) =>
      (prev + 1) % flashcards.length
    );
  };

  const handlePrevCard = () => {
    setCurrentCardIndex((prev) =>
      (prev - 1 + flashcards.length) % flashcards.length
    );
  };

  /* ================= REVIEW ================= */

  const handleReview = async () => {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= TOGGLE STAR ================= */

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);

      setFlashcards((prev) =>
        prev.map((card) =>
          card._id === cardId
            ? { ...card, isStarred: !card.isStarred }
            : card
        )
      );

      toast.success("Star status updated!");
    } catch (error) {
      toast.error("Failed to update star.");
    }
  };

  /* ================= DELETE SET ================= */

  const handleDeleteFlashcardSet = async () => {
    if (!flashcardSet) return;

    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(
        flashcardSet._id
      );
      toast.success("Flashcard set deleted.");
      setIsDeleteModalOpen(false);
      fetchFlashcards();
    } catch (error) {
      toast.error("Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <PageHeader title="Flashcards" />

        <EmptyState
          title="No Flashcards Yet"
          description="Generate flashcards from your document to start learning."
          buttonText="Generate Flashcards"
          onActionClick={handleGenerateFlashcards}
        />
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      {/* Back */}
      <Link
        to={`/documents/${documentId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Document
      </Link>

      <PageHeader
        title={flashcardSet?.documentId?.title || "Flashcards"}
      />

      {/* Flashcard */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-8">

        <Flashcard
          flashcard={currentCard}
          onToggleStar={handleToggleStar}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">

          <Button
            onClick={handlePrevCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
          >
            <ChevronLeft size={16} />
            Previous
          </Button>

          <span className="text-sm text-slate-600">
            {currentCardIndex + 1} / {flashcards.length}
          </span>

          <Button
            onClick={() => {
              handleReview();
              handleNextCard();
            }}
            variant="primary"
          >
            Next
            <ChevronRight size={16} />
          </Button>

        </div>

      </div>

      {/* Bottom Actions */}
      <div className="flex justify-between items-center">

        <Button
          onClick={handleGenerateFlashcards}
          variant="secondary"
          disabled={generating}
        >
          <Plus size={16} />
          {generating ? "Generating..." : "Regenerate"}
        </Button>

        <Button
          onClick={() => setIsDeleteModalOpen(true)}
          variant="danger"
        >
          <Trash2 size={16} />
          Delete Set
        </Button>

      </div>

      {/* DELETE MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set"
      >
        <p className="text-slate-600 mb-6">
          Are you sure you want to delete this flashcard set?
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleDeleteFlashcardSet}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default FlashcardPage;
