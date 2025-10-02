import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null, // don't read localStorage here
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
    rehydrateAuth: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        state.token = token;
        state.isAuthenticated = !!token;
      }
    },
  },
});

export const { setCredentials, logout, rehydrateAuth } = authSlice.actions;
export default authSlice.reducer;
