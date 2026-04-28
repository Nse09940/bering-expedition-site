import os

import django
from django.contrib.auth import get_user_model


def run() -> None:
    django.setup()

    username = os.getenv("DJANGO_SUPERUSER_USERNAME", "").strip()
    password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "").strip()
    email = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com").strip()

    if not username or not password:
        print("Skipping superuser creation: missing DJANGO_SUPERUSER_USERNAME or DJANGO_SUPERUSER_PASSWORD")
        return

    User = get_user_model()
    if User.objects.filter(username=username).exists():
        print(f"Superuser '{username}' already exists")
        return

    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Superuser '{username}' created")


if __name__ == "__main__":
    run()
