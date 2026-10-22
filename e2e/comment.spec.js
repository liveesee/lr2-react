const { test, expect } = require("@playwright/test");

test("Комментирование статьи", async ({ page }) => {
  const comments = [];
  const posted = [];

  await page.route(
    (url) => url.pathname === "/api/comments",
    async (route) => {
      const request = route.request();
      if (request.method() === "POST") {
        const body = request.postDataJSON();
        posted.push(body);
        const comment = {
          _id: `comment-${posted.length}`,
          article: body.article,
          author: body.author,
          text: body.text,
          createdAt: new Date().toISOString(),
        };
        comments.push(comment);
        await route.fulfill({ status: 201, json: comment });
        return;
      }
      await route.fulfill({ status: 200, json: comments });
    },
  );

  await page.goto("/");
  await page.getByRole("link", { name: "Оливковые чернила" }).click();

  await expect(page).toHaveURL(/\/posts\/olive-ink$/);
  await expect(page.getByRole("heading", { level: 1, name: "Оливковые чернила" })).toBeVisible();
  await expect(page.getByText("Пока нет комментариев")).toBeVisible();

  await page.getByLabel("Текст комментария").fill("Очень спокойный и точный текст");
  await page.getByRole("button", { name: "Отправить" }).click();

  const list = page.getByRole("list", { name: "Комментарии" });
  await expect(list.getByText("Очень спокойный и точный текст")).toBeVisible();
  await expect(list.getByRole("listitem")).toHaveCount(1);
  await expect(list.getByRole("listitem")).toContainText("Вы · только что");
  await expect(page.getByLabel("Текст комментария")).toHaveValue("");
  await expect(page.getByText("Пока нет комментариев")).toBeHidden();

  expect(posted).toEqual([
    { article: "olive-ink", author: "Вы", text: "Очень спокойный и точный текст" },
  ]);
});
