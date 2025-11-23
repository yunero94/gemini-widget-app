import { GoogleGenAI, Type } from "@google/genai";
import { QuoteCategory, QuoteData } from "../types";
import { FALLBACK_QUOTES } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are a high-performance lifestyle assistant designed to provide powerful, aesthetic content for a mobile lock screen widget.
Your target audience includes athletes, stoics, and people of faith seeking daily strength.
Keep content concise (under 25 words) for maximum visual impact on a phone screen.
`;

export const fetchQuote = async (category: QuoteCategory): Promise<QuoteData> => {
  try {
    let specificPrompt = "";
    
    switch (category) {
      case QuoteCategory.BIBLE:
        specificPrompt = "Provide a Bible verse focused on strength, courage, or peace from a standard translation (NIV, ESV, KJV).";
        break;
      case QuoteCategory.PRAYER:
        specificPrompt = "Provide a very short, powerful 1-2 sentence prayer for strength, guidance, or gratitude.";
        break;
      case QuoteCategory.STOIC:
        specificPrompt = "Provide a profound quote from a Stoic philosopher (Marcus Aurelius, Seneca, Epictetus) about resilience, control, discipline, or acceptance.";
        break;
      case QuoteCategory.ATHLETE:
        specificPrompt = "Provide a gritty, intense motivational quote suitable for an athlete or someone training. Focus on discipline, pain, victory, persistence, and mental toughness.";
        break;
    }

    const prompt = `Generate a ${category} content piece. ${specificPrompt} Return strictly JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "The quote text or prayer body.",
            },
            reference: {
              type: Type.STRING,
              description: "The source, author, or book/chapter:verse.",
            }
          },
          required: ["text", "reference"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("Empty response from Gemini");
    }
    
    const parsed = JSON.parse(jsonText);

    return {
      text: parsed.text,
      reference: parsed.reference,
      category: category
    };

  } catch (error) {
    console.error("Error fetching quote:", error);
    // Return fallback based on category to ensure UI doesn't break
    const fallback = FALLBACK_QUOTES[category];
    return {
      text: fallback.text,
      reference: fallback.reference,
      category: category
    };
  }
};
