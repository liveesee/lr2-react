const { test, expect } = require("@playwright/test");
const { default: AxeBuilder } = require("@axe-core/playwright");

const items = Array.from({ length: 10 }, (_, index) => ({
  id: `m${index + 1}`,
  title: `Фильм ${index + 1}`,
  year: 2000 + index,
  rating: Number((9.5 - index * 0.2).toFixed(2)),
  votes: 100 + index,
  genres: ["драма"],
}));

test.beforeEach(async ({ page }) => {
  await page.route(
    (url) => url.pathname === "/api/analytics/top-movies",
    (route) =>
      route.fulfill({
        json: { metric: "Средняя оценка", limit: 10, minVotes: 20, totalMovies: 18, totalRatings: 3354, items },
      }),
  );
});

test("Статистика: интерактивный график топ-10 с подсказками", async ({ page }) => {
  const problems = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.text().includes("Content Security Policy")) problems.push(message.text());
  });

  await page.goto("/");
  await page.getByRole("navigation", { name: "Разделы сайта" }).getByRole("link", { name: "Статистика" }).click();
  await expect(page).toHaveURL(/\/stats$/);
  await expect(page.getByRole("heading", { level: 1, name: "Статистика" })).toBeVisible();

  const chart = page.locator(".js-plotly-plot");
  const bars = chart.locator(".bars .point");
  await expect(bars).toHaveCount(10);
  await expect(chart.locator(".gtitle")).toHaveText("Топ-10 фильмов по средней оценке пользователей");
  await expect(chart.locator(".xtitle")).toHaveText("Средняя оценка (шкала 1–10)");
  await expect(chart.locator(".ytitle")).toHaveText("Фильм (год выпуска)");

  const firstBox = await bars.first().boundingBox();
  const lastBox = await bars.last().boundingBox();
  expect(firstBox.y).toBeLessThan(lastBox.y);
  expect(firstBox.width).toBeGreaterThan(lastBox.width);

  await page.mouse.move(firstBox.x + firstBox.width * 0.5, firstBox.y + firstBox.height / 2);
  const tooltip = page.locator(".hoverlayer .hovertext");
  await expect(tooltip).toContainText("Фильм 1");
  await expect(tooltip).toContainText("Средняя оценка: 9.50 из 10");
  await expect(tooltip).toContainText("Оценок: 100");

  expect(problems).toEqual([]);
});

test("Статистика: доступность страницы и таблица с данными", async ({ page }) => {
  await page.goto("/stats");
  await expect(page.locator(".js-plotly-plot .bars .point")).toHaveCount(10);
  await expect(page.getByRole("img", { name: /Первое место — Фильм 1 \(2000\), 9.5 из 10/ })).toBeVisible();

  await page.getByText("Данные графика таблицей").click();
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(11);

  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
    .analyze();
  expect(violations.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
});
