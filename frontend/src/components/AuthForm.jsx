import { useState } from "react";
import { ArrowRight, Mail, Lock, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthForm() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md w-full mx-auto py-10">
      <div className="text-center mb-8">
        <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
          V
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-slate-500 text-sm">
          {mode === "login" ? "Log in to grade answer sheets" : "Sign up to start grading answer sheets"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        {mode === "signup" && (
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand-500">
              <UserRound className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full outline-none text-sm"
                placeholder="Your name"
              />
            </div>
          </label>
        )}

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand-500">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none text-sm"
              placeholder="you@school.edu"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand-500">
            <Lock className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none text-sm"
              placeholder="At least 6 characters"
            />
          </div>
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-slate-800 transition"
        >
          {submitting ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
          {!submitting && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
          }}
          className="font-semibold text-brand-600 hover:underline"
        >
          {mode === "login" ? "Sign up" : "Log in"}
        </button>
      </p>
    </div>
  );
}
