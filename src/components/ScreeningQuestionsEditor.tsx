"use client";

import { useState } from "react";

interface ScreeningQuestionsEditorProps {
  questions: string[];
  onChange: (questions: string[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
}

export default function ScreeningQuestionsEditor({
  questions,
  onChange,
  theme,
}: ScreeningQuestionsEditorProps) {
  const [newQuestion, setNewQuestion] = useState("");

  const handleAdd = () => {
    const trimmed = newQuestion.trim();
    if (!trimmed) return;
    onChange([...questions, trimmed]);
    setNewQuestion("");
  };

  const handleRemove = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      {questions.length > 0 ? (
        <div className="space-y-2">
          {questions.map((q, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg border"
              style={{ borderColor: theme.cardBorder }}
            >
              <span
                className="text-xs font-medium mt-0.5 flex-shrink-0"
                style={{ color: theme.textFaint }}
              >
                {i + 1}.
              </span>
              <p className="text-sm flex-1" style={{ color: theme.text }}>
                {q}
              </p>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="text-xs opacity-40 hover:opacity-100 transition-opacity flex-shrink-0"
                style={{ color: theme.textMuted }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm" style={{ color: theme.textFaint }}>
          No questions yet. Mentees will only need to pick a time slot.
        </p>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
          style={{
            borderColor: theme.cardBorder,
            color: theme.text,
            backgroundColor: "transparent",
          }}
          placeholder="Type a question and press Enter"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            backgroundColor: theme.text,
            color: theme.bg,
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
