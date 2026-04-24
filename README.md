# Bering Expedition Site

Интерактивный образовательный сайт «Экспедиции Витуса Беринга: маршрут,
открытия, наследие».

## Stack

- `apps/web`: Next.js 16, TypeScript, Tailwind CSS
- `apps/backend`: FastAPI, SQLAlchemy 2, Pydantic Settings
- `postgres`: PostgreSQL + PostGIS
- `minio`: S3-compatible media storage
- `docker-compose.yml`: local development environment

## Quick start

1. Copy `.env.example` to `.env` if you want to customize environment values.
2. Start services:

```bash
docker compose up --build
```

3. Open:

- web: `http://localhost:3000`
- API health: `http://localhost:8000/api/health/`
- API docs: `http://localhost:8000/docs`

## Что реализовано по ТЗ

- Главная страница с назначением проекта, командой и быстрым входом в карту.
- Интерактивная карта: маршруты двух экспедиций, события, поиск, фильтры,
  таймлайн, play/pause, слои и карточка события с цитатой и источниками.
- Страницы экспедиций: описание, цель, этапы, карта-врезка, события и итоги.
- Раздел открытий и результатов: география, картография, наука, освоение.
- Каталог источников: поиск, фильтрация по типу, метаданные и привязка к событиям.
- Страница CMS: роли, CRUD-сущности и правила валидации обязательных полей.
- Backend API: health, экспедиции, события, источники, агрегированные map-data.
- Документация: API, контентная модель, архитектура и правила добавления материалов.

## Local frontend

```bash
pnpm install
pnpm dev:web
```

## Local backend

```bash
cd apps/backend
pip install -e ".[dev]"
uvicorn app.main:app --reload
```
