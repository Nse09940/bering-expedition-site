from datetime import date

from pydantic import BaseModel, ConfigDict


class SourceSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    author: str
    source_type: str
    publication_year: int | None
    origin: str
    archive_link: str
    description: str


class CitationSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    quote: str
    page_reference: str
    source: SourceSummary


class MediaAssetSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    file_url: str
    alt_text: str
    credit: str


class LocationSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    historical_name: str
    modern_name: str
    description: str
    accuracy_note: str
    latitude: float
    longitude: float


class EventSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    slug: str
    event_type: str
    summary: str
    happened_at: date | None
    location: LocationSummary | None
    citations: list[CitationSummary] = []
    media_assets: list[MediaAssetSummary] = []


class RouteSegmentSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    order: int
    geojson: str


class StageSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    order: int
    summary: str
    period_start: date
    period_end: date
    route_segments: list[RouteSegmentSummary] = []


class ExpeditionSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    slug: str
    summary: str
    period_start: date
    period_end: date
    status: str


class ExpeditionDetail(ExpeditionSummary):
    stages: list[StageSummary] = []
    events: list[EventSummary] = []
