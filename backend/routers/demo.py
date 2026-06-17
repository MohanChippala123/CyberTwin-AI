from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.company import Company, Asset
from models.attack import AttackPath
from services.mock_data import DEMO_COMPANY, DEMO_ASSETS, DEMO_ATTACK_PATHS
from services.risk_service import calculate_company_risk_score
from schemas.company import CompanyResponse, AssetResponse

router = APIRouter(prefix="/api/demo", tags=["demo"])


@router.get("/companies")
async def list_demo_companies(db: Session = Depends(get_db)):
    companies = db.query(Company).filter(Company.is_demo == True).all()

    return {
        "companies": [
            {
                "id": c.id,
                "name": c.name,
                "domain": c.domain,
                "industry": c.industry,
                "overall_risk_score": c.overall_risk_score,
                "is_demo": c.is_demo,
                "created_at": c.created_at
            }
            for c in companies
        ]
    }


@router.post("/seed")
async def seed_demo_company(db: Session = Depends(get_db)):
    db.query(Company).filter(Company.is_demo == True).delete()
    db.commit()

    company = Company(
        name=DEMO_COMPANY["name"],
        domain=DEMO_COMPANY["domain"],
        industry=DEMO_COMPANY["industry"],
        employee_count=DEMO_COMPANY["employee_count"],
        is_demo=True,
    )
    db.add(company)
    db.flush()

    assets = []
    for asset_data in DEMO_ASSETS:
        asset = Asset(
            company_id=company.id,
            name=asset_data["name"],
            asset_type=asset_data["asset_type"],
            ip_address=asset_data.get("ip_address"),
            os=asset_data.get("os"),
            services=asset_data.get("services", []),
            risk_score=asset_data.get("risk_score", 0.0),
            status=asset_data.get("status", "safe"),
            cve_ids=asset_data.get("cve_ids", []),
            pos_x=asset_data.get("pos_x", 0.0),
            pos_y=asset_data.get("pos_y", 0.0),
        )
        db.add(asset)
        assets.append(asset)

    db.flush()

    asset_map = {asset.name: asset.id for asset in assets}

    for path_data in DEMO_ATTACK_PATHS:
        attack_path = AttackPath(
            company_id=company.id,
            name=path_data["name"],
            description=path_data.get("description"),
            severity=path_data.get("severity"),
            mitre_tactics=path_data.get("mitre_tactics", []),
            steps=path_data.get("steps", []),
            source_asset_id=asset_map.get(path_data["steps"][0]["asset_name"]) if path_data.get("steps") else None,
            target_asset_id=asset_map.get(path_data["steps"][-1]["asset_name"]) if path_data.get("steps") else None,
            likelihood=path_data.get("likelihood", 0.5),
            impact=path_data.get("impact", 0.5),
        )
        db.add(attack_path)

    db.flush()

    attack_paths = db.query(AttackPath).filter(AttackPath.company_id == company.id).all()
    company.overall_risk_score = calculate_company_risk_score(assets, attack_paths)
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
