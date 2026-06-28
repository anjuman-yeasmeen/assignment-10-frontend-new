"use client";

import { useEffect } from "react";

// Dynamic page title for client-rendered pages (dashboard etc.).
export function useTitle(title) {
  useEffect(() => {
    document.title = `${title} | MediCare Connect`;
  }, [title]);
}
