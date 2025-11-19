"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const SOURCE_TEXT = "I ate the food quickly.";

export default function Home() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportSpeech = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    []
  );

  const cancelSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(() => {
    if (!supportSpeech) {
      setError("Speech synthesis is not supported in this browser.");
      return;
    }

    cancelSpeech();
    setError(null);

    const utterance = new SpeechSynthesisUtterance(SOURCE_TEXT);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError("Failed to speak the sentence.");
    };

    window.speechSynthesis.speak(utterance);
  }, [cancelSpeech, supportSpeech]);

  useEffect(() => {
    if (supportSpeech) {
      const timer = setTimeout(speak, 300);
      return () => {
        clearTimeout(timer);
        cancelSpeech();
      };
    }

    setError("Speech synthesis is not supported in this browser.");
    return undefined;
  }, [cancelSpeech, speak, supportSpeech]);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        padding: "2rem",
        borderRadius: "1.5rem",
        background: "rgba(15, 23, 42, 0.8)",
        boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.8)",
        maxWidth: "420px",
        width: "100%",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.8rem", textAlign: "center" }}>
        Natural Speech Preview
      </h1>
      <p
        style={{
          margin: 0,
          fontSize: "1.1rem",
          lineHeight: 1.6,
          textAlign: "center",
        }}
      >
        {SOURCE_TEXT}
      </p>
      <button
        onClick={speak}
        style={{
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.9), rgba(147,51,234,0.9))",
          color: "#f8fafc",
          border: "none",
          borderRadius: "9999px",
          padding: "0.85rem 2.5rem",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          boxShadow: isSpeaking
            ? "0 12px 30px -10px rgba(59,130,246,0.9)"
            : "0 10px 25px -12px rgba(59,130,246,0.5)",
          transform: isSpeaking ? "scale(1.03)" : "scale(1)",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = isSpeaking
            ? "scale(1.03)"
            : "scale(1)";
        }}
      >
        {isSpeaking ? "Speaking…" : "Play Again"}
      </button>
      {error && (
        <span style={{ color: "#fca5a5", fontSize: "0.95rem" }}>{error}</span>
      )}
    </main>
  );
}
