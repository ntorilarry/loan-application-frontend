"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface GlobalState {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <GlobalStateContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
