"use client";
import { useEffect } from "react";
import { readSetting } from "./settings";
export function Preferences() {
  useEffect(() => {
    const apply = () => {
      document.documentElement.dataset.reduced = String(
        readSetting("reduce") === "1",
      );
    };
    apply();
    addEventListener("storage", apply);
    addEventListener("portfolio-preferences", apply);
    return () => {
      removeEventListener("storage", apply);
      removeEventListener("portfolio-preferences", apply);
    };
  }, []);
  return null;
}
