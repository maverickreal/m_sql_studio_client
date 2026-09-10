import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
	executionCompleted,
	executionFailed,
} from "../features/sql-editor/executionSlice";
import type { AppDispatch } from "../store";
import { useGetJobStatusQuery } from "../store/api";
import { apiUrl } from "../config/apiBase";
import type { SqlExecutionResult } from "../types";
import { getErrorMessage } from "../utils/errors";

function terminalPayloadToAction(payload: {
	status: string;
	result?: SqlExecutionResult;
}) {
	if (payload.status === "completed" && payload.result) {
		return executionCompleted(payload.result);
	}
	if (payload.status === "failed") {
		const message =
			payload.result && "error" in payload.result
				? payload.result.error
				: "SQL execution failed";
		return executionFailed(message);
	}
	return null;
}

export function useJobStatusStream(taskId: string | null) {
	const dispatch = useDispatch<AppDispatch>();
	const [fallbackToPolling, setFallbackToPolling] = useState(false);

	// Reset to streaming whenever a new job starts (render-phase adjustment).
	const lastTaskIdRef = useRef(taskId);
	if (lastTaskIdRef.current !== taskId) {
		lastTaskIdRef.current = taskId;
		setFallbackToPolling(false);
	}

	const { data: jobStatus, error: pollingError } = useGetJobStatusQuery(
		taskId ?? "",
		{
			skip: !taskId || !fallbackToPolling,
			pollingInterval: 1000,
		},
	);

	useEffect(() => {
		if (!taskId || fallbackToPolling) return;

		if (typeof window === "undefined" || !("EventSource" in window)) {
			setFallbackToPolling(true);
			return;
		}

		const source = new EventSource(
			apiUrl(
				`/api/v1/assignments/client-sql-code-run/status/${taskId}/stream`,
			),
			{ withCredentials: true },
		);

		const onStatus = (event: MessageEvent) => {
			let payload: { status: string; result?: SqlExecutionResult };
			try {
				payload = JSON.parse(event.data);
			} catch {
				return;
			}
			const action = terminalPayloadToAction(payload);
			if (action) {
				dispatch(action);
				source.close();
			}
		};

		const onError = () => {
			source.close();
			setFallbackToPolling(true);
		};

		source.addEventListener("job-status", onStatus as EventListener);
		source.onerror = onError;

		return () => {
			source.close();
		};
	}, [taskId, fallbackToPolling, dispatch]);

	useEffect(() => {
		if (!fallbackToPolling || !jobStatus) return;
		const action = terminalPayloadToAction({
			status: jobStatus.status,
			result: jobStatus.result,
		});
		if (action) dispatch(action);
	}, [jobStatus, fallbackToPolling, dispatch]);

	useEffect(() => {
		if (fallbackToPolling && pollingError) {
			dispatch(
				executionFailed(
					getErrorMessage(pollingError, "Failed to check execution status"),
				),
			);
		}
	}, [pollingError, fallbackToPolling, dispatch]);
}
