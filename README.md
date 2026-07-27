# QA Набір інструментів

Набір веб-інструментів для тест-дизайну та QA. Кожен інструмент
працює повністю в браузері — без бекенду, без збереження даних на сервері.
Проєкт публікується на GitHub Pages.

## Технології

React + TypeScript + Vite, роутинг через `react-router-dom` (`HashRouter`,
щоб уникнути проблем із маршрутизацією на GitHub Pages).

## Розробка

```bash
npm install
npm run dev      # локальний сервер розробки
npm run build    # продакшн-білд у dist/
npm run lint     # oxlint
```

## Структура

- `src/tools/registry.ts` — реєстр усіх інструментів (назва, опис, статус,
  компонент). Щоб додати новий інструмент, достатньо створити компонент у
  `src/tools/<slug>/` і додати запис у реєстр.
- `src/pages/` — головна сторінка (список інструментів) і сторінка-обгортка
  для окремого інструмента.
- `src/layout/` — спільний шапка/футер сайту.

## Інструменти

| Інструмент | Статус |
| --- | --- |
| Charter Builder — чартер для сесії дослідницького тестування | ✅ доступний |
| Boundary Value & Equivalence Partitioning calculator | заплановано |
| Pairwise Generator | заплановано |
| Decision Table Generator | заплановано |
| State Transition Tool | заплановано |
| Test Data Generator (JSON Schema) | заплановано |

## Ліцензія

[MIT](LICENSE)
