FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8010

CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && DJANGO_SETTINGS_MODULE=bering_admin.settings python init_admin.py && gunicorn bering_admin.wsgi:application --bind 0.0.0.0:8010 --workers 2 --threads 4 --timeout 60"]
