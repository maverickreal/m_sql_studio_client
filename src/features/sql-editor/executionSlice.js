import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    phase: "idle",
    taskId: null,
    result: null,
    error: null,
};
const executionSlice = createSlice({
    name: "execution",
    initialState,
    reducers: {
        executionStarted(state, action) {
            state.phase = "polling";
            state.taskId = action.payload;
            state.result = null;
            state.error = null;
        },
        executionCompleted(state, action) {
            state.phase = "done";
            state.result = action.payload;
        },
        executionFailed(state, action) {
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
export const { executionStarted, executionCompleted, executionFailed, resetExecution, } = executionSlice.actions;
export default executionSlice.reducer;
