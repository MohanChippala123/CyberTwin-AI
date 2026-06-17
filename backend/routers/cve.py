from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.company import Company, Asset
from services.cve_service import lookup_cves_for_asset, search_cves

router = APIRouter(prefix="/api/cve", tags=["cve"])


@router.get("/lookup/{asset_id}")
async def lookup_asset_cves(asset_id: str, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    cves = search_cves(" ".join(asset.cve_ids) if asset.cve_ids else "", limit=10)

    return {
        "asset_id": asset_id,
        "asset_name": asset.name,
        "cves": cves
    }


@router.get("/search")
async def search_cve_database(query: str, limit: int = 10):
    if not query or len(query) < 2:
        raise HTTPException(status_code=400, detail="Query too short")

    cves = search_cves(query, limit=limit)

    return {
        "query": query,
        "results": cves,
        "total": len(cves)
    }
