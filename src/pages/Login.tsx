import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { User } from "lucide-react";

function getOAuthUrl() {
  const authUrl = new URL(import.meta.env.VITE_KIMI_AUTH_URL);
  authUrl.searchParams.set(
    "redirect_uri",
    `${window.location.origin}/api/oauth/callback`
  );
  authUrl.searchParams.set("state", btoa(window.location.pathname));
  return authUrl.toString();
}

export default function Login() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main
        className="flex items-center justify-center px-6"
        style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}
      >
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 mx-auto rounded" style={{ backgroundColor: "var(--bg-secondary)" }} />
        </div>
      </main>
    );
  }

  if (isAuthenticated && user) {
    return (
      <main
        className="flex items-center justify-center px-6"
        style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}
      >
        <div
          className="w-full max-w-[440px] p-12 rounded-lg text-center animate-fade-in"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name ?? ""} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <User size={28} style={{ color: "var(--accent)" }} />
            )}
          </div>
          <h2 className="font-display font-bold text-2xl mb-2" style={{ color: "var(--text-primary)" }}>
            Welcome Back
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            Signed in as {user.name ?? user.email}
          </p>
          <Link to="/" className="btn-primary inline-block">
            Go to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex items-center justify-center px-6"
      style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}
    >
      <div
        className="w-full max-w-[440px] p-12 rounded-lg animate-fade-in"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        <h2
          className="font-display font-bold text-2xl text-center mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Welcome Back
        </h2>
        <p className="text-sm text-center mb-8" style={{ color: "var(--text-secondary)" }}>
          Sign in to your I.A Energy account.
        </p>

        {/* Kimi OAuth */}
        <a
          href={getOAuthUrl()}
          className="flex items-center justify-center gap-3 w-full py-3.5 rounded text-sm font-medium transition-all hover:opacity-90"
          style={{
            backgroundColor: "#2D2D2D",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          Sign in with Kimi
        </a>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
          <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
        </div>

        {/* Email/Password (placeholder) */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
              Email
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="your@email.com"
              disabled
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
              Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              disabled
            />
          </div>
          <button
            disabled
            className="btn-primary w-full opacity-50 cursor-not-allowed"
          >
            Sign In
          </button>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: "var(--text-muted)" }}>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="transition-colors hover:underline" style={{ color: "var(--accent)" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
