import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string | null;
  image: string | null;
}

interface AuthState {
  user: AuthUser | null;
  sessionReady: boolean;
}

const initialState: AuthState = {
  user: null,
  sessionReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
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
