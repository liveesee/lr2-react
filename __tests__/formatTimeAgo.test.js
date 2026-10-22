import { formatTimeAgo } from "@/lib/formatTimeAgo";

const now = new Date("2026-10-20T12:00:00Z");

function ago(seconds) {
  return new Date(now.getTime() - seconds * 1000);
}

describe("formatTimeAgo", () => {
  it("возвращает «только что» для публикации меньше минуты назад", () => {
    expect(formatTimeAgo(ago(30), now)).toBe("только что");
  });

  it("форматирует минуты", () => {
    expect(formatTimeAgo(ago(5 * 60), now)).toBe("5 минут назад");
  });

  it("форматирует часы: «2 часа назад»", () => {
    expect(formatTimeAgo(ago(2 * 60 * 60), now)).toBe("2 часа назад");
  });

  it("форматирует дни", () => {
    expect(formatTimeAgo(ago(3 * 24 * 60 * 60), now)).toBe("3 дня назад");
  });

  it("принимает дату строкой ISO, как её отдаёт API", () => {
    expect(formatTimeAgo(ago(60 * 60).toISOString(), now)).toBe("1 час назад");
  });

  it("возвращает пустую строку для некорректной даты", () => {
    expect(formatTimeAgo("не дата", now)).toBe("");
  });
});
