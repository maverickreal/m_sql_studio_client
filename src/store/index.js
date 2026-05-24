import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import authReducer from "../features/auth/authSlice";
import executionReducer from "../features/sql-editor/executionSlice";
export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        execution: executionReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});
