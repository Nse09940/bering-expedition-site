from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
import json

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


@router.get("/content")
def get_content(db: Session = Depends(get_db)) -> dict[str, object]:
    expeditions = list(
        db.scalars(
            select(Expedition)
            .where(Expedition.status == "published")
            .order_by(Expedition.period_start)
        ).all()
    )
    stages = list(db.scalars(select(Stage).order_by(Stage.order, Stage.id)).all())
    sources = list(db.scalars(select(Source).order_by(Source.title)).all())
    events = list(
        db.scalars(
            select(Event)
            .where(Event.status == "published")
            .options(
                selectinload(Event.location),
                selectinload(Event.citations).joinedload(Citation.source),
            )
            .order_by(Event.happened_at, Event.id)
        ).all()
    )

    expedition_id_map = {item.id: ("first" if "first" in item.slug else "second") for item in expeditions}
    stage_rows = []
    stage_id_map: dict[int, str] = {}
    for stage in stages:
        code = f"stage-{stage.id}"
        expedition_code = expedition_id_map.get(stage.expedition_id, "first")
        if expedition_code == "first":
            code = "first-siberia" if stage.order == 1 else "first-sea"
        if expedition_code == "second":
            if stage.order == 1:
                code = "second-prep"
            elif stage.order == 2:
                code = "second-america"
            else:
                code = "second-return"
        stage_id_map[stage.id] = code
        points = []
        if stage.route_segments:
            try:
                raw = json.loads(stage.route_segments[0].geojson)
                points = raw.get("points", [])
            except Exception:
                points = []
        stage_rows.append(
            {
                "id": code,
                "expeditionId": expedition_id_map.get(stage.expedition_id, "first"),
                "title": stage.title,
                "period": f"{stage.period_start.year}-{stage.period_end.year}",
                "summary": stage.summary,
                "route": points,
            }
        )

    source_id_by_dbid: dict[int, str] = {}
    source_rows = []
    for index, source in enumerate(sources, start=1):
        source_id = f"source-{index}"
        source_id_by_dbid[source.id] = source_id
        source_rows.append(
            {
                "id": source_id,
                "title": source.title,
                "author": source.author,
                "type": source.source_type,
                "year": str(source.publication_year or ""),
                "origin": source.origin,
                "archiveLink": source.archive_link,
                "description": source.description,
            }
        )

    event_rows = []
    for event in events:
        event_rows.append(
            {
                "id": event.slug,
                "expeditionId": expedition_id_map.get(event.expedition_id, "first"),
                "stageId": stage_id_map.get(event.stage_id or 0, "stage-unknown"),
                "title": event.title,
                "place": event.location.historical_name if event.location else "",
                "date": event.citations[0].quote if event.citations else (event.happened_at.isoformat() if event.happened_at else ""),
                "year": event.happened_at.year if event.happened_at else 1725,
                "type": event.event_type,
                "summary": event.summary,
                "quote": event.citations[0].quote if event.citations else event.summary,
                "sourceIds": [
                    source_id_by_dbid[item.source_id]
                    for item in event.citations
                    if item.source_id in source_id_by_dbid
                ],
                "image": "Иллюстрация события",
                "coords": {
                    "x": event.location.longitude if event.location else 0,
                    "y": event.location.latitude if event.location else 0,
                },
                "accuracy": event.location.accuracy_note if event.location else "",
            }
        )

    return {
        "expeditions": [
            {
                "id": expedition_id_map.get(item.id, "first"),
                "slug": item.slug,
                "title": item.title,
                "shortTitle": item.title,
                "period": f"{item.period_start.year}-{item.period_end.year}",
                "summary": item.summary,
                "goal": item.summary,
                "results": [item.summary],
            }
            for item in expeditions
        ],
        "stages": stage_rows,
        "events": event_rows,
        "sources": source_rows,
    }
