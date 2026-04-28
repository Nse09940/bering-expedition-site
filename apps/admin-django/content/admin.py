from django.contrib import admin

from .models import Event, Expedition, Media, Place, Source, Stage


@admin.register(Expedition)
class ExpeditionAdmin(admin.ModelAdmin):
    list_display = ("title", "period", "code")
    search_fields = ("title", "summary", "goal", "results")
    prepopulated_fields = {"code": ("title",)}


@admin.register(Stage)
class StageAdmin(admin.ModelAdmin):
    list_display = ("title", "expedition", "period", "sort_order", "code")
    list_filter = ("expedition",)
    search_fields = ("title", "summary")
    prepopulated_fields = {"code": ("title",)}


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ("name", "latitude", "longitude", "code")
    search_fields = ("name", "accuracy")
    prepopulated_fields = {"code": ("name",)}


@admin.register(Source)
class SourceAdmin(admin.ModelAdmin):
    list_display = ("author", "title", "type", "year", "code")
    list_filter = ("type", "year")
    search_fields = ("author", "title", "description", "origin")
    prepopulated_fields = {"code": ("title",)}


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ("title", "media_type", "source", "code")
    list_filter = ("media_type",)
    search_fields = ("title", "caption", "url")
    prepopulated_fields = {"code": ("title",)}


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "expedition", "stage", "date_label", "year", "event_type", "code")
    list_filter = ("expedition", "stage", "event_type", "year")
    search_fields = ("title", "summary", "quote", "date_label")
    filter_horizontal = ("sources", "media")
    prepopulated_fields = {"code": ("title",)}
