import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateLearningPath = async ({
  topic,
  customContent,
  difficulty,
  duration,
  chapterCount
}) => {

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.6,
      response_mime_type: "application/json"
    }
  });

  const prompt = `
You are an expert curriculum designer.

Generate a structured ${difficulty} course.

Topic: ${topic}
Duration: ${duration}
Number of chapters: ${chapterCount}
Additional requirements: ${customContent || "None"}

Return strictly valid JSON:

{
  "title": "",
  "description": "",
  "chapters": [
    {
      "title": "",
      "description": "",
      "estimatedTime": ""
    }
  ]
}
`;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini JSON parsing failed:", text);
    throw new Error("AI returned invalid JSON");
  }
};
