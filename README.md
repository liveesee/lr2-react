# ЛР6. FOLIA — React и MUI

Вариант 4, блоговая платформа. Основа — лабораторная работа №2. Интерфейс переведён на MUI Core (Material UI).

## Запуск

```bash
npm install
npm run dev
```

## UI-библиотека

Установлены `@mui/material`, `@emotion/react` и `@emotion/styled`. Тема FOLIA задаётся в `src/theme.js`. В `src/main.jsx` приложение обёрнуто в `ThemeProvider` и `CssBaseline`.

Отступы и выравнивание задаются системными свойствами MUI (`sx`, `Stack`, `spacing`). Собственных CSS-файлов нет.

## Макет

Главная страница — `Container` и `Grid`. Карточки статей занимают `size={{ xs: 12, sm: 6, lg: 4 }}`:

- от 1200 px — 3 колонки;
- от 600 px — 2 колонки;
- меньше 600 px — 1 колонка.

## Компоненты

- `ArticleCard` — `Card`, `CardMedia`, `CardContent`, `CardActions`. Заголовок, автор, описание, обложка и время чтения приходят через `props`. Типы проверяет PropTypes. Блок комментариев раскрывается через `Collapse`.
- `LikeButton` — `Button`, счётчик в `useState` растёт по клику.
- `CommentInput` — `TextField` и `Button`. Пустая отправка показывает ошибку в `helperText`. Комментарии выводятся через `List`.
