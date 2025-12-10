import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, TestConfig } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "The question text." },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of exactly 4 possible answers."
    },
    correctAnswerIndex: {
      type: Type.INTEGER,
      description: "The index (0-3) of the correct answer in the options array."
    },
    explanation: {
      type: Type.STRING,
      description: "A detailed explanation of why the answer is correct."
    }
  },
  required: ["text", "options", "correctAnswerIndex", "explanation"]
};

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: questionSchema
};

export const generateQuestions = async (config: TestConfig): Promise<Question[]> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing!");
    throw new Error("API Key is missing. Please set API_KEY in your environment variables.");
  }

  const model = "gemini-2.5-flash";
  
  // Dynamic prompt construction based on topic selection
  const topicInstruction = config.topic 
    ? `Topic Focus: STRICTLY generate questions ONLY related to the subtopic: "${config.topic}". Do not deviate to other parts of the chapter.`
    : `Topic Focus: Comprehensive coverage of the entire chapter "${config.chapter}". Include a mix of key concepts from all subtopics.`;

  const prompt = `
    Generate ${config.questionCount} multiple-choice questions for the ${config.examType} exam.
    Subject: ${config.subject}
    Class: ${config.classLevel}
    Chapter: ${config.chapter}
    Difficulty: ${config.difficulty}
    ${topicInstruction}

    Strictly follow the ${config.examType} pattern.
    Use CBSE Class 11 & 12 NCERT syllabus as the primary reference.
    Focus on conceptual understanding and application of principles.
    Provide exactly 4 options per question.
    Ensure the questions are high quality, accurate, and relevant.
    Return strictly JSON.
  `;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const rawData = JSON.parse(text);
    
    // Map to ensure IDs
    const questions: Question[] = rawData.map((q: any, index: number) => ({
      id: `q-${Date.now()}-${index}`,
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation
    }));

    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};