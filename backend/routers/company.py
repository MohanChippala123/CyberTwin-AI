from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.company import Company, Asset
from schemas.company import CompanyCreate, CompanyResponse, AssetResponse
from services.claude_service import generate_assets
from services.risk_service import calculate_asset_risk_score, calculate_company_risk_score
import json

router = APIRouter(prefix="/api/company", tags=["company"])


@router.post("/generate", response_model=CompanyResponse)
async def generate_company(request: CompanyCreate, db: Session = Depends(get_db)):
    company = Company(
        name=request.name,
        domain=request.domain,
        industry=request.industry,
        employee_count=request.employee_count,
        is_demo=False,
    )
    db.add(company)
    db.flush()

    try:
        ai_assets = generate_assets(
            company.name,
            company.domain,
            company.industry,
            company.employee_count
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to generate assets: {str(e)}")

    assets = []
    for asset_data in ai_assets.get("assets", []):
        asset = Asset(
            company_id=company.id,
            name=asset_data.get("name", "Unknown"),
            asset_type=asset_data.get("asset_type", "server"),
            ip_address=asset_data.get("ip_address"),
            os=asset_data.get("os"),
            services=asset_data.get("services", []),
            risk_score=asset_data.get("risk_score", 5.0),
            status="critical" if asset_data.get("risk_score", 0.0) >= 8.0 else "warning" if asset_data.get("risk_score", 0.0) >= 6.0 else "safe",
            cve_ids=asset_data.get("cve_ids", []),
        )
        db.add(asset)
        assets.append(asset)

    db.flush()

    company.overall_risk_score = calculate_company_risk_score(assets, [])
    db.commit()

    return CompanyResponse(
        id=company.id,
        name=company.name,
        domain=company.domain,
        industry=company.industry,
        employee_count=company.employee_count,
        overall_risk_score=company.overall_risk_score,
        is_demo=company.is_demo,
        created_at=company.created_at,
        assets=[AssetResponse.from_orm(a) for a in assets]
    )


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(company_id: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    return CompanyResponse.from_orm(company)
