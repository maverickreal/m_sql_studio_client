import { Link, useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Button } from "./ui/Button";
import { APP_NAME } from "../utils/constants";
import { authClient } from "../services/authClient";

export function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const sessionReady = useSelector((state: RootState) => state.auth.sessionReady);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-800 bg-surface-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="currentColor" />
              <text
                x="50%"
                y="54%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="#fff"
                fontFamily="monospace"
                fontSize="14"
                fontWeight="bold"
              >
                SQL
              </text>
            </svg>
            {APP_NAME}
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            <Link
              to="/assignments"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${isActive("/assignments") ? "bg-surface-800 text-white" : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/50"}`}
            >
              Assignments
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!sessionReady ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-surface-800" />
          ) : user ? (
            <div className="flex items-center gap-2">
              {user.role === "admin" && (
                <Link
                  to="/admin/assignments/new"
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${isActive("/admin/assignments/new") ? "bg-surface-800 text-white" : "text-amber-400 hover:text-amber-300"}`}
                >
                  Admin
                </Link>
              )}
              <span className="hidden sm:block text-sm text-surface-400">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate("/signup")}>
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
