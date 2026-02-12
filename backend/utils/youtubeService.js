import { google } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY
});

export const fetchVideoForChapter = async (chapterTitle, topic) => {
  try {
    const response = await youtube.search.list({
      part: "snippet",
      q: `${topic} ${chapterTitle}`,
      maxResults: 1,
      type: "video"
    });

    if (!response.data.items.length) {
      return null;
    }

    return response.data.items[0].id.videoId;

  } catch (error) {
    console.error("YouTube API error:", error.message);
    return null;
  }
};
