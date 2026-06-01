import fs from "fs";

/**
 * Extract embedded text from digital PDFs (no AI). Works when Gemini quota is exceeded.
 */
export async function extractTextFromPdf(filePath) {
  // Polyfill browser globals that pdfjs-dist v5+ needs in Node.js/SSR environments
  if (typeof global !== "undefined") {
    if (!global.DOMMatrix) {
      global.DOMMatrix = class DummyDOMMatrix {
        constructor() {
          this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
        }
      };
    }
    if (!global.ImageData) {
      global.ImageData = class DummyImageData {
        constructor(width, height) {
          this.width = width;
          this.height = height;
          this.data = new Uint8ClampedArray(width * height * 4);
        }
      };
    }
    if (!global.Path2D) {
      global.Path2D = class DummyPath2D {};
    }
  }

  const { PDFParse } = await import("pdf-parse");
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return (result.text || "").trim();
  } finally {
    await parser.destroy?.();
  }
}
