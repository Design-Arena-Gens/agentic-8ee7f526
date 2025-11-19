"use client";

import "./globals.css";
import { ReactNode, useEffect } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
