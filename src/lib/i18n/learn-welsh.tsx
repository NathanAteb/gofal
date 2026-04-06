"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface LearnWelshContextType {
  enabled: boolean;
  toggle: () => void;
}

const LearnWelshContext = createContext<LearnWelshContextType>({
  enabled: false,
  toggle: () => {},
});

const STORAGE_KEY = "learnWelsh";

export function LearnWelshProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "true") {
      setEnabled(true);
    }
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return (
    <LearnWelshContext.Provider value={{ enabled, toggle }}>
      {children}
    </LearnWelshContext.Provider>
  );
}

export function useLearnWelsh() {
  return useContext(LearnWelshContext);
}
