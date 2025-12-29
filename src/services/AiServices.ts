import https from "./http";

// Simple completion
export const getCompletion = (prompt: string) => {
  return https.post("/ai/completion", { prompt });
};

// Chat completion
export const getChatCompletion = (
  messages: { role: string; content: string }[]
) => {
  return https.post("/ai/chat", { messages });
};
