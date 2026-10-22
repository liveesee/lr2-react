# ЛР9. FOLIA — Unit- и E2E-тесты

Вариант 4, блоговая платформа. Основа — Next.js-приложение из лабораторной работы №7. Комментарии к статьям загружаются и отправляются через API из лабораторной работы №8 (ветка `lab9` репозитория `lr8`, эндпоинт `/api/comments`).

## Запуск приложения

```bash
npm install
npm run dev
```

Приложение открывается на http://localhost:3000. Запросы `/api/*` Next.js проксирует на API (`rewrites` в `next.config.mjs`), по умолчанию на http://localhost:4000. Другой адрес задаётся переменной `API_URL` при сборке или запуске.

## Unit-тесты (Jest)

```bash
npm test
```

Jest настроен через `next/jest` (`jest.config.js`), компоненты тестируются с React Testing Library. Тесты лежат в `__tests__/`:

- `formatTimeAgo.test.js` — функция `lib/formatTimeAgo.js` форматирует дату публикации комментария («только что», «5 минут назад», «2 часа назад», «3 дня назад»), некорректная дата даёт пустую строку.
- `LikeButton.test.jsx` — при клике счётчик лайков увеличивается на 1.
- `CommentInput.test.jsx` — модуль `lib/api.js` замокан через `jest.mock()`. Проверяются загрузка комментариев, отправка нового комментария и запрет пустой отправки.

## E2E-тест (Playwright)

Перед первым запуском установите браузер:

```bash
npx playwright install chromium
```

Запуск:

```bash
npm run test:e2e
```

Интерфейс Test Runner:

```bash
npx playwright test --ui
```

Playwright сам собирает и запускает приложение на порту 3100 (`webServer` в `playwright.config.js`). API и MongoDB для теста не нужны: запросы к `/api/comments` перехватываются и мокаются через `page.route()`.

Сценарий «Комментирование статьи» (`e2e/comment.spec.js`):

1. Пользователь открывает главную страницу и переходит на статью «Оливковые чернила».
2. Тест проверяет адрес `/posts/olive-ink`, заголовок статьи и пустой список комментариев.
3. Пользователь вводит текст в поле комментария и нажимает «Отправить».
4. Тест проверяет, что комментарий появился в списке под статьёй, поле очистилось, а в перехваченном `POST` ушли правильные данные.

## Страницы

| Маршрут | Файл | Рендеринг |
| --- | --- | --- |
| `/` | `pages/index.js` | SSR, `getServerSideProps` |
| `/posts/[slug]` | `pages/posts/[slug].js` | SSG, `getStaticPaths` и `getStaticProps` |

## Структура

- `pages/` — маршруты, `_app.js` и `_document.js`.
- `components/` — `ArticleCard`, `LikeButton`, `CommentInput`, `SiteHeader`.
- `lib/api.js` — запросы к API комментариев.
- `lib/formatTimeAgo.js` — форматирование даты публикации.
- `data/articles.js` — mock-данные статей.
- `__tests__/` — unit-тесты, `e2e/` — E2E-тест.
