from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models import Citation, Event, Expedition, Source, Stage
from app.schemas.catalog import ExpeditionDetail, ExpeditionSummary, EventSummary, SourceSummary

router = APIRouter()


@router.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok", "service": "backend"}


@router.get("/expeditions", response_model=list[ExpeditionSummary])
def list_expeditions(db: Session = Depends(get_db)) -> list[Expedition]:
    query = (
        select(Expedition)
        .where(Expedition.status == "published")
        .order_by(Expedition.period_start)
    )
    return list(db.scalars(query).all())


@router.get("/expeditions/{slug}", response_model=ExpeditionDetail)
def get_expedition(slug: str, db: Session = Depends(get_db)) -> Expedition:
    query = (
        select(Expedition)
        .where(Expedition.slug == slug, Expedition.status == "published")
        .options(
            selectinload(Expedition.stages).selectinload(Stage.route_segments),
            selectinload(Expedition.events).joinedload(Event.location),
            selectinload(Expedition.events)
            .selectinload(Event.citations)
            .joinedload(Citation.source),
            selectinload(Expedition.events).selectinload(Event.media_assets),
        )
    )
    expedition = db.scalar(query)
    if expedition is None:
        raise HTTPException(status_code=404, detail="Expedition not found")
    return expedition


@router.get("/sources", response_model=list[SourceSummary])
def list_sources(
    source_type: str | None = None,
    q: str | None = None,
    db: Session = Depends(get_db),
) -> list[Source]:
    query = select(Source).order_by(Source.title)
    if source_type:
        query = query.where(Source.source_type == source_type)
    if q:
        pattern = f"%{q}%"
        query = query.where(
            Source.title.ilike(pattern)
            | Source.author.ilike(pattern)
            | Source.origin.ilike(pattern)
        )
    return list(db.scalars(query).all())


@router.get("/events", response_model=list[EventSummary])
def list_events(
    expedition_slug: str | None = None,
    event_type: str | None = None,
    q: str | None = None,
    db: Session = Depends(get_db),
) -> list[Event]:
    query = (
        select(Event)
        .where(Event.status == "published")
        .options(
            selectinload(Event.expedition),
            selectinload(Event.location),
            selectinload(Event.citations).joinedload(Citation.source),
            selectinload(Event.media_assets),
        )
        .order_by(Event.happened_at)
    )
    if expedition_slug:
        query = query.join(Event.expedition).where(Expedition.slug == expedition_slug)
    if event_type:
        query = query.where(Event.event_type == event_type)
    if q:
        pattern = f"%{q}%"
        query = query.where(Event.title.ilike(pattern) | Event.summary.ilike(pattern))
    return list(db.scalars(query).all())


@router.get("/map-data")
def get_map_data(db: Session = Depends(get_db)) -> dict[str, object]:
    expeditions_query = (
        select(Expedition)
        .where(Expedition.status == "published")
        .options(
            selectinload(Expedition.stages).selectinload(Stage.route_segments),
            selectinload(Expedition.events).joinedload(Event.location),
        )
        .order_by(Expedition.period_start)
    )
    source_query = select(Source).order_by(Source.title)
    return {
        "expeditions": list(db.scalars(expeditions_query).all()),
        "sources": list(db.scalars(source_query).all()),
    }
