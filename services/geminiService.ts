import { GoogleGenAI, Chat, Content } from "@google/genai";
import { Message, GeminiAssistant } from '../types';

// This is a placeholder for the API key. In a real environment, this would be securely managed.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Neither GEMINI_API_KEY nor API_KEY environment variables are set. Gemini features will not function correctly.");
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY! });

/**
 * Creates a local representation of a Gemini assistant.
 * Gemini doesn't have a persistent Assistant API object like OpenAI,
 * so this function just structures the data.
 * It's async to match the OpenAI service's signature for consistency.
 */
export async function createAssistant(name: string, instructions: string, model: string): Promise<GeminiAssistant> {
    const newAssistant: GeminiAssistant = {
      id: `asst_gemini_${Date.now()}`,
      provider: 'gemini',
      name,
      instructions,
      model,
      createdAt: Date.now(),
    };
    return Promise.resolve(newAssistant);
}

const transformMessagesToHistory = (messages: Message[]): Content[] => {
    return messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));
};

export const createChat = (assistantInstructions: string, history: Message[], model: string): Chat => {
    return ai.chats.create({
        model: model,
        config: {
            systemInstruction: assistantInstructions,
        },
        history: transformMessagesToHistory(history)
    });
};

export async function* streamAssistantResponse(
  chat: Chat,
  newMessage: string,
): AsyncGenerator<string, void, unknown> {
  try {
    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
      if(chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error streaming response from Gemini:", error);
    yield `An error occurred while getting a response. Details: ${error instanceof Error ? error.message : String(error)}`;
  }
}