import Flashcard from "../models/Flashcard.js";

/* =========================================================
   GET ALL FLASHCARDS FOR A DOCUMENT
   GET /api/flashcards/:documentId
   ========================================================= */
export const getFlashcards = async (req, res, next) => {
  try {
    const flashcards = await Flashcard.find({
      userId: req.user._id,
      documentId: req.params.documentId,
    })
      .populate("documentId", "title fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET ALL FLASHCARD SETS FOR USER
   GET /api/flashcards
   ========================================================= */
export const getAllFlashcardSets = async (req, res, next) => {
  try {
    const flashcardSets = await Flashcard.find({
      userId: req.user._id,
    })
      .populate("documentId", "title fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   REVIEW FLASHCARD
   POST /api/flashcards/:cardId/review
   ========================================================= */
export const reviewFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or card not found",
      });
    }

    const card = flashcardSet.cards.id(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Card not found in set",
      });
    }

    card.lastReviewed = new Date();
    card.reviewCount += 1;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: "Flashcard reviewed successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   TOGGLE STAR
   PUT /api/flashcards/:cardId/star
   ========================================================= */
export const toggleStarFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or card not found",
      });
    }

    const card = flashcardSet.cards.id(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Card not found in set",
      });
    }

    card.isStarred = !card.isStarred;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: `Flashcard ${
        card.isStarred ? "starred" : "unstarred"
      } successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   DELETE FLASHCARD SET
   DELETE /api/flashcards/:id
   ========================================================= */
export const deleteFlashcardSet = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set not found",
      });
    }

    await flashcardSet.deleteOne();

    res.status(200).json({
      success: true,
      message: "Flashcard set deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
