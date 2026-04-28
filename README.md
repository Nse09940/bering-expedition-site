# Экспедиции Беринга

Короткий учебный проект про маршруты и события Первой и Второй Камчатских экспедиций: интерактивная карта, карточки событий и каталог источников.

## Где что смотреть

- Веб-приложение: `apps/web`
- Backend API: `apps/backend`
- Документация: `docs` и `apps/docs`
- Запуск через Docker: `docker-compose.yml`
- Данные карты и событий: `apps/web/src/data/bering.ts`

## Прод-ссылки

- Сайт: [https://history.dymnikov.tech](https://history.dymnikov.tech)
- Админка: [https://history.dymnikov.tech/admin](https://history.dymnikov.tech/admin)
- Документация API: [https://history.dymnikov.tech/docs](https://history.dymnikov.tech/docs)

## Быстрый старт

```bash
docker compose up --build
```

- Web: `http://localhost:3000`
- API: `http://localhost:8000/api/health`
- API docs: `http://localhost:8000/docs`
