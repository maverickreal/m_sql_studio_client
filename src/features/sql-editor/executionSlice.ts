import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SqlExecutionResult } from "../../types";

export type ExecutionPhase = "idle" | "running" | "polling" | "done" | "error";

interface ExecutionState {
  phase: ExecutionPhase;
  taskId: string | null;
  result: SqlExecutionResult | null;
  error: string | null;
}

const initialState: ExecutionState = {
  phase: "idle",
  taskId: null,
  result: null,
  error: null,
};

const executionSlice = createSlice({
  name: "execution",
  initialState,
  reducers: {
    executionStarted(state, action: PayloadAction<string>) {
      state.phase = "polling";
      state.taskId = action.payload;
      state.result = null;
      state.error = null;
    },
    executionCompleted(state, action: PayloadAction<SqlExecutionResult>) {
      state.phase = "done";
      state.result = action.payload;
    },
    executionFailed(state, action: PayloadAction<string>) {
      state.phase = "error";
      state.error = action.payload;
    },
    resetExecution(state) {
      state.phase = "idle";
      state.taskId = null;
      state.result = null;
      state.error = null;
    },
  },
});

export const {
  executionStarted,
  executionCompleted,
  executionFailed,
  resetExecution,
} = executionSlice.actions;
export default executionSlice.reducer;
