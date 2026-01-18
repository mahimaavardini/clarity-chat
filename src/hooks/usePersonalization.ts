import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "context-clue-user-name";

export function usePersonalization() {
  const [userName, setUserName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(STORAGE_KEY) || "";
    }
    return "";
  });

  useEffect(() => {
    if (userName) {
      sessionStorage.setItem(STORAGE_KEY, userName);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [userName]);

  const updateName = useCallback((name: string) => {
    setUserName(name.trim());
  }, []);

  const clearName = useCallback(() => {
    setUserName("");
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const getGreeting = useCallback(() => {
    if (!userName) return null;
    const hour = new Date().getHours();
    let timeGreeting = "Hello";
    if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 17) timeGreeting = "Good afternoon";
    else timeGreeting = "Good evening";
    return `${timeGreeting}, ${userName}!`;
  }, [userName]);

  return {
    userName,
    updateName,
    clearName,
    getGreeting,
    hasName: !!userName,
  };
}
