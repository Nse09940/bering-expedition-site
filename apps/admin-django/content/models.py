from django.db import models


class Expedition(models.Model):
    code = models.SlugField(max_length=32, unique=True)
    title = models.CharField(max_length=255)
    period = models.CharField(max_length=64)
    summary = models.TextField()
    goal = models.TextField(blank=True)
    results = models.TextField(blank=True)

    class Meta:
        verbose_name = "Экспедиция"
        verbose_name_plural = "Экспедиции"
        ordering = ["code"]

    def __str__(self) -> str:
        return self.title


class Stage(models.Model):
    code = models.SlugField(max_length=64, unique=True)
    expedition = models.ForeignKey(Expedition, on_delete=models.CASCADE, related_name="stages")
    title = models.CharField(max_length=255)
    period = models.CharField(max_length=64)
    summary = models.TextField(blank=True)
    route_geojson = models.JSONField(default=dict, blank=True)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name = "Этап"
        verbose_name_plural = "Этапы"
        ordering = ["expedition__code", "sort_order", "id"]

    def __str__(self) -> str:
        return f"{self.expedition.title}: {self.title}"


class Place(models.Model):
    code = models.SlugField(max_length=64, unique=True)
    name = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=8, decimal_places=5)
    longitude = models.DecimalField(max_digits=8, decimal_places=5)
    accuracy = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = "Место"
        verbose_name_plural = "Места"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Source(models.Model):
    TYPE_CHOICES = [
        ("Журнал", "Журнал"),
        ("Карта", "Карта"),
        ("Донесение", "Донесение"),
        ("Архив", "Архив"),
        ("Исследование", "Исследование"),
    ]

    code = models.SlugField(max_length=64, unique=True)
    author = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=32, choices=TYPE_CHOICES, default="Исследование")
    year = models.CharField(max_length=64)
    origin = models.CharField(max_length=255, blank=True)
    archive_link = models.URLField(max_length=500)
    description = models.TextField()

    class Meta:
        verbose_name = "Источник"
        verbose_name_plural = "Источники"
        ordering = ["author", "title"]

    def __str__(self) -> str:
        return f"{self.author} — {self.title}"


class Media(models.Model):
    MEDIA_CHOICES = [
        ("image", "Изображение"),
        ("map", "Карта"),
        ("scan", "Скан документа"),
    ]

    code = models.SlugField(max_length=64, unique=True)
    title = models.CharField(max_length=255)
    media_type = models.CharField(max_length=16, choices=MEDIA_CHOICES, default="image")
    url = models.URLField(max_length=500)
    source = models.ForeignKey(Source, on_delete=models.SET_NULL, null=True, blank=True, related_name="media")
    caption = models.TextField(blank=True)

    class Meta:
        verbose_name = "Медиа"
        verbose_name_plural = "Медиа"
        ordering = ["title"]

    def __str__(self) -> str:
        return self.title


class Event(models.Model):
    EVENT_TYPE_CHOICES = [
        ("переход", "Переход"),
        ("стоянка", "Стоянка"),
        ("открытие", "Открытие"),
        ("наблюдение", "Наблюдение"),
        ("документ", "Документ"),
        ("шторм", "Шторм"),
    ]

    code = models.SlugField(max_length=64, unique=True)
    expedition = models.ForeignKey(Expedition, on_delete=models.CASCADE, related_name="events")
    stage = models.ForeignKey(Stage, on_delete=models.SET_NULL, null=True, blank=True, related_name="events")
    place = models.ForeignKey(Place, on_delete=models.SET_NULL, null=True, blank=True, related_name="events")
    title = models.CharField(max_length=255)
    date_label = models.CharField(max_length=128)
    year = models.PositiveSmallIntegerField()
    event_type = models.CharField(max_length=32, choices=EVENT_TYPE_CHOICES)
    summary = models.TextField()
    quote = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=8, decimal_places=5, null=True, blank=True)
    longitude = models.DecimalField(max_digits=8, decimal_places=5, null=True, blank=True)
    accuracy = models.CharField(max_length=255, blank=True)
    sources = models.ManyToManyField(Source, related_name="events", blank=True)
    media = models.ManyToManyField(Media, related_name="events", blank=True)

    class Meta:
        verbose_name = "Событие"
        verbose_name_plural = "События"
        ordering = ["year", "id"]

    def __str__(self) -> str:
        return f"{self.date_label} — {self.title}"
