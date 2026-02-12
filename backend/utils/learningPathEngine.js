import { generateLearningPath } from "./geminiService2.js";
import { fetchVideoForChapter } from "./youtubeService.js";

export const buildCourse = async (config) => {

  const aiData = await generateLearningPath(config);

  if (!aiData.chapters || !Array.isArray(aiData.chapters)) {
    throw new Error("Invalid AI structure");
  }

  const chapters = await Promise.all(
    aiData.chapters.map(async (chapter) => {

      let videoId = null;

      if (config.includeVideos) {
        videoId = await fetchVideoForChapter(chapter.title, config.topic);
      }

      return {
        title: chapter.title,
        description: chapter.description,
        estimatedTime: chapter.estimatedTime,
        videoId
      };
    })
  );

  return {
    title: aiData.title,
    description: aiData.description,
    chapters
  };
};
