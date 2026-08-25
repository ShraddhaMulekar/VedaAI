import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const boxSchema = {
  type: SchemaType.OBJECT,
  properties: {
    page: { type: SchemaType.INTEGER, description: "1-based page number within the answer sheet, counting every page/file in the order provided" },
    ymin: { type: SchemaType.INTEGER, description: "Top edge, 0-1000 normalized to the page height" },
    xmin: { type: SchemaType.INTEGER, description: "Left edge, 0-1000 normalized to the page width" },
    ymax: { type: SchemaType.INTEGER, description: "Bottom edge, 0-1000 normalized to the page height" },
    xmax: { type: SchemaType.INTEGER, description: "Right edge, 0-1000 normalized to the page width" },
  },
  required: ["page", "ymin", "xmin", "ymax", "xmax"],
};

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    questions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          number: { type: SchemaType.STRING, description: 'Exact printed question label, e.g. "11(a)"' },
          text: { type: SchemaType.STRING },
          matched: { type: SchemaType.BOOLEAN },
          answerText: { type: SchemaType.STRING, nullable: true },
          boxes: { type: SchemaType.ARRAY, items: boxSchema },
          isCorrect: { type: SchemaType.BOOLEAN, nullable: true },
          feedback: { type: SchemaType.STRING, nullable: true },
        },
        required: ["number", "text", "matched", "boxes"],
      },
    },
    unmatchedAnswers: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          text: { type: SchemaType.STRING },
          boxes: { type: SchemaType.ARRAY, items: boxSchema },
        },
        required: ["text", "boxes"],
      },
    },
    overallFeedback: { type: SchemaType.STRING },
  },
  required: ["questions", "unmatchedAnswers", "overallFeedback"],
};

const PROMPT = `You are grading assistant for a teacher. You are given two documents:
1. A QUESTION PAPER (provided first).
2. A STUDENT'S HANDWRITTEN ANSWER SHEET (provided second).

Number the answer sheet's pages sequentially starting at 1, in the exact order the answer sheet material is provided (each image is one page; each page of a PDF is one page). Every bounding box you output must reference this page numbering.

Step 1 - Extract questions:
Read the question paper and list every question in the exact order they are printed (top-to-bottom, then next page). If a question has labelled sub-parts (e.g. "11 (a)", "11 (b)"), treat each sub-part as its own separate question entry. Preserve the exact original numbering/label as printed (e.g. "11(a)").

Step 2 - Find each question's answer:
For every extracted question, search the answer sheet for the student's response to it. The student may answer questions out of order, may answer only some questions, or may write in ways that don't clearly map to any question.
- If found: set matched=true, answerText to a faithful transcription of the handwritten answer, and boxes to one or more tight bounding boxes (one per page the answer spans) that crop exactly the handwritten answer region for that question - not the whole page. Each box needs page (per the numbering above) and ymin/xmin/ymax/xmax as integers on a 0-1000 scale normalized to that page's dimensions, with (0,0) at the top-left corner.
- If no answer exists anywhere for that question: set matched=false, answerText=null, boxes=[].

Step 3 - Unmatched handwriting:
Any handwritten region on the answer sheet that does not correspond to any extracted question (stray notes, rough work, an answer you cannot confidently map to a question number) goes into unmatchedAnswers[] instead, each with its own transcription and boxes.

Step 4 - Grade:
For every matched question, set isCorrect to your best-effort judgement of whether the answer is substantively correct, and feedback to 1-2 sentences of constructive feedback. Leave isCorrect/feedback null for unmatched questions.

Step 5 - Overall:
Write overallFeedback: 2-4 sentences summarizing the student's performance across the whole answer sheet.

Respond with JSON only, matching the given schema exactly. Do not include any text outside the JSON.`;

function fileToPart(file) {
  return {
    inlineData: {
      data: file.buffer.toString("base64"),
      mimeType: file.mimetype,
    },
  };
}

export async function analyze({ questionFiles, answerFiles }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set on the server");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const parts = [
    { text: PROMPT },
    { text: "\n--- QUESTION PAPER ---" },
    ...questionFiles.map(fileToPart),
    { text: "\n--- ANSWER SHEET ---" },
    ...answerFiles.map(fileToPart),
  ];

  const result = await model.generateContent(parts);
  const raw = result.response.text();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error("Model did not return valid JSON: " + err.message);
  }

  return shapeResult(parsed);
}

function slugify(number) {
  return number.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function shapeResult(parsed) {
  const questions = (parsed.questions || []).map((q, i) => ({
    id: `q-${slugify(q.number || String(i))}`,
    number: q.number,
    text: q.text,
    status: q.matched ? "answered" : "unanswered",
    answer: q.matched ? { text: q.answerText ?? "", boxes: q.boxes || [] } : null,
    grading:
      q.matched && (q.isCorrect !== undefined && q.isCorrect !== null)
        ? { isCorrect: q.isCorrect, feedback: q.feedback ?? "" }
        : null,
  }));

  const unmatchedAnswers = (parsed.unmatchedAnswers || []).map((a, i) => ({
    id: `u-${i + 1}`,
    text: a.text,
    boxes: a.boxes || [],
  }));

  const answered = questions.filter((q) => q.status === "answered").length;
  const correct = questions.filter((q) => q.grading?.isCorrect === true).length;

  return {
    questions,
    unmatchedAnswers,
    summary: {
      totalQuestions: questions.length,
      answered,
      correct,
      overallFeedback: parsed.overallFeedback || "",
    },
  };
}
