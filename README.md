# Душнила v2 — Frontend (Vite + React + TS)

## Запуск

```bash
cd gooddelo
npm install
npm run start
```

Продакшен-сборка:
```bash
npm run build
npm run preview
```

## Настройки окружения
Создайте файл `.env` рядом с `package.json`:
```bash
VITE_WAQI_TOKEN=ваш_токен
VITE_WAQI_STATION=A472336
```

## Данные и фолбэки
- Сначала пытаемся получить WAQI (`/feed/{station}`); если не удалось — переключаемся на Sensor.Community; затем оффлайн `public/sample.json`.
- Нормализованные поля: `aqi`, `pm25`, `pm10`, `temperature`, `humidity`, `updatedAt`, `source`.
- Если нет `aqi`, вычисляем его из `pm25` (US EPA) и показываем статус.

## UI
- Статус по AQI: good (зелёный), moderate (жёлтый), unhealthy (красный), nodata.
- Вторая карточка: приоритет PM2.5 → Температура → PM10 → Влажность + "обновлено N мин назад".
- Состояния: loading, error с кнопкой "Повторить".
- Кнопка "Обновить" + автообновление раз в минуту.

## Уровни
- A: верстка + данные + статусы — выполнено.
- B: автообновление, глобальное состояние (React Query), .env/README — выполнено частично.
- C:  деплой 
