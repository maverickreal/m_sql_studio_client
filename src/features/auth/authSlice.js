import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user: null,
    sessionReady: false,
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            state.sessionReady = true;
        },
        clearSession(state) {
            state.user = null;
            state.sessionReady = true;
        },
    },
});
export const { setUser, clearSession } = authSlice.actions;
export default authSlice.reducer;
