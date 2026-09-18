import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-init or safe Gemini instance
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Fusion EduTech Learning Platform API" });
});

// AI Tutor endpoint (Python / Course contextual assistant)
app.post("/api/tutor", async (req, res) => {
  try {
    const { prompt, courseTitle, lessonTitle, lessonContext, actionType, conversationHistory } = req.body;

    if (!prompt && !actionType) {
      return res.status(400).json({ error: "Prompt or actionType is required" });
    }

    const ai = getAIClient();

    let systemInstruction = `You are the official Fusion EduTech AI Learning Tutor. 
Fusion EduTech's motto is "We turn knowledge into capability".
You assist students studying programming, data analytics, cybersecurity, and tech skills.
Context:
- Current Subject/Course: ${courseTitle || "Programming & Tech"}
- Current Lesson: ${lessonTitle || "General Lesson"}
- Lesson Content Summary: ${lessonContext || "General programming concepts"}

Guidelines:
- Give supportive, accurate, concise, and clear explanations.
- When explaining code, use clean Python or relevant code snippets with explanations.
- If the user asks to "explain simpler", break it down into an intuitive everyday analogy and straightforward bullet points.
- If the user asks "quiz me on this", generate a focused, engaging multiple-choice or short-code question based on the current lesson with immediate self-check answer hints.
- Maintain a professional, encouraging, human-centered tone suitable for African and global tech students.`;

    let userQuery = prompt;
    if (actionType === "explain_simpler") {
      userQuery = `Please explain the core concept of this lesson (${lessonTitle}) in simpler, intuitive terms using a practical real-world analogy.`;
    } else if (actionType === "quiz_me") {
      userQuery = `Please give me a quick, interactive practice question or quiz challenge to test my understanding of ${lessonTitle}. Include 4 multiple-choice options (A, B, C, D) and then reveal the answer with a clear explanation below a spoiler tag or separator.`;
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemInstruction}\n\nUser Question/Request:\n${userQuery}`
                }
              ]
            }
          ]
        });

        const reply = response.text || "I am here to help you master this lesson. How can I assist you further?";
        return res.json({ reply, source: "gemini-3.8-flash" });
      } catch (geminiError: any) {
        console.warn("Gemini API call failed, falling back to built-in tutor response:", geminiError?.message || geminiError);
      }
    }

    // Built-in intelligent fallback tutor responses tailored to lesson & actions
    let fallbackReply = "";
    if (actionType === "explain_simpler") {
      fallbackReply = `Here is a simpler way to think about **${lessonTitle || "this topic"}**:\n\nImagine you are writing a cooking recipe. Instead of doing everything by hand every single time from scratch, you create clear, step-by-step instructions. In programming:\n- Variables hold your ingredients.\n- Control structures (like if/else) decide what to do depending on whether water is boiling.\n- Loops repeat steps until finished.\n- Functions wrap up reusable recipes you can call whenever you need them!\n\nDoes this picture help? What part would you like to explore deeper?`;
    } else if (actionType === "quiz_me") {
      fallbackReply = `### Quick Practice Challenge for **${lessonTitle || "this lesson"}**:\n\n**Question:** In Python, which data structure is ordered, mutable (changeable), and written with square brackets ` + "`[ ]`" + `?\n\nA) Tuple\nB) Dictionary\nC) List\nD) Set\n\n*(Think for a moment before reading below...)*\n\n---\n**Answer:** **C) List**!\n*Explanation:* Lists are ordered, changeable collections defined by square brackets like ` + "`fruits = ['mango', 'banana', 'orange']`" + `. Tuples use parentheses ` + "`( )`" + ` and are immutable, while Dictionaries use key-value pairs in curly braces ` + "`{ }`" + `.`;
    } else {
      fallbackReply = `Hello! I'm your **Fusion EduTech AI Tutor**. Regarding **${lessonTitle || "this topic"}**:\n\n"${userQuery}"\n\nIn practical tech work, breaking this down into fundamental building blocks helps: understand the inputs, the processing logic, and the expected output. Try testing out small snippets in the lesson's interactive code playground block on the left!\n\nFeel free to ask me to *"Explain simpler"* or click *"Quiz me on this"* to test your memory.`;
    }

    return res.json({ reply: fallbackReply, source: "fallback-tutor" });
  } catch (error: any) {
    console.error("Error in /api/tutor:", error);
    res.status(500).json({ error: "Internal tutor error", message: error?.message });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fusion EduTech server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
