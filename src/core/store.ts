import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { authService } from "../services/auth-service";
import authReducer from "./authSlice";
import { loanService } from "@/services/loan-service";
import { imageService } from "@/services/image-service";
import { reportService } from "@/services/report-service";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authService.reducerPath]: authService.reducer,
    [loanService.reducerPath]: loanService.reducer,
    [imageService.reducerPath]: imageService.reducer,
    [reportService.reducerPath]: reportService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // blogService.middleware,

      authService.middleware,
      loanService.middleware,
      imageService.middleware,
      reportService.middleware,
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
