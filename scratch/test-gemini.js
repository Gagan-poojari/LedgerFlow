import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Manually parse .env.local
const envPath = path.join(process.cwd(), ".env.local");
let apiKey = "";
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    if (line.startsWith("GEMINI_API_KEY=")) {
      apiKey = line.split("=")[1].trim();
      break;
    }
  }
}

async function test() {
  console.log("Using API Key:", apiKey ? apiKey.slice(0, 10) + "..." : "undefined");
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("Trying generateContent with gemini-1.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello! Are you working?");
    console.log("Response text:", result.response.text());
  } catch (error) {
    console.error("Error during test:", error);
  }
}

test();
