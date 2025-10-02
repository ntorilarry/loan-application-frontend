"use client";

import { Provider } from "react-redux";
import { store } from "@/core/store";
import { AuthProvider } from "@/utils/authContext";
import { DarkModeProvider } from "@/utils/useDarkMode";
import { GlobalStateProvider } from "@/utils/globalStateContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <GlobalStateProvider>
        <DarkModeProvider>
          <AuthProvider>
            <Toaster />
            {children}
          </AuthProvider>
        </DarkModeProvider>
      </GlobalStateProvider>
    </Provider>
  );
}
