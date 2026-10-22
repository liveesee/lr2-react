# ЛР7. FOLIA — Next.js (SSR и SSG)

Вариант 4, блоговая платформа. Приложение из лабораторной работы №2 перенесено на Next.js с Pages Router.

## Запуск

```bash
npm install
npm run dev
```

Production-сборка и запуск:

```bash
npm run build
npm run start
```

Приложение открывается на http://localhost:3000.

## Страницы

| Маршрут | Файл | Рендеринг |
| --- | --- | --- |
| `/` | `pages/index.js` | SSR, `getServerSideProps` |
| `/posts/[slug]` | `pages/posts/[slug].js` | SSG, `getStaticPaths` и `getStaticProps` |

Главная страница рендерится на сервере при каждом запросе. `getServerSideProps` возвращает список статей и время запроса, поэтому время на странице меняется после каждого обновления.

Страницы статей генерируются при сборке. `getStaticPaths` перечисляет все `slug` из `data/articles.js` (`fallback: false`), `getStaticProps` передаёт данные статьи и время сборки.

Переходы между страницами — через `next/link`.

## Структура

- `pages/` — маршруты, `_app.js` и `_document.js`.
- `components/` — компоненты из ЛР2: `ArticleCard`, `LikeButton`, `CommentInput`, а также `SiteHeader`.
- `data/articles.js` — mock-данные статей.
- `styles/` — глобальные стили и CSS-модуль страницы статьи.
