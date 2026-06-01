import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Manually parse .env.local
const envPath = path.join(process.cwd(), ".env.local");
let apiKey = "";
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    if (line.trim().startsWith("GEMINI_API_KEY=")) {
      apiKey = line.split("=")[1].trim();
      break;
    }
  }
}

async function test() {
  console.log("Using API Key:", apiKey ? apiKey.slice(0, 15) + "..." : "undefined");
  
  const testModels = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-3.5-flash"];
  for (const modelName of testModels) {
    try {
      console.log(`\n--- Testing model: ${modelName} ---`);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello! Response with exactly 'OK' if you can read this.");
      console.log(`Result for ${modelName}:`, result.response.text().trim());
    } catch (error) {
      console.error(`Error for ${modelName}:`, error.message || error);
    }
  }
}

test();
