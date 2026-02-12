import Course from "../models/Course.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { buildCourse } from "../utils/learningPathEngine.js";

export const generateCourse = asyncHandler(async (req, res) => {

  const {
    topic,
    customContent,
    difficulty,
    duration,
    chapterCount,
    includeVideos
  } = req.body;

  if (!topic || !difficulty || !duration || !chapterCount) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  if (chapterCount > 20) {
    return res.status(400).json({
      success: false,
      message: "Maximum 20 chapters allowed"
    });
  }

  const courseData = await buildCourse({
    topic,
    customContent,
    difficulty,
    duration,
    chapterCount,
    includeVideos
  });

  const newCourse = await Course.create({
    user: req.user.id,
    title: courseData.title,
    description: courseData.description,
    topic,
    customContent,
    difficulty,
    duration,
    includeVideos,
    chapters: courseData.chapters
  });

  res.status(201).json({
    success: true,
    data: newCourse
  });
});
