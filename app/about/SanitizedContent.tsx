"use client";

import React from "react";
import DOMPurify from "dompurify";

interface SanitizedContentProps {
  content: string;
  className?: string;
}

const cleanHTML = (text: string) => {
  while (text.includes("\n")) text = text.replace("\n", "<br/>");
  return DOMPurify.sanitize(text);
};

export default function SanitizedContent({
  content,
  className,
}: SanitizedContentProps) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: cleanHTML(content),
      }}
      className={className}
    />
  );
}
