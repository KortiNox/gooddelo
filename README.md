# Душнила v2 — Frontend (Vite + React + TS)

Демо: `https://kortinox.github.io/gooddelo/`

Технологии: Vite, React 18, TypeScript, React Query, SCSS Modules.

## Как запустить

```bash
cd gooddelo
npm install
npm run start
```

Продакшен-сборка и локальный предпросмотр:
```bash
npm run build
npm run preview
```

## Настройки окружения
Создайте файл `.env` рядом с `package.json` (см. `ENV_EXAMPLE.txt`):
```bash
VITE_WAQI_TOKEN=ваш_токен
VITE_WAQI_STATION=A472336
```
Если токен/станция не заданы или WAQI недоступен — автоматически используем Sensor.Community, затем локальный `public/sample.json` как последний фолбэк.

## Источники данных и фолбэки
Порядок:
1) WAQI: `/feed/{station}?token=...`
2) Sensor.Community: `https://data.sensor.community/static/v1/data.json` (ближайший к Самаре сенсор)
3) Локальный `public/sample.json`

Нормализованные поля: `aqi`, `pm25`, `pm10`, `temperature`, `humidity`, `updatedAt`, `source`.
Если `aqi` отсутствует, рассчитываем его из `pm25` по US EPA диапазонам.

## UI и поведение
- Статус по AQI:
  - 0–100 → «Норма» (зелёный)
  - 101–150 → «Повышено» (жёлтый/оранжевый)
  - >150 → «Превышение» (красный)
  - если AQI нет → «Нет данных»
- Вторичный показатель (вторая карточка): приоритет PM2.5 → Температура → PM10 → Влажность. Отображаются значение, единицы (µg/m³, °C, %, …) и «обновлено N мин назад».
- Состояния: `loading` и `error` (понятное сообщение + кнопка «Повторить»).
- Адаптив: мобилка и десктоп.

## Глобальное состояние и автообновление
- Используется React Query: кеш, `isLoading/isError/isFetching`, рефетч и др.
- Автообновление данных раз в минуту + кнопка «Обновить».

## Тесты
- Юнит‑тесты на функции `pm25ToAqi` и `aqiToStatus` (Vitest):
```bash
npm run test
```

## Деплой (GitHub Pages)
- В `vite.config.ts` задано `base: '/gooddelo/'`.
- Команда деплоя публикует `dist` в ветку `gh-pages`:
```bash
npm run deploy
```
- В репозитории GitHub включите Pages → ветка `gh-pages`.
- Демо: `https://kortinox.github.io/gooddelo/`.

## Выполненные уровни
- A (обязательный):
  - Верстка по макету, адаптив (мобилка/десктоп)
  - Загрузка данных: WAQI → Sensor.Community → `sample.json`
  - Статусы качества воздуха по AQI; «Нет данных», если AQI отсутствует
  - Вторичный показатель с приоритетом и «обновлено N мин назад»
  - Состояния `loading` и `error` + «Повторить»
- B (выбранные 2 пункта):
  - Автообновление каждые 60 сек + кнопка «Обновить»
  - Глобальное состояние (React Query)
- Дополнительно по B:
  - .env‑настройки (токен/станция) и README
  - Юнит‑тесты (Vitest)
- C (опционально):
  - Деплой на GitHub Pages
