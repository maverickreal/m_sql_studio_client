import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import type { Assignment } from "../../types";
import { Button } from "../../components/ui/Button";
import {
  useExecuteSqlMutation,
  useGetJobStatusQuery,
} from "../../store/api";
import {
  executionStarted,
  executionCompleted,
  executionFailed,
  resetExecution,
} from "./executionSlice";
import type { RootState, AppDispatch } from "../../store";

interface SqlEditorProps {
  assignment: Assignment;
}

export function SqlEditor({ assignment }: SqlEditorProps) {
  const dispatch = useDispatch<AppDispatch>();
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const { phase, taskId } = useSelector(
    (state: RootState) => state.execution,
  );

  const [executeSql, { isLoading: isExecuting }] = useExecuteSqlMutation();

  const { data: jobStatus } = useGetJobStatusQuery(taskId!, {
    skip: !taskId || phase !== "polling",
    pollingInterval: 1000,
  });

  useEffect(() => {
    if (jobStatus && phase === "polling") {
      if (jobStatus.status === "completed" && jobStatus.result) {
        dispatch(executionCompleted(jobStatus.result));
      } else if (jobStatus.status === "failed") {
        dispatch(
          executionFailed(
            jobStatus.result && "error" in jobStatus.result
              ? jobStatus.result.error
              : "SQL execution failed",
          ),
        );
      }
    }
  }, [jobStatus, phase, dispatch]);

  useEffect(() => {
    if (!editorRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        // state is read via getValue when running
      }
    });

    const view = new EditorView({
      doc: "SELECT * FROM users LIMIT 5;",
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        sql({ dialect: PostgreSQL }),
        oneDark,
        updateListener,
        EditorView.theme({
          "&": {
            fontSize: "14px",
            borderRadius: "0.5rem",
          },
          ".cm-scroller": {
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          },
        }),
      ],
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  const handleRun = useCallback(async () => {
    if (!viewRef.current) return;

    const userSql = viewRef.current.state.doc.toString().trim();
    if (!userSql) return;

    dispatch(resetExecution());

    try {
      const result = await executeSql({
        assignmentId: assignment._id,
        userSql,
        mode: assignment.mode,
      }).unwrap();

      dispatch(executionStarted(result.taskId));
    } catch (err) {
      const message =
        err && typeof err === "object" && "data" in err
          ? String(
              (err as { data: unknown }).data ||
                "Failed to execute SQL",
            )
          : "Failed to execute SQL";
      dispatch(executionFailed(message));
    }
  }, [assignment, executeSql, dispatch]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-surface-800 overflow-hidden">
        <div className="flex items-center justify-between border-b border-surface-800 bg-surface-900 px-4 py-2">
          <span className="text-xs font-medium text-surface-400">
            SQL Editor
          </span>
          <span className="text-xs text-surface-600">
            PostgreSQL · {assignment.mode === "read" ? "Read only" : "Read/Write"}
          </span>
        </div>
        <div ref={editorRef} className="cm-editor-container" />
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleRun}
          loading={isExecuting || phase === "polling"}
          disabled={isExecuting || phase === "polling"}
          size="sm"
        >
          {phase === "polling" ? "Running..." : "Run Query"}
        </Button>

        {phase !== "idle" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(resetExecution())}
            disabled={phase === "polling"}
          >
            Clear Results
          </Button>
        )}
      </div>
    </div>
  );
}
