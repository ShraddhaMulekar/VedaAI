export async function analyzeSheets(questionFiles, answerFiles) {
  const formData = new FormData();
  questionFiles.forEach((f) => formData.append("questionPaper", f));
  answerFiles.forEach((f) => formData.append("answerSheet", f));

  const res = await fetch("/api/analyze", { method: "POST", body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}
