import express from "express";
import multer from "multer";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import { analyze } from "./gemini.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

app.use(cors());

app.post(
  "/api/analyze",
  upload.fields([
    { name: "questionPaper", maxCount: 10 },
    { name: "answerSheet", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const questionFiles = req.files?.questionPaper || [];
      const answerFiles = req.files?.answerSheet || [];

      if (questionFiles.length === 0 || answerFiles.length === 0) {
        return res.status(400).json({ error: "Both a question paper and an answer sheet are required." });
      }

      const result = await analyze({ questionFiles, answerFiles });
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message || "Analysis failed." });
    }
  }
);

const frontendDist = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendDist));
app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(frontendDist, "index.html"), (err) => {
    if (err) next();
  });
});

const port = process.env.PORT || 5174;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
