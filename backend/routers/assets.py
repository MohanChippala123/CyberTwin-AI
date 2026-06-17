from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.company import Company, Asset
from schemas.company import AssetResponse
from typing import List

router = APIRouter(prefix="/api/assets", tags=["assets"])


@router.get("/{company_id}", response_model=List[AssetResponse])
async def get_company_assets(company_id: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    assets = db.query(Asset).filter(Asset.company_id == company_id).all()
    return [AssetResponse.from_orm(a) for a in assets]


@router.get("/asset/{asset_id}", response_model=AssetResponse)
async def get_asset(asset_id: str, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    return AssetResponse.from_orm(asset)
