const API_URL = import.meta.env.VITE_API_URL ?? "";

async function parseJsonOrThrow(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function analyzeSheets(questionFiles, answerFiles) {
  const formData = new FormData();
  questionFiles.forEach((f) => formData.append("questionPaper", f));
  answerFiles.forEach((f) => formData.append("answerSheet", f));

  const res = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  return parseJsonOrThrow(res);
}

export async function signup(name, email, password) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  return parseJsonOrThrow(res);
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return parseJsonOrThrow(res);
}

export async function logout() {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return parseJsonOrThrow(res);
}

export async function fetchMe() {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    credentials: "include",
  });
  return parseJsonOrThrow(res);
}
