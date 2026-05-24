import { APP_NAME } from "../utils/constants";

export function Footer() {
  return (
    <footer className="border-t border-surface-800 mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <p className="text-sm text-surface-500 text-center">
          &copy; {new Date().getFullYear()} {APP_NAME}. Built for learning SQL.
        </p>
      </div>
    </footer>
  );
}
