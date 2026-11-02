import DOMPurify from "dompurify"

const COMMENT_HTML = {
  ALLOWED_TAGS: ["b", "strong", "i", "em", "a", "br"],
  ALLOWED_ATTR: ["href"],
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i,
}

if (DOMPurify.isSupported) {
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") node.setAttribute("rel", "noopener noreferrer nofollow")
  })
}

export function sanitizeComment(html) {
  // DOMPurify needs a DOM; without one it would return the input unchanged
  if (!DOMPurify.isSupported) return ""
  return DOMPurify.sanitize(String(html ?? ""), COMMENT_HTML)
}
