import { sanitizeComment } from "@/lib/sanitize";

describe("sanitizeComment", () => {
  it("удаляет <script>", () => {
    expect(sanitizeComment("<script>alert('XSS PoC')</script>")).toBe("");
  });

  it("удаляет обработчики событий", () => {
    expect(sanitizeComment(`<img src=x onerror="alert(document.cookie)">`)).toBe("");
    expect(sanitizeComment(`<b onclick="steal()">жирный</b>`)).toBe("<b>жирный</b>");
  });

  it("убирает javascript: из ссылок", () => {
    expect(sanitizeComment(`<a href="javascript:alert(1)">клик</a>`)).toBe(
      `<a rel="noopener noreferrer nofollow">клик</a>`,
    );
  });

  it("оставляет разрешённое форматирование", () => {
    expect(sanitizeComment(`<b>жирный</b> <i>курсив</i> <a href="https://example.com" target="_top">ссылка</a>`)).toBe(`<b>жирный</b> <i>курсив</i> <a href="https://example.com" rel="noopener noreferrer nofollow">ссылка</a>`);
  });

  it("не пропускает пустые и нестроковые значения", () => {
    expect(sanitizeComment(undefined)).toBe("");
    expect(sanitizeComment(null)).toBe("");
  });
});
