from __future__ import annotations

from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Expedition(Base):
    __tablename__ = "expeditions"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    summary: Mapped[str] = mapped_column(Text)
    period_start: Mapped[date] = mapped_column(Date)
    period_end: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(16), default="draft")

    stages: Mapped[list[Stage]] = relationship(back_populates="expedition")
    events: Mapped[list[Event]] = relationship(back_populates="expedition")


class Stage(Base):
    __tablename__ = "stages"

    id: Mapped[int] = mapped_column(primary_key=True)
    expedition_id: Mapped[int] = mapped_column(ForeignKey("expeditions.id"))
    title: Mapped[str] = mapped_column(String(255))
    order: Mapped[int] = mapped_column(Integer)
    summary: Mapped[str] = mapped_column(Text, default="")
    period_start: Mapped[date] = mapped_column(Date)
    period_end: Mapped[date] = mapped_column(Date)

    expedition: Mapped[Expedition] = relationship(back_populates="stages")
    route_segments: Mapped[list[RouteSegment]] = relationship(back_populates="stage")
    events: Mapped[list[Event]] = relationship(back_populates="stage")


class Location(Base):
    __tablename__ = "locations"

    id: Mapped[int] = mapped_column(primary_key=True)
    historical_name: Mapped[str] = mapped_column(String(255))
    modern_name: Mapped[str] = mapped_column(String(255), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    accuracy_note: Mapped[str] = mapped_column(String(255), default="")
    latitude: Mapped[float]
    longitude: Mapped[float]

    events: Mapped[list[Event]] = relationship(back_populates="location")


class RouteSegment(Base):
    __tablename__ = "route_segments"

    id: Mapped[int] = mapped_column(primary_key=True)
    stage_id: Mapped[int] = mapped_column(ForeignKey("stages.id"))
    title: Mapped[str] = mapped_column(String(255))
    order: Mapped[int] = mapped_column(Integer, default=1)
    geojson: Mapped[str] = mapped_column(Text)

    stage: Mapped[Stage] = relationship(back_populates="route_segments")


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True)
    expedition_id: Mapped[int] = mapped_column(ForeignKey("expeditions.id"))
    stage_id: Mapped[int | None] = mapped_column(ForeignKey("stages.id"), nullable=True)
    location_id: Mapped[int | None] = mapped_column(
        ForeignKey("locations.id"),
        nullable=True,
    )
    title: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    event_type: Mapped[str] = mapped_column(String(32))
    summary: Mapped[str] = mapped_column(Text)
    happened_at: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(16), default="draft")

    expedition: Mapped[Expedition] = relationship(back_populates="events")
    stage: Mapped[Stage | None] = relationship(back_populates="events")
    location: Mapped[Location | None] = relationship(back_populates="events")
    citations: Mapped[list[Citation]] = relationship(back_populates="event")
    media_assets: Mapped[list[MediaAsset]] = relationship(back_populates="event")


class Source(Base):
    __tablename__ = "sources"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    author: Mapped[str] = mapped_column(String(255), default="")
    source_type: Mapped[str] = mapped_column(String(32))
    publication_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    origin: Mapped[str] = mapped_column(String(255), default="")
    archive_link: Mapped[str] = mapped_column(String(512), default="")
    description: Mapped[str] = mapped_column(Text, default="")

    citations: Mapped[list[Citation]] = relationship(back_populates="source")


class Citation(Base):
    __tablename__ = "citations"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    source_id: Mapped[int] = mapped_column(ForeignKey("sources.id"))
    quote: Mapped[str] = mapped_column(Text)
    page_reference: Mapped[str] = mapped_column(String(128), default="")

    event: Mapped[Event] = relationship(back_populates="citations")
    source: Mapped[Source] = relationship(back_populates="citations")


class MediaAsset(Base):
    __tablename__ = "media_assets"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    file_url: Mapped[str] = mapped_column(String(512))
    alt_text: Mapped[str] = mapped_column(String(255))
    credit: Mapped[str] = mapped_column(String(255), default="")
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"))

    event: Mapped[Event] = relationship(back_populates="media_assets")
