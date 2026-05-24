import { Link } from "react-router";
import { motion } from "motion/react";
import { Button } from "../../components/ui/Button";
import { APP_NAME, APP_DESCRIPTION } from "../../utils/constants";

export function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-700 bg-brand-950/50 px-4 py-1.5 text-sm text-brand-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            Interactive SQL Learning
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Master SQL with
            <span className="block bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-400">
            {APP_DESCRIPTION}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link to="/assignments">
            <Button size="lg">Browse Assignments</Button>
          </Link>
          <Link to="/signup">
            <Button variant="secondary" size="lg">
              Create Free Account
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-20 grid gap-8 sm:grid-cols-3"
        >
          {[
            {
              title: "Write SQL",
              description:
                "Use the built-in CodeMirror editor with syntax highlighting and auto-completion.",
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              ),
            },
            {
              title: "Execute Instantly",
              description:
                "Run queries against real PostgreSQL databases. Get results in milliseconds.",
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              ),
            },
            {
              title: "Track Progress",
              description:
                "Solve assignments at your own pace. From easy SELECTs to complex JOINs.",
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              ),
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-surface-800 bg-surface-900/50 p-6 text-left"
            >
              <div className="mb-4 inline-flex rounded-lg bg-brand-500/10 p-2 text-brand-400">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-surface-400">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
