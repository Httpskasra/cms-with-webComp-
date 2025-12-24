"use client";

import { useMemo } from "react";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeUrl(url: string) {
  if (/^(https?:\/\/|\/|#)/i.test(url)) {
    return url;
  }
  return "";
}

function inlineMarkdown(text: string) {
  let escaped = escapeHtml(text);

  escaped = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  escaped = escaped.replace(/\*(.+?)\*/g, "<em>$1</em>");
  escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
  escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
    const cleanHref = safeUrl(String(href).trim());
    if (!cleanHref) return escapeHtml(label);
    return `<a href="${cleanHref}" rel="noopener noreferrer" target="_blank">${escapeHtml(label)}</a>`;
  });

  return escaped;
}

function renderMarkdown(md: string) {
  const lines = md.split(/\r?\n/);
  let html = "";
  let inList = false;

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      return;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = inlineMarkdown(headingMatch[2]);
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h${level}>${content}</h${level}>`;
      return;
    }

    if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      const item = inlineMarkdown(line.replace(/^[-*]\s+/, ""));
      html += `<li>${item}</li>`;
      return;
    }

    if (inList) {
      html += "</ul>";
      inList = false;
    }
    html += `<p>${inlineMarkdown(line)}</p>`;
  });

  if (inList) {
    html += "</ul>";
  }

  return html;
}

export default function DocsTab({ content }: { content: string }) {
  const safeHtml = useMemo(() => renderMarkdown(content), [content]);

  return (
    <div
      style={{ background: "#f9fafb", padding: 12, borderRadius: 6 }}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
