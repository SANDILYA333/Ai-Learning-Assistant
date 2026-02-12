import express from "express";
import { generateCourse } from "../controllers/courseController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateCourse);

export default router;
