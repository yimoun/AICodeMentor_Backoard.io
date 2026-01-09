import React from "react";
import type { Message } from "../../../hooks";

export const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === "user";
  return (
    <div
      className={`max-w-xl p-4 rounded-2xl ${
        isUser ? "bg-primary-600 text-white self-end" : "bg-dark-800 text-dark-50 self-start"
      }`}
    >
      <p>{message.content}</p>
    </div>
  );
}